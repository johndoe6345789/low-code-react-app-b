# Refactoring Documentation Index

## Overview Documents
- [REFACTOR_SUMMARY.md](../REFACTOR_SUMMARY.md) - High-level overview of the refactor
- [COMPONENT_SIZE_GUIDE.md](./COMPONENT_SIZE_GUIDE.md) - Guidelines for keeping components under 150 LOC
- [architecture.json](../architecture.json) - System architecture configuration

## Hook Library
- [HOOKS_REFERENCE.md](./HOOKS_REFERENCE.md) - Complete hook library reference

### Available Hooks

#### Data Management (`@/hooks/data`)
- `useDataSource` - Unified data source (KV, static, computed)
- `useCRUD` - Create, Read, Update, Delete operations
- `useSearchFilter` - Search and filter with multiple fields
- `useSort` - Sortable lists with direction toggle
- `usePagination` - Page navigation and item slicing
- `useSelection` - Multi/single selection management

#### Form Management (`@/hooks/forms`)
- `useFormField` - Individual field validation and state
- `useForm` - Form submission with async support

#### UI State (`@/hooks/ui`)
- `useDialog` - Dialog open/close state
- `useToggle` - Boolean toggle with callbacks
- `useKeyboardShortcuts` - Global keyboard shortcuts

## JSON-Driven UI
- [JSON_PAGES_GUIDE.md](./JSON_PAGES_GUIDE.md) - Building pages from JSON configuration
- [JSON_UI_GUIDE.md](../JSON_UI_GUIDE.md) - Original JSON UI documentation

### Page Schemas
- `/src/config/pages/dashboard.json` - Dashboard page configuration
- More schemas can be added for other pages

## Component Library

### Atomic Components (`@/components/atoms`)
All under 50 LOC:
- `DataList` - List rendering with empty states
- `StatCard` - Metric display cards
- `ActionButton` - Buttons with tooltips
- `LoadingState` - Loading spinners
- `EmptyState` - Empty state displays
- `StatusBadge` - Status indicators
- Plus 15+ more existing atoms

### Molecules (`@/components/molecules`)
50-100 LOC components combining atoms

### Organisms (`@/components/organisms`)
100-150 LOC complex components

### Page Renderers
- `JSONPageRenderer` - Renders pages from JSON schemas

## Migration Examples

### Before: Traditional React Component (200+ LOC)
```typescript
function ProjectDashboard({ files, models, ...rest }) {
  // State management
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('name')
  
  // Calculations
  const totalFiles = files.length
  const completionScore = calculateScore(...)
  
  // Render
  return (
    <div className="space-y-6">
      {/* 150+ lines of JSX */}
    </div>
  )
}
```

### After: JSON-Driven (< 50 LOC)
```typescript
function ProjectDashboard(props) {
  return (
    <JSONPageRenderer
      schema={dashboardSchema}
      data={props}
      functions={{ calculateCompletionScore }}
    />
  )
}
```

## Best Practices

1. **Extract Logic to Hooks**
   - Keep components focused on rendering
   - Move state management to custom hooks
   - Use data hooks for CRUD operations

2. **Use JSON for Data-Heavy Pages**
   - Dashboards with multiple metrics
   - Settings pages
   - Status displays

3. **Compose Small Components**
   - Build complex UIs from atomic pieces
   - Each component has single responsibility
   - Maximum 150 LOC per component

4. **Always Use Functional Updates**
   ```typescript
   // ✅ CORRECT
   setItems(current => [...current, newItem])
   
   // ❌ WRONG - Can cause data loss
   setItems([...items, newItem])
   ```

## Quick Start

1. **Use existing hooks:**
   ```typescript
   import { useCRUD, useSearchFilter } from '@/hooks/data'
   ```

2. **Create JSON page schema:**
   ```json
   {
     "id": "my-page",
     "layout": { ... },
     "statCards": [ ... ]
   }
   ```

3. **Render with JSONPageRenderer:**
   ```typescript
   <JSONPageRenderer schema={mySchema} data={props} />
   ```

## Future Enhancements

- [ ] Visual JSON schema editor
- [ ] Action handlers in JSON
- [ ] Form definitions in JSON
- [ ] Conditional rendering support
- [ ] Animation configurations
- [ ] More atomic components
- [ ] Component library storybook

## Contributing

When adding new features:
1. Keep components under 150 LOC
2. Extract logic to hooks
3. Document new hooks in HOOKS_REFERENCE.md
4. Add examples to guides
5. Update this index
