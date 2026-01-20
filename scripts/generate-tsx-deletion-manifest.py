#!/usr/bin/env python3
"""
Generate a deletion manifest for legacy TSX components that have JSON equivalents.

Heuristics (no dependency on migration-out):
- Scan all src/components/**/*.tsx (excluding tests/stories).
- Record signals (not required to include):
  - Matching JSON definition at src/components/json-definitions/<kebab>.json
  - Matching config page at src/config/pages/<category>/<kebab>.json (only for atoms/molecules/organisms)
  - Matching registry entry in json-components-registry.json
- All TSX files are listed; signals provide confidence for deletion.

Outputs:
- tsxs-to-delete.txt   (one relative TSX path per line)
- tsxs-to-delete.json  (array of {name, category, tsxPath, jsonDefinition, configPage?})
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS_ROOT = ROOT / "src" / "components"
JSON_DEFS_DIR = ROOT / "src" / "components" / "json-definitions"
CONFIG_PAGES_DIR = ROOT / "src" / "config" / "pages"
REGISTRY_FILE = ROOT / "json-components-registry.json"


def to_kebab(name: str) -> str:
    if not name:
        return ""
    return re.sub(r"([A-Z])", r"-\1", name).lower().lstrip("-")


def to_pascal(name: str) -> str:
    if not name:
        return ""
    parts = re.split(r"[-_\\s]", name)
    parts = [p for p in parts if p]
    if len(parts) == 1:
        s = parts[0]
        return s[:1].upper() + s[1:]
    return "".join(p[:1].upper() + p[1:] for p in parts)


def list_tsx_files() -> List[Tuple[str, Path]]:
    files: List[Tuple[str, Path]] = []
    if not COMPONENTS_ROOT.exists():
        return files
    for path in COMPONENTS_ROOT.rglob("*.tsx"):
        if ".test." in path.name or ".stories." in path.name:
            continue
        parts = path.relative_to(COMPONENTS_ROOT).parts
        category = parts[0] if parts else "components"
        files.append((category, path))
    return files


def load_registry_types() -> Set[str]:
    if not REGISTRY_FILE.exists():
        return set()
    try:
        data = json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))
    except Exception:
        return set()
    return {c.get("type", "") for c in data.get("components", []) if isinstance(c, dict)}


def matching_json_definition(name: str) -> Optional[Path]:
    kebab = to_kebab(name)
    candidate = JSON_DEFS_DIR / f"{kebab}.json"
    return candidate if candidate.exists() else None


def matching_config_page(category: str, name: str) -> Optional[Path]:
    kebab = to_kebab(name)
    candidate = CONFIG_PAGES_DIR / category / f"{kebab}.json"
    return candidate if candidate.exists() else None


def build_manifest() -> List[Dict[str, str]]:
    registry_types = {t.lower() for t in load_registry_types() if t}
    manifest: List[Dict[str, str]] = []
    for category, tsx_path in list_tsx_files():
        name = tsx_path.stem
        kebab = to_kebab(name)
        pascal = to_pascal(name)
        signals: Dict[str, str] = {}

        json_def = matching_json_definition(name)
        if json_def:
            signals["jsonDefinition"] = str(json_def.relative_to(ROOT))

        config = matching_config_page(category, name)
        if config:
            signals["configPage"] = str(config.relative_to(ROOT))

        if pascal.lower() in registry_types:
            signals["registry"] = "present"

        entry: Dict[str, str] = {
            "name": name,
            "category": category,
            "tsxPath": str(tsx_path.relative_to(ROOT)),
            **signals,
        }
        manifest.append(entry)
    return manifest


def write_manifest(entries: List[Dict[str, str]]) -> None:
    out_dir = ROOT
    txt_path = out_dir / "tsxs-to-delete.txt"
    json_path = out_dir / "tsxs-to-delete.json"
    if not entries:
        txt_path.write_text("", encoding="utf-8")
        json_path.write_text("[]\n", encoding="utf-8")
        print("No TSX files matched the deletion criteria.")
        return
    def render_line(e: Dict[str, str]) -> str:
        parts = [e["tsxPath"]]
        arrows: List[str] = []
        if "jsonDefinition" in e:
            arrows.append(f"JSON:{e['jsonDefinition']}")
        if "configPage" in e:
            arrows.append(f"CFG:{e['configPage']}")
        if e.get("registry") == "present":
            arrows.append("REG:yes")
        if arrows:
            parts.append("--> " + " | ".join(arrows))
        return " ".join(parts)

    txt_path.write_text("\n".join(render_line(e) for e in entries) + "\n", encoding="utf-8")
    json_path.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {txt_path}")
    print(f"Wrote {len(entries)} entries to {json_path}")


def main() -> int:
    entries = build_manifest()
    write_manifest(entries)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
