# JSON Expression System

This document describes the JSON-friendly expression system for handling events without requiring external TypeScript functions.

## Overview

The JSON Expression System allows you to define dynamic behaviors entirely within JSON schemas, eliminating the need for external compute functions. This makes schemas more portable and easier to edit.

## Expression Types

### 1. Simple Expressions

Use the `expression` field to evaluate dynamic values:

```json
{
  "type": "set-value",
  "target": "username",
  "expression": "event.target.value"
}
```

**Supported Expression Patterns:**

- **Data Access**: `"data.fieldName"`, `"data.user.name"`, `"data.items.0.id"`
  - Access any field in the data context
  - Supports nested objects using dot notation

- **Event Access**: `"event.target.value"`, `"event.key"`, `"event.type"`
  - Access event properties
  - Commonly used for form inputs

- **Date Operations**: `"Date.now()"`
  - Get current timestamp
  - Useful for creating unique IDs

- **Literals**: `42`, `"hello"`, `true`, `false`, `null`
  - Direct values

### 2. Value Templates

Use the `valueTemplate` field to create objects with dynamic values:

```json
{
  "type": "create",
  "target": "todos",
  "valueTemplate": {
    "id": "Date.now()",
    "text": "data.newTodo",
    "completed": false,
    "createdBy": "data.currentUser"
  }
}
```

**Template Behavior:**
- String values starting with `"data."` or `"event."` are evaluated as expressions
- Other values are used as-is
- Perfect for creating new objects with dynamic fields

### 3. Static Values

Use the `value` field for static values:

```json
{
  "type": "set-value",
  "target": "isLoading",
  "value": false
}
```

## Action Types with Expression Support

### set-value
Update a data source with a new value.

**With Expression:**
```json
{
  "id": "update-filter",
  "type": "set-value",
  "target": "searchQuery",
  "expression": "event.target.value"
}
```

**With Static Value:**
```json
{
  "id": "reset-filter",
  "type": "set-value",
  "target": "searchQuery",
  "value": ""
}
```

**Target-path convention:**
To update nested values inside a data source, use a dotted `target` where the prefix is the data source ID and the remainder is the nested path:

```json
{
  "id": "set-city",
  "type": "set-value",
  "target": "profile.address.city",
  "expression": "event.target.value"
}
```

This dotted `target` format works with `set-value`, `update`, `toggle-value`, `increment`, and `decrement`.

### create
Add a new item to an array data source.

**With Value Template:**
```json
{
  "id": "add-todo",
  "type": "create",
  "target": "todos",
  "valueTemplate": {
    "id": "Date.now()",
    "text": "data.newTodo",
    "completed": false
  }
}
```

### update
Update an existing value (similar to set-value).

```json
{
  "id": "update-count",
  "type": "update",
  "target": "viewCount",
  "expression": "data.viewCount + 1"
}
```

**Note:** Arithmetic expressions are not yet supported. Use `increment` action type instead.

### delete
Remove an item from an array.

```json
{
  "id": "remove-todo",
  "type": "delete",
  "target": "todos",
  "path": "id",
  "expression": "data.selectedId"
}
```

## Common Patterns

### 1. Input Field Updates

```json
{
  "id": "name-input",
  "type": "Input",
  "bindings": {
    "value": { "source": "userName" }
  },
  "events": [
    {
      "event": "change",
      "actions": [
        {
          "type": "set-value",
          "target": "userName",
          "expression": "event.target.value"
        }
      ]
    }
  ]
}
```

### 2. Creating Objects with IDs

```json
{
  "type": "create",
  "target": "items",
  "valueTemplate": {
    "id": "Date.now()",
    "name": "data.newItemName",
    "status": "pending",
    "createdAt": "Date.now()"
  }
}
```

### 3. Resetting Forms

```json
{
  "event": "click",
  "actions": [
    {
      "type": "set-value",
      "target": "formField1",
      "value": ""
    },
    {
      "type": "set-value",
      "target": "formField2",
      "value": ""
    }
  ]
}
```

### 4. Success Notifications

```json
{
  "type": "show-toast",
  "message": "Item saved successfully!",
  "variant": "success"
}
```

## Complex Expression Use Cases

### 1. Building Nested Records from Existing Data

Use a single `create` action to stitch together multiple sources. Complex objects can be sourced from data fields (the expression returns the object), while top-level fields can mix event and data values.

```json
{
  "id": "create-audit-entry",
  "type": "create",
  "target": "auditLog",
  "valueTemplate": {
    "id": "Date.now()",
    "actorId": "data.currentUser.id",
    "action": "event.type",
    "metadata": "data.auditMetadata",
    "createdAt": "Date.now()"
  }
}
```

