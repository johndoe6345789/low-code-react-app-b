# JSON-Powered Components Analysis

This document identifies which molecules and organisms can be powered by the JSON UI system.

## Summary

- **Total Components**: 219 (117 atoms, 41 molecules, 15 organisms, 46 ui)
- **Fully JSON-Compatible**: 14 (molecules: 13, organisms: 1)
- **Added to Registry**: 6 molecules ✅ (AppBranding, LabelWithBadge, EmptyEditorState, LoadingFallback, LoadingState, NavigationGroupHeader)
- **Maybe JSON-Compatible**: 41 (molecules: 27, organisms: 14)
- **Not Compatible**: 1 (molecules: 1)

**Implementation Status**: ✅ Low-hanging fruit completed! See `JSON_COMPATIBILITY_IMPLEMENTATION.md` for details.

## ✅ Added to JSON Registry

These components have been successfully integrated into the JSON UI component registry:

### Molecules (6)
- **AppBranding** ✅ ADDED - Title and subtitle branding
- **LabelWithBadge** ✅ ADDED - Label with badge indicator
- **EmptyEditorState** ✅ ADDED - Empty state for editor
- **LoadingFallback** ✅ ADDED - Loading message display
- **LoadingState** ✅ ADDED - Loading state indicator
- **NavigationGroupHeader** ✅ ADDED - Navigation section header

**Files Modified**:
- `src/lib/json-ui/component-registry.tsx` - Added component imports and registrations
- `src/types/json-ui.ts` - Added TypeScript type definitions
- `src/schemas/page-schemas.ts` - Added showcase schema
- `src/components/JSONUIShowcasePage.tsx` - Added "New Molecules" demo tab

## 🔥 Fully JSON-Compatible Components

These components have simple, serializable props and no complex state/logic. They can be directly rendered from JSON.

### Molecules (13)
- **AppBranding** ✅ ADDED - Title and subtitle branding
- **Breadcrumb** ❌ SKIP - Uses hooks (useNavigationHistory) and complex routing logic
- **EmptyEditorState** ✅ ADDED - Empty state for editor
- **LabelWithBadge** ✅ ADDED - Label with badge indicator
- **LazyBarChart** ❌ SKIP - Uses hooks (useRecharts) for dynamic loading
- **LazyD3BarChart** ❌ SKIP - Uses hooks for dynamic loading
- **LazyLineChart** ❌ SKIP - Uses hooks for dynamic loading
- **LoadingFallback** ✅ ADDED - Loading message display
- **LoadingState** ✅ ADDED - Loading state indicator
- **NavigationGroupHeader** ✅ ADDED - Navigation section header (requires Collapsible wrapper)
- **SaveIndicator** ❌ SKIP - Has internal state and useEffect for time updates
- **SeedDataManager** ❌ SKIP - Uses hooks and has complex event handlers
- **StorageSettings** ❌ SKIP - Complex state management and event handlers

### Organisms (1)
- **PageHeader** ❌ SKIP - Depends on navigation config lookup (tabInfo)

## ⚠️ Maybe JSON-Compatible Components

These components have callbacks/event handlers but could work with JSON UI if we implement an event binding system.

### Molecules (27)
#### Interactive Components (Need event binding)
- **ActionBar** - Action button toolbar
- **DataCard** - Custom data display card
- **EditorActions** - Editor action buttons
- **EditorToolbar** - Editor toolbar
- **SearchBar** - Search bar with input
- **SearchInput** - Search input with icon
- **StatCard** - Statistic card display
- **ToolbarButton** - Toolbar button component
- **NavigationItem** - Navigation menu item

#### Components with State (Need state binding)
- **BindingEditor** - Data binding editor
- **ComponentBindingDialog** - Component binding dialog
- **ComponentPalette** - Component palette selector
- **ComponentTree** - Component tree view
- **DataSourceEditorDialog** - Data source editor
- **FileTabs** - File tabs navigation
- **PropertyEditor** - Property editor panel
- **TreeFormDialog** - Tree form dialog
- **TreeListHeader** - Tree list header

#### Display/Layout Components
- **CanvasRenderer** - Canvas rendering component
- **CodeExplanationDialog** - Code explanation dialog
- **DataSourceCard** - Data source card
- **EmptyState** - Empty state display
- **LazyInlineMonacoEditor** - Inline Monaco editor
- **LazyMonacoEditor** - Monaco code editor
- **MonacoEditorPanel** - Monaco editor panel
- **PageHeaderContent** - Page header content
- **TreeCard** - Tree card component

### Organisms (14)
All organisms have complex interactions and state management:
- **AppHeader** - Application header
- **DataSourceManager** - Data source management panel
- **EmptyCanvasState** - Empty canvas state display
- **JSONUIShowcase** - JSON UI showcase component
- **NavigationMenu** - Navigation menu system
- **SchemaCodeViewer** - Schema code viewer
- **SchemaEditorCanvas** - Schema editor canvas
- **SchemaEditorLayout** - Schema editor layout
- **SchemaEditorPropertiesPanel** - Properties panel
- **SchemaEditorSidebar** - Editor sidebar
- **SchemaEditorStatusBar** - Editor status bar
- **SchemaEditorToolbar** - Editor toolbar
- **ToolbarActions** - Toolbar action buttons
- **TreeListPanel** - Tree list panel

## ❌ Not JSON-Compatible

### Molecules (1)
- **GitHubBuildStatus** - Makes API calls, has complex async logic

## Recommendations

### For Fully Compatible Components
These can be added to the JSON component registry immediately:
```typescript
// Add to src/lib/json-ui/component-registry.tsx
import { AppBranding } from '@/components/molecules/AppBranding'
import { LabelWithBadge } from '@/components/molecules/LabelWithBadge'
// ... etc
```

### For Maybe Compatible Components
To make these JSON-compatible, implement:

1. **Event Binding System** - Map string event names to actions
```json
{
  "type": "SearchInput",
  "events": {
    "onChange": { "action": "updateSearch", "target": "searchQuery" }
  }
}
```

2. **State Binding System** - Bind component state to data sources
```json
{
  "type": "ComponentTree",
  "bindings": {
    "items": { "source": "treeData" },
    "selectedId": { "source": "selectedNode" }
  }
}
```

3. **Complex Component Wrappers** - Create JSON-friendly wrapper components
```typescript
// Wrap complex components with simplified JSON interfaces
export function JSONFriendlyDataSourceManager(props: SerializableProps) {
  // Convert JSON props to complex component props
  return <DataSourceManager {...convertProps(props)} />
}
```

## Usage

```bash
# List all components with JSON compatibility
npm run components:list

# Regenerate the registry from source files
npm run components:scan
```

## See Also
- `json-components-registry.json` - Full component registry
- `scripts/list-json-components.cjs` - Component listing script
- `scripts/scan-and-update-registry.cjs` - Registry generator
- `src/lib/json-ui/component-registry.tsx` - JSON UI component registry
