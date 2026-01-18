# React Hook Extraction Tasks

## Component candidates

- [ ] **Extract data source editor state logic into a hook.**
  - **Component:** `src/components/molecules/DataSourceEditorDialog.tsx`
  - **Why:** Manages editing state, sync with props, and dependency add/remove logic in the component body.
  - **Proposed hook:** `useDataSourceEditor` (or similar) to own `editingSource`, `updateField`, and dependency helpers, plus derived dependency lists.
- [ ] **Extract component binding dialog state into a hook.**
  - **Component:** `src/components/molecules/ComponentBindingDialog.tsx`
  - **Why:** Holds editable component state and binding update handlers inline.
  - **Proposed hook:** `useComponentBindingDialog` to sync `editingComponent` with props and expose `updateBindings`/`handleSave`.
- [ ] **Extract template export/copy/download actions into a hook.**
  - **Component:** `src/components/TemplateExplorer.tsx`
  - **Why:** Clipboard interactions, blob creation, and KV export are embedded in the view component.
  - **Proposed hook:** `useTemplateExplorerActions` to return `copyToClipboard`, `downloadJSON`, and `exportCurrentData` handlers.
- [ ] **Extract component tree expansion state into a hook.**
  - **Component:** `src/components/molecules/ComponentTree.tsx`
  - **Why:** Expansion state, “expand all,” and “collapse all” logic are in the component, but reusable across tree UIs.
  - **Proposed hook:** `useComponentTreeExpansion` to compute expandable IDs and manage `expandedIds` with expand/collapse/toggle functions.
