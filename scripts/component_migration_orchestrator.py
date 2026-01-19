#!/usr/bin/env python3
"""
Batch component migration orchestrator using openai-agents.

Usage:
  python scripts/component_migration_orchestrator.py --out-dir migration-out
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import textwrap
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

try:
    from agents import Agent, Runner  # type: ignore
except Exception as exc:  # pragma: no cover - runtime dependency check
    raise SystemExit(
        "openai-agents is required. Install with: pip install openai-agents"
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
COMPONENT_DIRS = [
    ROOT / "src" / "components" / "atoms",
    ROOT / "src" / "components" / "molecules",
    ROOT / "src" / "components" / "organisms",
]


@dataclass(frozen=True)
class ComponentTarget:
    name: str
    path: Path
    category: str


ANALYSIS_AGENT = Agent(
    name="ComponentAnalyzer",
    instructions=(
        "You are a migration assistant. Given a TSX component, analyze it and "
        "produce a JSON-only response that includes: stateful analysis, "
        "hook details if needed, JSON UI definition, TS interface, "
        "and export updates. Follow the provided workflow."
    ),
)


PROMPT_TEMPLATE = """\
You are converting a React TSX component to the JSON-driven system.
Follow this workflow strictly:
1) Identify if stateful (uses useState/useEffect/other hooks).
2) If stateful, extract logic into a custom hook file in src/hooks/use-<component>.ts.
3) Create JSON definition under src/components/json-definitions/<component>.json.
4) Create interface in src/lib/json-ui/interfaces/<component>.ts.
5) Provide export updates for:
   - src/hooks/index.ts (if hook exists)
   - src/lib/json-ui/hooks-registry.ts (if hook exists)
   - src/lib/json-ui/interfaces/index.ts
   - src/lib/json-ui/json-components.ts
   - src/components/<category>/index.ts
6) Indicate that TSX file should be deleted.

Return ONLY valid JSON with this shape:
{{
  "componentName": "...",
  "category": "atoms|molecules|organisms",
  "isStateful": true|false,
  "hook": {{
    "name": "useComponentName",
    "filePath": "src/hooks/use-component-name.ts",
    "source": "...typescript..."
  }} | null,
  "jsonDefinition": {{
    "filePath": "src/components/json-definitions/component-name.json",
    "source": {{ ...json... }}
  }},
  "interface": {{
    "filePath": "src/lib/json-ui/interfaces/component-name.ts",
    "source": "...typescript..."
  }},
  "jsonComponentExport": {{
    "filePath": "src/lib/json-ui/json-components.ts",
    "source": "...typescript snippet..."
  }},
  "exports": {{
    "hooksIndex": "...typescript snippet or null...",
    "hooksRegistry": "...typescript snippet or null...",
    "interfacesIndex": "...typescript snippet...",
    "componentsIndex": "...typescript snippet..."
  }},
  "deleteTsx": true
}}

Component category: {category}
Component path: {path}

