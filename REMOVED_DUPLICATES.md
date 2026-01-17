# Removed Duplicate Components

The following components were replaced in favor of their JSON-based versions as part of the JSON Component Tree architecture migration.

## Replaced Files (Now Export JSON Versions)
1. `ModelDesigner.tsx` → Now exports `JSONModelDesigner`
2. `ComponentTreeManager.tsx` → Now exports `JSONComponentTreeManager`
3. `WorkflowDesigner.tsx` → Now exports `JSONWorkflowDesigner`
4. `LambdaDesigner.tsx` → Now exports `JSONLambdaDesigner`
5. `FlaskDesigner.tsx` → Now exports `JSONFlaskDesigner`
6. `StyleDesigner.tsx` → Now exports `JSONStyleDesigner`
7. `ProjectDashboard.tsx` → Replaced with JSON-driven implementation from `ProjectDashboard.new.tsx`

## Registry Updates
The `component-registry.json` was updated to point all component references to their JSON-based implementations:
- All designer components now use JSON-based PageRenderer
- Removed "experimental" tags from JSON implementations
- Updated descriptions to reflect JSON-driven architecture

## Implementation Strategy
Instead of deleting the old files, they now re-export the JSON versions. This maintains backward compatibility while ensuring all code paths use the JSON-driven architecture.

**Example:**
```tsx
// ModelDesigner.tsx
export { JSONModelDesigner as ModelDesigner } from './JSONModelDesigner'
```

## Benefits
- ✅ Single source of truth using JSON-driven component trees
- ✅ More maintainable and configurable components
- ✅ Aligns with Redux + IndexedDB integration strategy
- ✅ Backward compatible with existing imports
- ✅ Reduced code duplication by ~6 components

## Files Kept (Not Duplicates)
The following similarly-named files serve different purposes and were kept:
- `ConflictResolutionDemo.tsx` vs `ConflictResolutionPage.tsx` (demo vs UI)
- `PersistenceExample.tsx` vs `PersistenceDashboard.tsx` (example vs dashboard)
- `StorageExample.tsx` vs `StorageSettings.tsx` (different features)
- `AtomicComponentDemo.tsx` vs `AtomicComponentShowcase.tsx` vs `AtomicLibraryShowcase.tsx` (different demos)
- `JSONUIShowcase.tsx` vs `JSONUIShowcasePage.tsx` (component vs page wrapper)
