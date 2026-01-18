# JSON Expression System

## Overview

The JSON expression system provides a lightweight, safe way to derive values in schema files without relying on legacy compute functions. Expressions are evaluated against a context object that includes:

- `data`: All data sources available to the page
- `event`: The current event payload (when evaluating event actions)

Legacy compute/transform registries have been removed in favor of expressions and templates. If you still have schemas referencing function names (for example, `compute: "someFunction"`), migrate them to the expression formats below.

## Supported Expression Patterns

### Direct data access

```json
"expression": "data.todos"
```

### Nested data access

```json
"expression": "data.todos.length"
```

### Event access

```json
"expression": "event.target.value"
```

### Literals

```json
"expression": "true"
"expression": "42"
"expression": "'hello'"
```

### Date helper

```json
"expression": "Date.now()"
```

### Filters

Filter collections using field comparisons. The following operators are supported:

- `=` (equals)
- `!=` (not equals)
- `~=` (case-insensitive contains)

```json
"expression": "data.users.filter(status=active)"
"expression": "data.users.filter(search~=data.filterQuery)"
```

Count filtered collections with `.length`:

```json
"expression": "data.todos.filter(completed=true).length"
```

## Templates

Use `valueTemplate` to build objects with expression-driven fields:

```json
"valueTemplate": {
  "id": "Date.now()",
  "text": "data.newTodo",
  "completed": false
}
```

## Conditions

Conditions use the same expression syntax as above. Keep expressions simple and based on `data.*` values:

```json
"condition": "data.newTodo.length > 0"
```

## Deprecated Legacy Functions (Removed)

The legacy compute/transform registry and function-name references have been removed. Any schema still referencing:

- `compute`: function names
- `transform`: function names
- function-valued `condition`

should be updated to use `expression` and `valueTemplate` instead.
