# Unified Storage System

CodeForge now features a unified storage system that automatically selects the best available storage backend for your data persistence needs.

## Storage Backends

The system supports three storage backends in order of preference:

### 1. **SQLite (Preferred)**
- **Type**: On-disk database via WASM
- **Persistence**: Data stored in browser localStorage as serialized SQLite database
- **Pros**: 
  - SQL query support
  - Better performance for complex queries
  - More robust data integrity
  - Works offline
- **Cons**: 
  - Requires sql.js library (optional dependency)
  - Slightly larger bundle size
  - localStorage size limits (~5-10MB)
- **Installation**: `npm install sql.js`

### 2. **IndexedDB (Default)**
- **Type**: Browser-native key-value store
- **Persistence**: Data stored in browser IndexedDB
- **Pros**:
  - No additional dependencies
  - Large storage capacity (usually >50MB, can be GBs)
  - Fast for simple key-value operations
  - Works offline
  - Native browser support
- **Cons**:
  - No SQL query support
  - More complex API
  - Asynchronous only

### 3. **Spark KV (Fallback)**
- **Type**: Cloud key-value store
- **Persistence**: Data stored in Spark runtime
- **Pros**:
  - No size limits
  - Synced across devices
  - Persistent beyond browser
- **Cons**:
  - Requires Spark runtime
  - Online only
  - Slower than local storage

## Usage

### Basic Usage

```typescript
import { unifiedStorage } from '@/lib/unified-storage'

// Get data
const value = await unifiedStorage.get<MyType>('my-key')

// Set data
await unifiedStorage.set('my-key', myData)

// Delete data
await unifiedStorage.delete('my-key')

// Get all keys
const keys = await unifiedStorage.keys()

// Clear all data
await unifiedStorage.clear()

// Check current backend
const backend = await unifiedStorage.getBackend()
console.log(`Using: ${backend}`) // 'sqlite', 'indexeddb', or 'sparkkv'
```

### React Hook

```typescript
import { useUnifiedStorage } from '@/hooks/use-unified-storage'

function MyComponent() {
  const [todos, setTodos, deleteTodos] = useUnifiedStorage('todos', [])

  const addTodo = async (todo: Todo) => {
    // ALWAYS use functional updates to avoid stale data
    await setTodos((current) => [...current, todo])
  }

  const removeTodo = async (id: string) => {
    await setTodos((current) => current.filter(t => t.id !== id))
  }

  return (
    <div>
      <button onClick={() => addTodo({ id: '1', text: 'New Todo' })}>
        Add Todo
      </button>
      <button onClick={deleteTodos}>Clear All</button>
    </div>
  )
}
```

### Storage Backend Management

```typescript
import { useStorageBackend } from '@/hooks/use-unified-storage'

function StorageManager() {
  const {
    backend,
    isLoading,
    switchToSQLite,
    switchToIndexedDB,
    exportData,
    importData,
  } = useStorageBackend()

  return (
    <div>
      <p>Current backend: {backend}</p>
      <button onClick={switchToSQLite}>Switch to SQLite</button>
      <button onClick={switchToIndexedDB}>Switch to IndexedDB</button>
      <button onClick={async () => {
        const data = await exportData()
        console.log('Exported:', data)
      }}>
        Export Data
      </button>
    </div>
  )
}
```

## Migration Between Backends

The system supports seamless migration between storage backends:

```typescript
// Migrate from IndexedDB to SQLite (preserves all data)
await unifiedStorage.switchToSQLite()

// Migrate from SQLite to IndexedDB (preserves all data)
await unifiedStorage.switchToIndexedDB()
```

When switching backends:
1. All existing data is exported from the current backend
2. The new backend is initialized
3. All data is imported into the new backend
4. The preference is saved for future sessions

## Data Export/Import

Export and import data for backup or migration purposes:

```typescript
// Export all data as JSON
const data = await unifiedStorage.exportData()
const json = JSON.stringify(data, null, 2)

// Save to file
const blob = new Blob([json], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'codeforge-backup.json'
a.click()

// Import data from JSON
const imported = JSON.parse(jsonString)
await unifiedStorage.importData(imported)
```

