# Component Usage Report

## Method
Scanned JSX tags in `src/**/*.tsx` and `src/**/*.jsx` using the regex `<[A-Z][A-Za-z0-9_]*` to count component usage occurrences.

### Command
```bash
python - <<'PY'
import json, re
from pathlib import Path
src = Path('src')
pattern = re.compile(r'<([A-Z][A-Za-z0-9_]*)\\b')
counts = {}
files = list(src.rglob('*.tsx')) + list(src.rglob('*.jsx'))
for path in files:
    text = path.read_text(encoding='utf-8')
    for match in pattern.findall(text):
        counts[match] = counts.get(match, 0) + 1

json_list = json.loads(Path('json-components-list.json').read_text(encoding='utf-8'))
json_supported = {item['type'] for item in json_list if item.get('status') == 'supported'}
json_planned = {item['type'] for item in json_list if item.get('status') == 'planned'}
subcomponents = {}
for item in json_list:
    if item.get('status') == 'supported':
        for sub in item.get('subComponents', []) or []:
            subcomponents[sub] = item['type']

sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
not_supported = [(n, c) for n, c in sorted_counts if n not in json_supported and n not in subcomponents]
print(sorted_counts[:10])
print(not_supported[:10])
PY
```

## Top 10 Components by Usage
| Rank | Component | Usage Count | JSON Status |
| --- | --- | --- | --- |
| 1 | Button | 215 | supported |
| 2 | Card | 172 | supported |
| 3 | CardContent | 123 | supported (subcomponent of Card) |
| 4 | Label | 105 | supported |
| 5 | Badge | 102 | supported |
| 6 | CardHeader | 101 | supported (subcomponent of Card) |
| 7 | CardTitle | 100 | supported (subcomponent of Card) |
| 8 | Stack | 95 | supported |
| 9 | Text | 82 | supported |
| 10 | Input | 66 | supported |

## Top 10 Components Not Yet Supported (for conversion priority)
| Rank | Component | Usage Count | JSON Status |
| --- | --- | --- | --- |
| 1 | SelectItem | 48 | not-listed |
| 2 | Database | 39 | not-listed |
| 3 | CheckCircle | 39 | not-listed |
| 4 | ScrollArea | 34 | not-listed |
| 5 | Trash | 33 | not-listed |
| 6 | Plus | 28 | not-listed |
| 7 | DialogContent | 20 | not-listed |
| 8 | DialogHeader | 20 | not-listed |
| 9 | DialogTitle | 20 | not-listed |
| 10 | Tooltip | 20 | not-listed |
