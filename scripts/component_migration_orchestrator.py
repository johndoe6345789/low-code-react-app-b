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
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

try:
    from openai_agents import Agent, Runner  # type: ignore
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
        for path in sorted(root.glob("*.tsx")):
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


def run_agent_for_component(target: ComponentTarget) -> Dict[str, Any]:
    tsx = target.path.read_text(encoding="utf-8")
    prompt = PROMPT_TEMPLATE.format(category=target.category, path=target.path, tsx=tsx)
    result = Runner.run_sync(ANALYSIS_AGENT, prompt)
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    data = json.loads(output)
    return data


def write_output(out_dir: Path, data: Dict[str, Any]) -> None:
    component_name = data.get("componentName") or "unknown-component"
    component_dir = out_dir / component_name
    component_dir.mkdir(parents=True, exist_ok=True)

    (component_dir / "analysis.json").write_text(
        json.dumps(data, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    hook = data.get("hook")
    if hook and hook.get("source"):
        hook_path = component_dir / Path(hook["filePath"]).name
        hook_path.write_text(hook["source"], encoding="utf-8")

    json_def = data.get("jsonDefinition") or {}
    json_def_path = component_dir / Path(json_def.get("filePath", "component.json")).name
    json_def_path.write_text(
        json.dumps(json_def.get("source", {}), indent=2, sort_keys=True),
        encoding="utf-8",
    )

    interface = data.get("interface") or {}
    interface_path = component_dir / Path(interface.get("filePath", "interface.ts")).name
    interface_path.write_text(interface.get("source", ""), encoding="utf-8")

    export_snippets = {
        "json-components.ts": (data.get("jsonComponentExport") or {}).get("source", ""),
        "exports.json": json.dumps(data.get("exports", {}), indent=2, sort_keys=True),
    }
    for filename, content in export_snippets.items():
        (component_dir / filename).write_text(content, encoding="utf-8")


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

    failures: List[str] = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(run_agent_for_component, t): t for t in targets}
        for future in as_completed(futures):
            target = futures[future]
            try:
                data = future.result()
                write_output(out_dir, data)
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
