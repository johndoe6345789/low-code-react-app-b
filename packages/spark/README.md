# @github/spark

Spark runtime and hooks for low-code React applications.

## Overview

The `@github/spark` package provides core functionality for Spark-powered applications:

- **useKV Hook**: Persistent key-value storage with localStorage and Spark KV integration
- **Spark Runtime**: Mock LLM service, KV storage, and user authentication APIs
- **Vite Plugins**: Build-time integrations for Spark applications

## Installation

This package is designed to be used as a workspace dependency:

```json
{
  "dependencies": {
    "@github/spark": "workspace:*"
  }
}
```

## Usage

### useKV Hook

The `useKV` hook provides persistent state management:

```typescript
import { useKV } from '@github/spark/hooks'

function MyComponent() {
  const [count, setCount, deleteCount] = useKV('counter', 0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={deleteCount}>Reset</button>
    </div>
  )
}
```

### Spark Runtime

Initialize the Spark runtime in your application entry point:

```typescript
import '@github/spark/spark'
```

Access the runtime APIs:

```typescript
// KV Storage
window.spark.kv.set('key', 'value')
const value = window.spark.kv.get('key')

// LLM Service
const response = await window.spark.llm.chat([
  { role: 'user', content: 'Hello!' }
])

// User Info
const user = window.spark.user.getCurrentUser()
```

### Vite Plugins

Add Spark plugins to your Vite configuration:

```typescript
import sparkPlugin from '@github/spark/spark-vite-plugin'
import createIconImportProxy from '@github/spark/vitePhosphorIconProxyPlugin'

export default defineConfig({
  plugins: [
    sparkPlugin(),
    createIconImportProxy()
  ]
})
```

## API Reference

### useKV<T>(key: string, defaultValue: T)

Returns: `[value: T, setValue: (value: T | ((prev: T) => T)) => void, deleteValue: () => void]`

- `key`: Storage key
- `defaultValue`: Default value if key doesn't exist
- `value`: Current value
- `setValue`: Update the value (supports functional updates)
- `deleteValue`: Delete the value and reset to default

### window.spark

Global runtime object with the following APIs:

- `kv.get(key)`: Get value from KV storage
- `kv.set(key, value)`: Set value in KV storage
- `kv.delete(key)`: Delete key from KV storage
- `kv.clear()`: Clear all KV storage
- `kv.keys()`: Get all keys
- `llm.chat(messages)`: Chat with LLM
- `llm.complete(prompt)`: Complete a prompt
- `user.getCurrentUser()`: Get current user info
- `user.isAuthenticated()`: Check if user is authenticated

## License

MIT