### 2. Selecting Deep Values for Conditional Deletions

Pick a deeply nested value for the delete path without needing a compute function.

```json
{
  "id": "remove-primary-address",
  "type": "delete",
  "target": "addresses",
  "path": "id",
  "expression": "data.user.profile.primaryAddressId"
}
```

### 3. Multi-Step Updates with Event + Data Context

Use sequential actions to update multiple fields from a single event.

```json
{
  "event": "change",
  "actions": [
    {
      "type": "set-value",
      "target": "filters.query",
      "expression": "event.target.value"
    },
    {
      "type": "set-value",
      "target": "filters.lastUpdatedBy",
      "expression": "data.currentUser.name"
    }
  ]
}
```

## Escaping Literal Strings

Because any string that starts with `data.` or `event.` is treated as an expression, use a quoted literal to force a static string. This works in both `expression` and `valueTemplate` fields.

```json
{
  "type": "set-value",
  "target": "rawText",
  "expression": "\"data.user.name\""
}
```

```json
{
  "type": "create",
  "target": "labels",
  "valueTemplate": {
    "label": "\"event.target.value\""
  }
}
```

If you simply need a static value, prefer the `value` field instead of `expression`.

## Fallback Behavior

- If an expression does not match a supported pattern, the system returns the original string and logs a warning.
- If an expression throws during evaluation, the result is `undefined` and the error is logged.
- Conditional checks default to `true` when they cannot be evaluated (fail-open behavior).
- Data bindings that use a binding object can provide a `fallback` value (see the binding resolver in UI schemas).

When fallback behavior matters, guard the data source with defaults or use the legacy `compute` functions for stricter control.

## Performance Considerations

- Expression evaluation happens synchronously on every event. Keep expressions short and avoid repeated deep reads in high-frequency events (e.g., `input` or `mousemove`).
- Prefer precomputing derived values in your data model and referencing them directly in expressions.
- Batch related updates into a single event handler to reduce re-renders.
- For heavy or repeated logic, use legacy `compute` functions where memoization or caching can be applied.

## Backward Compatibility

The system maintains backward compatibility with the legacy `compute` function approach:

**Legacy (still supported):**
```json
{
  "type": "set-value",
  "target": "userName",
  "compute": "updateUserName"
}
```

**New (preferred):**
```json
{
  "type": "set-value",
  "target": "userName",
  "expression": "event.target.value"
}
```

The schema loader will automatically hydrate legacy `compute` references while new schemas can use pure JSON expressions.

## Limitations

Current limitations (may be addressed in future updates):

1. **No Arithmetic**: Cannot do `"data.count + 1"` - use `increment` action type instead
2. **No String Concatenation**: Cannot do `"Hello " + data.name` - use template strings in future
3. **No Complex Logic**: Cannot do nested conditionals or loops
4. **No Custom Functions**: Cannot call user-defined functions

For complex logic, you can still use the legacy `compute` functions or create custom action types.

## Migration Guide

### From Compute Functions to Expressions

**Before:**
```typescript
// In compute-functions.ts
export const updateNewTodo = (data: any, event: any) => event.target.value

// In schema
{
  "type": "set-value",
  "target": "newTodo",
  "compute": "updateNewTodo"
}
```

**After:**
```json
{
  "type": "set-value",
  "target": "newTodo",
  "expression": "event.target.value"
}
```

**Before:**
```typescript
// In compute-functions.ts
export const computeAddTodo = (data: any) => ({
  id: Date.now(),
  text: data.newTodo,
  completed: false,
})

// In schema
{
  "type": "create",
  "target": "todos",
  "compute": "computeAddTodo"
}
```

**After:**
```json
{
  "type": "create",
  "target": "todos",
  "valueTemplate": {
    "id": "Date.now()",
    "text": "data.newTodo",
    "completed": false
  }
}
```

## Examples

See the example schemas:
- `/src/schemas/todo-list-json.json` - Pure JSON event system example
- `/src/schemas/todo-list.json` - Legacy compute function approach

## Future Enhancements

Planned features for future versions:

1. **Arithmetic Expressions**: `"data.count + 1"`
2. **String Templates**: `"Hello ${data.userName}"`
3. **Comparison Operators**: `"data.age > 18"`
4. **Logical Operators**: `"data.isActive && data.isVerified"`
5. **Array Operations**: `"data.items.filter(...)"`, `"data.items.map(...)"`
6. **String Methods**: `"data.text.trim()"`, `"data.email.toLowerCase()"`

For now, use the legacy `compute` functions for these complex scenarios.