TSX source:
{tsx}
"""


def list_components(roots: Iterable[Path]) -> List[ComponentTarget]:
    targets: List[ComponentTarget] = []
    for root in roots:
        if not root.exists():
            continue
        for path in sorted(root.rglob("*.tsx")):
            name = path.stem
            targets.append(
                ComponentTarget(name=name, path=path, category=path.parent.name)
            )
    return targets


def apply_filters(
    targets: List[ComponentTarget],
    include: Optional[str],
    exclude: Optional[str],
    limit: Optional[int],
) -> List[ComponentTarget]:
    if include:
        rx = re.compile(include)
        targets = [t for t in targets if rx.search(t.name)]
    if exclude:
        rx = re.compile(exclude)
        targets = [t for t in targets if not rx.search(t.name)]
    if limit is not None:
        targets = targets[:limit]
    return targets


def _strip_code_fences(output: str) -> str:
    trimmed = output.strip()
    if trimmed.startswith("```"):
        lines = trimmed.splitlines()
        if len(lines) >= 3 and lines[0].startswith("```") and lines[-1].startswith("```"):
            return "\n".join(lines[1:-1]).strip()
    return output


def run_agent_for_component(target: ComponentTarget, debug: bool = False) -> Dict[str, Any]:
    tsx = target.path.read_text(encoding="utf-8")
    prompt = PROMPT_TEMPLATE.format(category=target.category, path=target.path, tsx=tsx)
    result = Runner.run_sync(ANALYSIS_AGENT, prompt)
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    if not isinstance(output, str) or not output.strip():
        raise ValueError(
            "Agent returned empty output. Check OPENAI_API_KEY and model access."
        )
    output = _strip_code_fences(output)
    if debug:
        preview = textwrap.shorten(output.replace("\n", " "), width=300, placeholder="...")
        print(f"[debug] {target.name} raw output preview: {preview}")
    try:
        data = json.loads(output)
    except json.JSONDecodeError as exc:
        snippet = output.strip().replace("\n", " ")[:200]
        raise ValueError(
            f"Agent output was not valid JSON: {exc}. Output starts with: {snippet!r}"
        ) from exc
    return data


def _write_if_content(path: Path, content: str) -> None:
    if not content.strip():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _append_unique(path: Path, content: str) -> None:
    if not content.strip():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    if content.strip() in existing:
        return
    separator = "\n" if existing.endswith("\n") or not existing else "\n\n"
    path.write_text(existing + separator + content.strip() + "\n", encoding="utf-8")


def write_output(out_dir: Path, data: Dict[str, Any], target: ComponentTarget) -> None:
    component_name = data.get("componentName") or "unknown-component"

    report_path = out_dir / "migration-reports" / f"{component_name}.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(
        json.dumps(data, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    hook = data.get("hook")
    if hook and hook.get("source"):
        hook_path = out_dir / hook["filePath"]
        _write_if_content(hook_path, hook["source"])

    json_def = data.get("jsonDefinition") or {}
    json_def_path = (
        out_dir / "src" / "components" / "json-definitions" / f"{component_name}.json"
    )
    json_def_source = json.dumps(
        json_def.get("source", {}), indent=2, sort_keys=True
    )
    _write_if_content(json_def_path, json_def_source)

    interface = data.get("interface") or {}
    interface_path = out_dir / interface.get(
        "filePath", f"src/lib/json-ui/interfaces/{component_name}.ts"
    )
    _write_if_content(interface_path, interface.get("source", ""))

    json_component_export = (data.get("jsonComponentExport") or {}).get("source", "")
    _append_unique(out_dir / "src/lib/json-ui/json-components.ts", json_component_export)

    exports = data.get("exports") or {}
    _append_unique(out_dir / "src/lib/json-ui/interfaces/index.ts", exports.get("interfacesIndex", ""))
    _append_unique(out_dir / "src/hooks/index.ts", exports.get("hooksIndex", "") or "")
    _append_unique(out_dir / "src/lib/json-ui/hooks-registry.ts", exports.get("hooksRegistry", "") or "")

    components_index_path = out_dir / "src/components" / target.category / "index.ts"
    _append_unique(components_index_path, exports.get("componentsIndex", ""))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Batch TSX->JSON migration helper.")
    parser.add_argument(
        "--out-dir",
        default=str(ROOT / "migration-out"),
        help="Directory to write generated artifacts.",
    )
    parser.add_argument(
        "--include",
        help="Regex to include component names.",
    )
    parser.add_argument(
        "--exclude",
        help="Regex to exclude component names.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        help="Limit number of components to process.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Max concurrent components to process.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only list components that would be processed.",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable verbose logging for agent output parsing.",
    )
    parser.add_argument(
        "--clean-out",
        action="store_true",
        help="Remove legacy per-component folders under the output directory.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir).resolve()

    targets = list_components(COMPONENT_DIRS)
    targets = apply_filters(targets, args.include, args.exclude, args.limit)

    if args.dry_run:
        for t in targets:
            print(f"{t.category}/{t.name} -> {t.path}")
        return 0

    out_dir.mkdir(parents=True, exist_ok=True)
    if args.clean_out:
        for child in out_dir.iterdir():
            if not child.is_dir():
                continue
            if child.name in ("src", "migration-reports"):
                continue
            legacy_markers = [
                child / "analysis.json",
                child / "json-components.ts",
                child / "exports.json",
            ]
            if any(marker.exists() for marker in legacy_markers):
                shutil.rmtree(child)

    failures: List[str] = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(run_agent_for_component, t, args.debug): t for t in targets
        }
        for future in as_completed(futures):
            target = futures[future]
            try:
                data = future.result()
                write_output(out_dir, data, target)
                print(f"ok: {target.name}")
            except Exception as exc:
                failures.append(f"{target.name}: {exc}")
                print(f"error: {target.name}: {exc}", file=sys.stderr)

    if failures:
        print("\nFailures:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
