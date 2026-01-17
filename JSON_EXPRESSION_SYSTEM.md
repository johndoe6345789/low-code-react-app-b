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