## Backend Detection

The system automatically detects and selects the best available backend on initialization:

1. **SQLite** is attempted first if `localStorage.getItem('codeforge-prefer-sqlite') === 'true'`
2. **IndexedDB** is attempted next if available in the browser
3. **Spark KV** is used as a last resort fallback

You can check which backend is in use:

```typescript
const backend = await unifiedStorage.getBackend()
// Returns: 'sqlite' | 'indexeddb' | 'sparkkv' | null
```

## Performance Considerations

### SQLite
- Best for: Complex queries, relational data, large datasets
- Read: Fast (in-memory queries)
- Write: Moderate (requires serialization to localStorage)
- Capacity: Limited by localStorage (~5-10MB)

### IndexedDB
- Best for: Simple key-value storage, large data volumes
- Read: Very fast (optimized for key lookups)
- Write: Very fast (optimized browser API)
- Capacity: Large (typically 50MB+, can scale to GBs)

### Spark KV
- Best for: Cross-device sync, cloud persistence
- Read: Moderate (network latency)
- Write: Moderate (network latency)
- Capacity: Unlimited

## Troubleshooting

### SQLite Not Available

If SQLite fails to initialize:
1. Check console for errors
2. Ensure sql.js is installed: `npm install sql.js`
3. System will automatically fallback to IndexedDB

### IndexedDB Quota Exceeded

If IndexedDB storage is full:
1. Clear old data: `await unifiedStorage.clear()`
2. Export important data first
3. Consider switching to Spark KV for unlimited storage

### Data Not Persisting

1. Check which backend is active: `await unifiedStorage.getBackend()`
2. Verify browser supports storage (check if in private mode)
3. Check browser console for errors
4. Try exporting/importing data to refresh storage

## Best Practices

1. **Use Functional Updates**: Always use functional form of setState to avoid stale data:
   ```typescript
   // ❌ WRONG - can lose data
   setTodos([...todos, newTodo])
   
   // ✅ CORRECT - always safe
   setTodos((current) => [...current, newTodo])
   ```

2. **Handle Errors**: Wrap storage operations in try-catch:
   ```typescript
   try {
     await unifiedStorage.set('key', value)
   } catch (error) {
     console.error('Storage failed:', error)
     toast.error('Failed to save data')
   }
   ```

3. **Export Regularly**: Create backups of important data:
   ```typescript
   const backup = await unifiedStorage.exportData()
   // Save backup somewhere safe
   ```

4. **Use Appropriate Backend**: Choose based on your needs:
   - Local-only, small data → IndexedDB
   - Local-only, needs SQL → SQLite (install sql.js)
   - Cloud sync needed → Spark KV

## UI Component

The app includes a `StorageSettingsPanel` component that provides a user-friendly interface for:
- Viewing current storage backend
- Switching between backends
- Exporting/importing data
- Viewing storage statistics

Add it to your settings page:

```typescript
import { StorageSettingsPanel } from '@/components/StorageSettingsPanel'

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <StorageSettingsPanel />
    </div>
  )
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Unified Storage API             │
│  (unifiedStorage.get/set/delete/keys)   │
└──────────────┬──────────────────────────┘
               │
               ├─ Automatic Backend Detection
               │
       ┌───────┴───────┬─────────────┬────────┐
       │               │             │        │
       ▼               ▼             ▼        ▼
┌─────────────┐ ┌────────────┐ ┌─────────┐ ┌────┐
│   SQLite    │ │ IndexedDB  │ │Spark KV │ │ ?  │
│  (optional) │ │ (default)  │ │(fallback│ │Next│
└─────────────┘ └────────────┘ └─────────┘ └────┘
       │               │             │
       └───────┬───────┴─────────────┘
               │
               ▼
        Browser Storage
```

## Future Enhancements

- [ ] Add compression for large data objects
- [ ] Implement automatic backup scheduling
- [ ] Add support for native file system API
- [ ] Support for WebSQL (legacy browsers)
- [ ] Encrypted storage option
- [ ] Storage analytics and usage metrics
- [ ] Automatic data migration on version changes
