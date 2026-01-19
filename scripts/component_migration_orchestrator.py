#!/usr/bin/env python3
"""
Batch component migration orchestrator using openai-agents.

Usage:
  python scripts/component_migration_orchestrator.py
"""
from __future__ import annotations

import json
import os
import sys
import textwrap
import difflib
import time
import random
import re
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError as FuturesTimeoutError
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

try:
    from agents import Agent, Runner  # type: ignore
except Exception as exc:  # pragma: no cover - runtime dependency check
    raise SystemExit(
        "openai-agents is required. Install with: pip install openai-agents"
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = os.getenv("CODEX_MODEL") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
API_CALL_DELAY_SECONDS = 2.0
API_CALL_TIMEOUT_SECONDS = 120.0
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


PROMPT_TEMPLATE = """\
You are converting a React TSX component to the JSON-driven system.
Follow this workflow strictly:
1) Identify if stateful (uses useState/useEffect/other hooks).
2) If stateful, extract logic into a custom hook file in src/hooks/use-<component>.ts.
3) Create JSON definition under src/components/json-definitions/<component>.json.
4) Create interface in src/lib/json-ui/interfaces/<component>.ts.
5) Create config page schema under src/config/pages/<category>/<component-name-kebab>.json.
6) Update json-components-registry.json with a new entry for the component if missing.
7) Provide export updates for:
   - src/hooks/index.ts (if hook exists)
   - src/lib/json-ui/hooks-registry.ts (if hook exists)
   - src/lib/json-ui/interfaces/index.ts
   - src/lib/json-ui/json-components.ts
   - src/components/<category>/index.ts
8) Indicate that TSX file should be deleted.

IMPORTANT:
- Return ONLY valid JSON. No Markdown or code fences.
- For json-components.ts, output ONLY the snippet for the component export, matching this style:
  export const ComponentName = createJsonComponent<ComponentNameProps>(componentNameDef)
  OR
  export const ComponentName = createJsonComponentWithHooks<ComponentNameProps>(componentNameDef, {{ ... }})
- For createJsonComponentWithHooks, ALWAYS include a "hooks" object with hookName + args, e.g.:
  export const ComponentName = createJsonComponentWithHooks<ComponentNameProps>(componentNameDef, {{
    hooks: {{
      hookData: {{
        hookName: "useComponentName",
        args: (props) => [props.example]
      }}
    }}
  }})
- Do NOT output any `jsonComponents` object or registry literal.
- Provide `diffs` with unified diff lines (one string per line) for each target file,
  using the provided file contents as the "before" version.
- Include diffs for the config page schema file and json-components-registry.json.

Config page schema format (src/config/pages/<category>/<component-name-kebab>.json):
- Simple JSON-compatible component:
  {{
    "type": "ComponentName",
    "props": {{ ... }}
  }}
- Wrapper-required component (use when hooks/complex logic or not JSON-compatible):
  {{
    "type": "ComponentName",
    "jsonCompatible": false,
    "wrapperRequired": true,
    "load": {{
      "path": "@/components/<category>/ComponentName",
      "export": "ComponentName"
    }},
    "props": {{ ... }},
    "metadata": {{
      "notes": "Contains hooks - needs wrapper"
    }}
  }}

JSON definition schema (src/components/json-definitions/<component>.json):
- Single UIComponent tree using this shape:
  {{
    "id": "component-id",
    "type": "ComponentType",
    "props": {{ ... }},
    "className": "optional classes",
    "style": {{ ... }},
    "bindings": {{
      "propName": {{
        "source": "data.path",
        "path": "optional.path",
        "transform": "optional js expression"
      }}
    }},
    "dataBinding": "data.path" | {{
      "source": "data.path",
      "path": "optional.path",
      "transform": "optional js expression"
    }},
    "events": [{{ "event": "click", "actions": [{{ "id": "...", "type": "custom" }}] }}] |
              {{ "click": {{ "action": "customActionId" }} }},
    "conditional": {{
      "if": "expression",
      "then": {{ ... }} | [{{ ... }}, "..."] | "...",
      "else": {{ ... }} | [{{ ... }}, "..."] | "..."
    }},
    "loop": {{
      "source": "data.path",
      "itemVar": "item",
      "indexVar": "index"
    }},
    "children": "text" | [{{ ... }}, "..."]
  }}
- Use nested UIComponents in children.

Registry entry format (json-components-registry.json) for the component if missing:
{{
  "type": "ComponentName",
  "name": "ComponentName",
  "category": "layout|input|display|navigation|feedback|data|custom",
  "canHaveChildren": true|false,
  "description": "Short description",
  "status": "supported",
  "source": "atoms|molecules|organisms|ui|custom",
  "jsonCompatible": true|false,
  "wrapperRequired": true|false,
  "load": {{
    "path": "@/components/<category>/ComponentName",
    "export": "ComponentName"
  }},
  "metadata": {{
    "conversionDate": "YYYY-MM-DD",
    "autoGenerated": true,
    "notes": "Optional notes"
  }}
}}
Omit optional fields when not applicable.

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
  "configPageSchema": {{
    "filePath": "src/config/pages/<category>/component-name.json",
    "source": {{ ...json... }}
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
  "diffs": [
    {{
      "path": "src/lib/json-ui/json-components.ts",
      "diffLines": ["@@ ...", "+...", "-..."]
    }}
  ],
  "deleteTsx": true
}}

Component category: {category}
Component path: {path}

Existing file contents for diffing:
{existing_files}

TSX source:
{tsx}
"""


CONFLICT_PROMPT_TEMPLATE = """\
You are resolving a unified diff that failed to apply cleanly.
Return ONLY valid JSON with this shape:
{{
  "path": "{path}",
  "resolvedContent": "...full file content..."
}}

Rules:
- Use the diff to update the original content.
- Preserve unrelated content.
- Do NOT return Markdown or code fences.

Original content:
{original}

Diff lines:
{diff_lines}
"""

CONFLICT_PROMPT_TEMPLATE_STRICT = """\
You must return ONLY valid JSON with BOTH keys: "path" and "resolvedContent".
"resolvedContent" must be the full file content string (no Markdown, no code fences).
Do not omit it. Do not return arrays.

JSON shape:
{{ "path": "{path}", "resolvedContent": "...full file content..." }}

Original content:
{original}

Diff lines:
{diff_lines}
"""

CONFLICT_PROMPT_TEMPLATE_CONTENT_ONLY = """\
Return ONLY the full merged file content. No JSON, no code fences, no commentary.
Use the diff to update the original content and preserve unrelated content.
If the diff cannot be applied, return the original content unchanged.

Original content:
{original}

Diff lines:
{diff_lines}
"""

JSON_REPAIR_TEMPLATE = """\
Fix the following output so it is valid JSON only. Return ONLY the corrected JSON.
Do not add commentary or code fences. Preserve all keys and values.

Error:
{error}

Output to repair:
{output}
"""

CONFIG_PAGE_SCHEMA_REPAIR_TEMPLATE = """\
Generate a config page schema JSON for this component.
Return ONLY valid JSON. No Markdown or code fences.

Component name: {component_name}
Category: {category}
Is stateful: {is_stateful}
JSON definition source:
{json_definition}

Existing config content (may be empty):
{existing_content}

Rules:
- Simple JSON-compatible component:
  {{
    "type": "ComponentName",
    "props": {{ ... }}
  }}
- If stateful or not JSON-compatible, use wrapper-required format:
  {{
    "type": "ComponentName",
    "jsonCompatible": false,
    "wrapperRequired": true,
    "load": {{
      "path": "@/components/{category}/ComponentName",
      "export": "ComponentName"
    }},
    "props": {{ ... }},
    "metadata": {{
      "notes": "Contains hooks - needs wrapper"
    }}
  }}
- Prefer props from the JSON definition "props" field if present, else use {{}}.
"""

REGISTRY_REPAIR_TEMPLATE = """\
Fix the registry JSON to match the required schema. Return ONLY valid JSON.
No Markdown or code fences.

Registry schema:
{schema}

Reference header (use for top-level fields and shape):
{reference_header}

Current registry content:
{current}

Rules:
- Output must be an object with "version", "description", and "components" (array).
- Preserve existing component entries; if entries are under "elements", "component", or "data",
  move them into the "components" array.
- Keep any existing metadata or load info on entries.
- Update or keep "lastUpdated" as a string if present in the reference header.
"""

HOOK_REPAIR_TEMPLATE = """\
Generate the custom hook file needed for this JSON component conversion.
Return ONLY valid JSON with this shape:
{{
  "hook": {{
    "name": "{hook_name}",
    "filePath": "{hook_file_path}",
    "source": "...typescript..."
  }} | null
}}

Rules:
- Use the provided hook name and file path if a hook is needed.
- Extract stateful/side-effect logic from the TSX into the hook.
- If the component is stateless and doesn't need a hook, return {{"hook": null}}.
- Do NOT include Markdown or code fences.

Component name: {component_name}
Category: {category}
Expected hook name: {hook_name}
Expected hook path: {hook_file_path}

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
                ComponentTarget(name=name, path=path, category=root.name)
            )
    return targets


def _strip_code_fences(output: str) -> str:
    trimmed = output.strip()
    if trimmed.startswith("```"):
        lines = trimmed.splitlines()
        if len(lines) >= 3 and lines[0].startswith("```") and lines[-1].startswith("```"):
            return "\n".join(lines[1:-1]).strip()
    return trimmed


def _to_kebab_case(name: str) -> str:
    if not name:
        return ""
    return re.sub(r"([A-Z])", r"-\1", name).lower().lstrip("-")


def _to_lower_camel(name: str) -> str:
    if not name:
        return ""
    return name[0].lower() + name[1:]


def _to_pascal_from_kebab(name: str) -> str:
    parts = [part for part in name.split("-") if part]
    return "".join(part[:1].upper() + part[1:] for part in parts)


def _extract_json_payload(output: str) -> str:
    trimmed = _strip_code_fences(output)
    start = trimmed.find("{")
    end = trimmed.rfind("}")
    if start == -1 or end == -1 or end < start:
        return trimmed
    return trimmed[start : end + 1]


def _read_file_for_prompt(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def _read_existing_file(out_dir: Path, rel_path: str) -> str:
    out_path = out_dir / rel_path
    if out_path.exists():
        return out_path.read_text(encoding="utf-8")
    return _read_file_for_prompt(ROOT / rel_path)


def _build_agent() -> Agent:
    return Agent(
        name="ComponentAnalyzer",
        instructions=(
            "You are a migration assistant. Given a TSX component, analyze it and "
            "produce a JSON-only response that includes: stateful analysis, "
            "hook details if needed, JSON UI definition, TS interface, "
            "and export updates. Follow the provided workflow."
        ),
        model=DEFAULT_MODEL,
    )


def _build_conflict_agent() -> Agent:
    return Agent(
        name="DiffConflictResolver",
        instructions=(
            "Resolve unified diff conflicts by producing the fully merged file content. "
            "Return JSON only with 'path' and 'resolvedContent'."
        ),
        model=DEFAULT_MODEL,
    )


def _build_json_repair_agent() -> Agent:
    return Agent(
        name="JSONRepair",
        instructions="Fix invalid JSON output. Return ONLY valid JSON, no Markdown.",
        model=DEFAULT_MODEL,
    )


def _build_content_only_agent() -> Agent:
    return Agent(
        name="DiffContentOnly",
        instructions="Return ONLY the full merged file content. No JSON.",
        model=DEFAULT_MODEL,
    )


def _build_schema_repair_agent() -> Agent:
    return Agent(
        name="SchemaRepair",
        instructions="Generate schema JSON only. Return ONLY valid JSON, no Markdown.",
        model=DEFAULT_MODEL,
    )


def _build_hook_repair_agent() -> Agent:
    return Agent(
        name="HookRepair",
        instructions="Generate hook JSON only. Return ONLY valid JSON, no Markdown.",
        model=DEFAULT_MODEL,
    )


def _is_rate_limited(exc: Exception) -> bool:
    status = getattr(exc, "status_code", None)
    if status == 429:
        return True
    response = getattr(exc, "response", None)
    if response is not None and getattr(response, "status_code", None) == 429:
        return True
    message = str(exc).lower()
    return "rate limit" in message or "too many requests" in message or "429" in message


def _run_sync_with_timeout(agent: Agent, prompt: str, timeout: float) -> Any:
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(Runner.run_sync, agent, prompt)
        return future.result(timeout=timeout)


def _run_with_retries(agent: Agent, prompt: str, label: str) -> Any:
    max_retries = 5
    max_attempts = max_retries + 1
    base_delay = 1.5
    max_delay = 20.0
    attempt = 0
    while True:
        try:
            attempt += 1
            print(
                (
                    f"[info] {label} attempt {attempt}/{max_attempts}: "
                    f"sleeping {API_CALL_DELAY_SECONDS:.1f}s before API call"
                ),
                file=sys.stderr,
            )
            time.sleep(API_CALL_DELAY_SECONDS)
            result = _run_sync_with_timeout(
                agent, prompt, API_CALL_TIMEOUT_SECONDS
            )
            print(
                f"[info] {label} attempt {attempt}/{max_attempts} completed",
                file=sys.stderr,
            )
            return result
        except Exception as exc:
            is_timeout = isinstance(exc, (FuturesTimeoutError, TimeoutError))
            if not _is_rate_limited(exc) and not is_timeout:
                print(
                    f"[error] {label} attempt {attempt} failed: {exc}",
                    file=sys.stderr,
                )
                raise
            if attempt >= max_attempts:
                raise
            delay = min(max_delay, base_delay * (2 ** (attempt - 1)))
            delay += random.uniform(0, delay * 0.2)
            if is_timeout:
                print(
                    (
                        f"[warn] timeout {label} after {API_CALL_TIMEOUT_SECONDS:.0f}s; "
                        f"retry {attempt}/{max_retries} in {delay:.1f}s"
                    ),
                    file=sys.stderr,
                )
            else:
                print(
                    f"[warn] rate limited {label}; retry {attempt}/{max_retries} in {delay:.1f}s",
                    file=sys.stderr,
                )
            time.sleep(delay)


def run_agent_for_component(
    target: ComponentTarget, out_dir: Path, debug: bool = False
) -> Dict[str, Any]:
    tsx = target.path.read_text(encoding="utf-8")
    config_file_name = f"{_to_kebab_case(target.name)}.json"
    existing_files = {
        "src/lib/json-ui/json-components.ts": _read_existing_file(
            out_dir, "src/lib/json-ui/json-components.ts"
        ),
        "src/lib/json-ui/interfaces/index.ts": _read_existing_file(
            out_dir, "src/lib/json-ui/interfaces/index.ts"
        ),
        "src/hooks/index.ts": _read_existing_file(out_dir, "src/hooks/index.ts"),
        "src/lib/json-ui/hooks-registry.ts": _read_existing_file(
            out_dir, "src/lib/json-ui/hooks-registry.ts"
        ),
        "json-components-registry.json": _read_existing_file(
            out_dir, "json-components-registry.json"
        ),
        f"src/config/pages/{target.category}/{config_file_name}": _read_existing_file(
            out_dir, f"src/config/pages/{target.category}/{config_file_name}"
        ),
        f"src/components/{target.category}/index.ts": _read_existing_file(
            out_dir, f"src/components/{target.category}/index.ts"
        ),
    }
    existing_files_blob = "\n\n".join(
        f"--- {path} ---\n{content}" for path, content in existing_files.items()
    )
    prompt = PROMPT_TEMPLATE.format(
        category=target.category,
        path=target.path,
        tsx=tsx,
        existing_files=existing_files_blob,
    )
    result = _run_with_retries(_build_agent(), prompt, f"analysis:{target.name}")
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    if not isinstance(output, str) or not output.strip():
        raise ValueError(
            "Agent returned empty output. Check OPENAI_API_KEY and model access."
        )
    output = _extract_json_payload(output)
    if debug:
        preview = textwrap.shorten(output.replace("\n", " "), width=300, placeholder="...")
        print(f"[debug] {target.name} raw output preview: {preview}")
    data = _parse_json_output(output, f"analysis:{target.name}", debug)
    return data


def _resolve_diff_with_agent(
    path: str, original: str, diff_lines: List[str], debug: bool
) -> str:
    diff_blob = "\n".join(diff_lines)
    prompt = CONFLICT_PROMPT_TEMPLATE.format(
        path=path,
        original=original,
        diff_lines=diff_blob,
    )
    result = _run_with_retries(_build_conflict_agent(), prompt, f"conflict:{path}")
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    if not isinstance(output, str) or not output.strip():
        raise ValueError("Conflict resolver returned empty output.")
    output = _extract_json_payload(output)
    if debug:
        preview = textwrap.shorten(output.replace("\n", " "), width=300, placeholder="...")
        print(f"[debug] conflict resolver output preview: {preview}")
    data = _parse_json_output(output, f"conflict:{path}", debug)
    resolved = _extract_resolved_content(data, path)
    if not resolved:
        strict_prompt = CONFLICT_PROMPT_TEMPLATE_STRICT.format(
            path=path,
            original=original,
            diff_lines=diff_blob,
        )
        retry = _run_with_retries(
            _build_conflict_agent(), strict_prompt, f"conflict-strict:{path}"
        )
        retry_output = getattr(retry, "final_output", None)
        if retry_output is None:
            retry_output = str(retry)
        if not isinstance(retry_output, str) or not retry_output.strip():
            raise ValueError("Conflict resolver strict returned empty output.")
        retry_output = _extract_json_payload(retry_output)
        data = _parse_json_output(retry_output, f"conflict-strict:{path}", debug)
        resolved = _extract_resolved_content(data, path)
    if not resolved:
        content_prompt = CONFLICT_PROMPT_TEMPLATE_CONTENT_ONLY.format(
            original=original,
            diff_lines=diff_blob,
        )
        content_result = _run_with_retries(
            _build_content_only_agent(), content_prompt, f"conflict-content:{path}"
        )
        content_output = getattr(content_result, "final_output", None)
        if content_output is None:
            content_output = str(content_result)
        if not isinstance(content_output, str) or not content_output.strip():
            raise ValueError("Conflict resolver content-only returned empty output.")
        resolved = _coerce_content_output(
            content_output, path, f"conflict-content:{path}", debug
        )
    if not resolved:
        print(
            f"[warn] conflict resolver failed for {path}; keeping original content",
            file=sys.stderr,
        )
        return original
    return resolved


def _repair_json_output(output: str, error: str, label: str, debug: bool) -> Dict[str, Any]:
    last_error = error
    current_output = output
    for attempt in range(2):
        prompt = JSON_REPAIR_TEMPLATE.format(error=last_error, output=current_output)
        result = _run_with_retries(_build_json_repair_agent(), prompt, f"repair:{label}")
        fixed_output = getattr(result, "final_output", None)
        if fixed_output is None:
            fixed_output = str(result)
        if not isinstance(fixed_output, str) or not fixed_output.strip():
            raise ValueError("JSON repair returned empty output.")
        fixed_output = _extract_json_payload(fixed_output)
        if debug:
            preview = textwrap.shorten(
                fixed_output.replace("\n", " "), width=300, placeholder="..."
            )
            print(f"[debug] {label} repaired output preview: {preview}")
        try:
            return json.loads(fixed_output)
        except json.JSONDecodeError as exc:
            last_error = str(exc)
            current_output = fixed_output
            if attempt == 0:
                print(
                    f"[warn] {label} repair attempt failed: {exc}; retrying",
                    file=sys.stderr,
                )
                continue
            raise


def _parse_json_output(output: str, label: str, debug: bool) -> Dict[str, Any]:
    try:
        return json.loads(output)
    except json.JSONDecodeError as exc:
        return _repair_json_output(output, str(exc), label, debug)


def _extract_resolved_content(data: Dict[str, Any], path: str) -> str | None:
    resolved = data.get("resolvedContent")
    if isinstance(resolved, str) and resolved.strip():
        return resolved
    if isinstance(resolved, (dict, list)) and Path(path).suffix == ".json":
        return json.dumps(resolved, indent=2) + "\n"
    return None


def _coerce_content_output(output: str, path: str, label: str, debug: bool) -> str:
    stripped = _strip_code_fences(str(output)).strip()
    if not stripped:
        return ""
    try:
        parsed = json.loads(_extract_json_payload(stripped))
    except json.JSONDecodeError:
        return stripped
    if isinstance(parsed, dict):
        resolved = _extract_resolved_content(parsed, path)
        if resolved:
            return resolved
    if isinstance(parsed, str):
        return parsed
    if isinstance(parsed, (dict, list)) and Path(path).suffix == ".json":
        return json.dumps(parsed, indent=2) + "\n"
    if debug:
        print(f"[warn] {label} content-only output unexpected JSON shape", file=sys.stderr)
    return stripped


def _validate_and_repair_json_file(path: Path, label: str, debug: bool) -> None:
    if not path.exists():
        return
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(
            f"[warn] invalid JSON in {path}: {exc}; attempting repair",
            file=sys.stderr,
        )
        repaired = _repair_json_output(
            path.read_text(encoding="utf-8"), str(exc), label, debug
        )
        path.write_text(json.dumps(repaired, indent=2) + "\n", encoding="utf-8")


def _repair_config_page_schema(
    path: Path,
    component_name: str,
    category: str,
    data: Dict[str, Any],
    debug: bool,
) -> None:
    json_definition = json.dumps(
        (data.get("jsonDefinition") or {}).get("source", {}), indent=2
    )
    existing_content = path.read_text(encoding="utf-8") if path.exists() else ""
    prompt = CONFIG_PAGE_SCHEMA_REPAIR_TEMPLATE.format(
        component_name=component_name,
        category=category,
        is_stateful=bool(data.get("isStateful") or data.get("hook")),
        json_definition=json_definition,
        existing_content=existing_content,
    )
    result = _run_with_retries(
        _build_schema_repair_agent(), prompt, f"config-repair:{component_name}"
    )
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    output = _extract_json_payload(str(output))
    repaired = _parse_json_output(output, f"config-repair:{component_name}", debug)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(repaired, indent=2) + "\n", encoding="utf-8")


def _ensure_config_page_schema(
    path: Path,
    component_name: str,
    category: str,
    data: Dict[str, Any],
    debug: bool,
) -> None:
    if not path.exists():
        _repair_config_page_schema(path, component_name, category, data, debug)
        return
    _validate_and_repair_json_file(path, f"config:{component_name}", debug)
    try:
        content = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        _repair_config_page_schema(path, component_name, category, data, debug)
        return
    if not isinstance(content, dict) or not content.get("type"):
        _repair_config_page_schema(path, component_name, category, data, debug)


def _repair_registry_file(path: Path, debug: bool) -> None:
    if not path.exists():
        return
    try:
        current = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        current = _repair_json_output(
            path.read_text(encoding="utf-8"), str(exc), "registry", debug
        )
    schema_path = ROOT / "schemas" / "json-components-registry-schema.json"
    schema = schema_path.read_text(encoding="utf-8") if schema_path.exists() else "{}"
    reference = {}
    reference_path = ROOT / "json-components-registry.json"
    if reference_path.exists():
        try:
            ref_json = json.loads(reference_path.read_text(encoding="utf-8"))
            for key in (
                "$schema",
                "version",
                "description",
                "lastUpdated",
                "categories",
                "sourceRoots",
                "statistics",
            ):
                if key in ref_json:
                    reference[key] = ref_json[key]
        except json.JSONDecodeError:
            reference = {}
    prompt = REGISTRY_REPAIR_TEMPLATE.format(
        schema=schema,
        reference_header=json.dumps(reference, indent=2),
        current=json.dumps(current, indent=2),
    )
    result = _run_with_retries(_build_schema_repair_agent(), prompt, "registry-repair")
    output = getattr(result, "final_output", None)
    if output is None:
        output = str(result)
    output = _extract_json_payload(str(output))
    repaired = _parse_json_output(output, "registry-repair", debug)
    path.write_text(json.dumps(repaired, indent=2) + "\n", encoding="utf-8")


def _ensure_registry_schema(path: Path, debug: bool) -> None:
    if not path.exists():
        return
    _validate_and_repair_json_file(path, "registry", debug)
    try:
        content = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        _repair_registry_file(path, debug)
        return
    if not isinstance(content, dict):
        _repair_registry_file(path, debug)
        return
    components = content.get("components")
    if not isinstance(components, list):
        _repair_registry_file(path, debug)
        return
    if not content.get("version") or not content.get("description"):
        _repair_registry_file(path, debug)
        return


def _extract_definition_var(snippet: str) -> Optional[str]:
    match = re.search(
        r"createJsonComponent(?:WithHooks)?<[^>]+>\((\w+)",
        snippet,
    )
    if not match:
        return None
    return match.group(1)


def _extract_hook_names(snippet: str) -> List[str]:
    return re.findall(r"hookName:\s*['\"]([^'\"]+)['\"]", snippet)


def _hook_name_to_file_name(hook_name: str) -> str:
    if hook_name.startswith("use") and len(hook_name) > 3:
        return f"use-{_to_kebab_case(hook_name[3:])}.ts"
    return f"{_to_kebab_case(hook_name)}.ts"


def _build_json_components_file(
    out_dir: Path, components: List[Dict[str, Any]]
) -> None:
    if not components:
        return
    components_sorted = sorted(components, key=lambda item: item["name"])
    use_hooks = any(
        "createJsonComponentWithHooks" in (item.get("snippet") or "")
        for item in components_sorted
    )
    type_names = sorted({f"{item['name']}Props" for item in components_sorted})
    lines: List[str] = [
        "/**",
        " * Pure JSON components - no TypeScript wrappers needed",
        " * Interfaces are defined in src/lib/json-ui/interfaces/",
        " * JSON definitions are in src/components/json-definitions/",
        " */",
        "import { createJsonComponent } from './create-json-component'",
    ]
    if use_hooks:
        lines.append(
            "import { createJsonComponentWithHooks } from './create-json-component-with-hooks'"
        )
    if type_names:
        lines.append("import type {")
        lines.extend([f"  {name}," for name in type_names])
        lines.append("} from './interfaces'")
    lines.append("")
    for item in components_sorted:
        snippet = item.get("snippet") or ""
        def_var = _extract_definition_var(snippet) or f"{_to_lower_camel(item['name'])}Def"
        def_path = f"@/components/json-definitions/{item['name']}.json"
        lines.append(f"import {def_var} from '{def_path}'")
        item["def_var"] = def_var
    lines.append("")
    for item in components_sorted:
        snippet = (item.get("snippet") or "").strip()
        if not snippet:
            snippet = (
                f"export const {item['name']} = "
                f"createJsonComponent<{item['name']}Props>({item['def_var']})"
            )
        lines.append(snippet)
    lines.append("")
    target = out_dir / "src" / "lib" / "json-ui" / "json-components.ts"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines), encoding="utf-8")


def _ensure_interfaces_index(out_dir: Path) -> None:
    interfaces_dir = out_dir / "src" / "lib" / "json-ui" / "interfaces"
    if not interfaces_dir.exists():
        return
    entries = sorted(
        path.stem
        for path in interfaces_dir.glob("*.ts")
        if path.name != "index.ts"
    )
    if not entries:
        return
    lines = [f"export * from './{entry}'" for entry in entries]
    index_path = interfaces_dir / "index.ts"
    index_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _ensure_hooks_index(out_dir: Path) -> None:
    hooks_dir = out_dir / "src" / "hooks"
    if not hooks_dir.exists():
        return
    entries = sorted(
        path.stem
        for path in hooks_dir.glob("*.ts")
        if path.name != "index.ts"
    )
    if not entries:
        return
    lines = [f"export * from './{entry}'" for entry in entries]
    index_path = hooks_dir / "index.ts"
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _extract_hook_name(content: str, file_name: str) -> str:
    for pattern in (r"export function (\w+)", r"export const (\w+)", r"export default function (\w+)"):
        match = re.search(pattern, content)
        if match:
            return match.group(1)
    base = Path(file_name).stem
    if base.startswith("use-"):
        return f"use{_to_pascal_from_kebab(base[4:])}"
    return base


def _ensure_hooks_registry(out_dir: Path) -> None:
    hooks_dir = out_dir / "src" / "hooks"
    if not hooks_dir.exists():
        return
    hook_files = sorted(
        path for path in hooks_dir.glob("*.ts") if path.name != "index.ts"
    )
    if not hook_files:
        return
    imports: List[str] = []
    hook_names: List[str] = []
    for path in hook_files:
        content = path.read_text(encoding="utf-8")
        hook_name = _extract_hook_name(content, path.name)
        hook_names.append(hook_name)
        imports.append(f"import {{ {hook_name} }} from '@/hooks/{path.stem}'")
    registry_lines = [
        "/**",
        " * Hook Registry for JSON Components",
        " * Allows JSON components to use custom React hooks",
        " */",
        *imports,
        "",
        "export interface HookRegistry {",
        "  [key: string]: (...args: any[]) => any",
        "}",
        "",
        "/**",
        " * Registry of all custom hooks available to JSON components",
        " */",
        "export const hooksRegistry: HookRegistry = {",
        *[f"  {name}," for name in hook_names],
        "}",
        "",
        "/**",
        " * Get a hook from the registry by name",
        " */",
        "export function getHook(hookName: string) {",
        "  return hooksRegistry[hookName]",
        "}",
        "",
        "/**",
        " * Register a new hook",
        " */",
        "export function registerHook(name: string, hook: (...args: any[]) => any) {",
        "  hooksRegistry[name] = hook",
        "}",
        "",
    ]
    registry_path = out_dir / "src" / "lib" / "json-ui" / "hooks-registry.ts"
    registry_path.parent.mkdir(parents=True, exist_ok=True)
    registry_path.write_text("\n".join(registry_lines), encoding="utf-8")


def _ensure_components_indices(
    out_dir: Path, components: List[Dict[str, Any]]
) -> None:
    categories: Dict[str, List[str]] = {}
    for item in components:
        category = item.get("category") or "components"
        categories.setdefault(category, []).append(item["name"])
    for category, names in categories.items():
        index_path = out_dir / "src" / "components" / category / "index.ts"
        index_path.parent.mkdir(parents=True, exist_ok=True)
        exports = [
            f"export {{ {name} }} from '@/lib/json-ui/json-components'"
            for name in sorted(set(names))
        ]
        index_path.write_text("\n".join(exports) + "\n", encoding="utf-8")


def _post_process_outputs(
    out_dir: Path, processed: List[Tuple[ComponentTarget, Dict[str, Any]]]
) -> None:
    components: List[Dict[str, Any]] = []
    missing_hooks: List[Tuple[str, str, ComponentTarget]] = []
    hooks_dir = out_dir / "src" / "hooks"
    for target, data in processed:
        component_name = data.get("componentName") or target.name
        if not component_name:
            continue
        snippet = (data.get("jsonComponentExport") or {}).get("source", "")
        for hook_name in _extract_hook_names(snippet):
            hook_file_name = _hook_name_to_file_name(hook_name)
            hook_path = hooks_dir / hook_file_name
            if hook_path.exists():
                continue
            hook_data = data.get("hook") or {}
            if hook_data.get("name") == hook_name and hook_data.get("source"):
                hook_file_path = hook_data.get("filePath") or f"src/hooks/{hook_file_name}"
                _write_if_content(out_dir / hook_file_path, hook_data["source"])
                continue
            missing_hooks.append((hook_name, hook_file_name, target))
        components.append(
            {
                "name": component_name,
                "category": target.category,
                "snippet": snippet,
            }
        )
    for hook_name, hook_file_name, target in missing_hooks:
        hook_path = hooks_dir / hook_file_name
        if hook_path.exists():
            continue
        component_name = target.name
        tsx = target.path.read_text(encoding="utf-8")
        hook_file_path = f"src/hooks/{hook_file_name}"
        prompt = HOOK_REPAIR_TEMPLATE.format(
            hook_name=hook_name,
            hook_file_path=hook_file_path,
            component_name=component_name,
            category=target.category,
            tsx=tsx,
        )
        result = _run_with_retries(
            _build_hook_repair_agent(),
            prompt,
            f"hook-repair:{component_name}:{hook_name}",
        )
        output = getattr(result, "final_output", None)
        if output is None:
            output = str(result)
        output = _extract_json_payload(str(output))
        repaired = _parse_json_output(
            output, f"hook-repair:{component_name}:{hook_name}", True
        )
        hook = repaired.get("hook")
        if hook and hook.get("source"):
            hook_path.parent.mkdir(parents=True, exist_ok=True)
            hook_path.write_text(hook["source"], encoding="utf-8")
        else:
            print(
                (
                    f"[warn] hook repair did not return hook source for "
                    f"{component_name} ({hook_name})"
                ),
                file=sys.stderr,
            )
    _build_json_components_file(out_dir, components)
    _ensure_interfaces_index(out_dir)
    _ensure_hooks_index(out_dir)
    _ensure_hooks_registry(out_dir)
    _ensure_components_indices(out_dir, components)


def _write_if_content(path: Path, content: str) -> None:
    if not content.strip():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _merge_snippet(path: Path, content: str) -> None:
    if not content.strip():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    existing_lines = existing.splitlines()
    new_lines = content.strip().splitlines()
    if not new_lines:
        return
    matcher = difflib.SequenceMatcher(None, existing_lines, new_lines)
    match = matcher.find_longest_match(0, len(existing_lines), 0, len(new_lines))
    if match.size == len(new_lines):
        return
    if match.a + match.size == len(existing_lines) and match.b == 0:
        merged_lines = existing_lines + new_lines[match.size:]
    else:
        merged_lines = existing_lines + ([""] if existing_lines else []) + new_lines
    merged_text = "\n".join(merged_lines).rstrip() + "\n"
    if merged_text == existing:
        return
    path.write_text(merged_text, encoding="utf-8")


def _apply_unified_diff(original: str, diff_lines: List[str]) -> str:
    if not diff_lines:
        return original
    lines = original.splitlines()
    out: List[str] = []
    i = 0
    idx = 0
    applied = False

    header_re = re.compile(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@")

    while idx < len(diff_lines):
        line = diff_lines[idx]
        if line.startswith("---") or line.startswith("+++"):
            idx += 1
            continue
        if not line.startswith("@@"):
            idx += 1
            continue
        match = header_re.match(line)
        if not match:
            raise ValueError(f"Invalid diff header: {line!r}")
        old_start = int(match.group(1))
        old_start_index = max(old_start - 1, 0)
        out.extend(lines[i:old_start_index])
        i = old_start_index
        idx += 1
        applied = True
        while idx < len(diff_lines) and not diff_lines[idx].startswith("@@"):
            hunk_line = diff_lines[idx]
            if hunk_line.startswith(" "):
                expected = hunk_line[1:]
                if i >= len(lines) or lines[i] != expected:
                    raise ValueError("Diff context mismatch while applying patch.")
                out.append(lines[i])
                i += 1
            elif hunk_line.startswith("-"):
                expected = hunk_line[1:]
                if i >= len(lines) or lines[i] != expected:
                    raise ValueError("Diff delete mismatch while applying patch.")
                i += 1
            elif hunk_line.startswith("+"):
                out.append(hunk_line[1:])
            elif hunk_line.startswith("\\"):
                pass
            idx += 1

    if not applied:
        raise ValueError("No diff hunks found to apply.")
    out.extend(lines[i:])
    return "\n".join(out) + ("\n" if original.endswith("\n") else "")


def write_output(out_dir: Path, data: Dict[str, Any], target: ComponentTarget) -> None:
    component_name = data.get("componentName") or target.name or "unknown-component"

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
    _validate_and_repair_json_file(
        json_def_path, f"json-definition:{component_name}", False
    )

    interface = data.get("interface") or {}
    interface_path = out_dir / interface.get(
        "filePath", f"src/lib/json-ui/interfaces/{component_name}.ts"
    )
    _write_if_content(interface_path, interface.get("source", ""))

    diffs = data.get("diffs") or []
    had_diffs = False
    if isinstance(diffs, list) and diffs:
        had_diffs = True
        for diff_entry in diffs:
            path_value = diff_entry.get("path")
            diff_lines = diff_entry.get("diffLines") or []
            if not path_value or not isinstance(diff_lines, list):
                continue
            target_path = (out_dir / path_value).resolve()
            if not target_path.is_relative_to(out_dir.resolve()):
                raise ValueError(f"Diff path escapes output directory: {path_value}")
            existing = target_path.read_text(encoding="utf-8") if target_path.exists() else ""
            try:
                merged = _apply_unified_diff(existing, diff_lines)
            except ValueError as exc:
                print(
                    f"[warn] diff apply failed for {path_value}: {exc}; attempting AI resolution.",
                    file=sys.stderr,
                )
                merged = _resolve_diff_with_agent(
                    path_value, existing, diff_lines, debug=True
                )
            _write_if_content(target_path, merged)
            if target_path.suffix == ".json":
                _validate_and_repair_json_file(
                    target_path, f"diff-json:{path_value}", True
                )
    if not had_diffs:
        json_component_export = (data.get("jsonComponentExport") or {}).get("source", "")
        _merge_snippet(
            out_dir / "src/lib/json-ui/json-components.ts",
            json_component_export,
        )

        exports = data.get("exports") or {}
        _merge_snippet(
            out_dir / "src/lib/json-ui/interfaces/index.ts",
            exports.get("interfacesIndex", ""),
        )
        _merge_snippet(
            out_dir / "src/hooks/index.ts", exports.get("hooksIndex", "") or ""
        )
        _merge_snippet(
            out_dir / "src/lib/json-ui/hooks-registry.ts",
            exports.get("hooksRegistry", "") or "",
        )

        components_index_path = out_dir / "src/components" / target.category / "index.ts"
        _merge_snippet(components_index_path, exports.get("componentsIndex", ""))

    config_name = f"{_to_kebab_case(component_name)}.json"
    config_path = (
        out_dir
        / "src"
        / "config"
        / "pages"
        / target.category
        / config_name
    )
    _ensure_config_page_schema(
        config_path, component_name, target.category, data, False
    )


def main() -> int:
    out_dir = (ROOT / "migration-out").resolve()
    workers = 4

    targets = list_components(COMPONENT_DIRS)

    out_dir.mkdir(parents=True, exist_ok=True)

    failures: List[str] = []
    processed: List[Tuple[ComponentTarget, Dict[str, Any]]] = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(run_agent_for_component, t, out_dir, True): t for t in targets
        }
        for future in as_completed(futures):
            target = futures[future]
            try:
                data = future.result()
                write_output(out_dir, data, target)
                processed.append((target, data))
                print(f"ok: {target.name}")
            except Exception as exc:
                failures.append(f"{target.name}: {exc}")
                print(f"error: {target.name}: {exc}", file=sys.stderr)

    if failures:
        print("\nFailures:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1
    _post_process_outputs(out_dir, processed)
    _ensure_registry_schema(out_dir / "json-components-registry.json", True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
