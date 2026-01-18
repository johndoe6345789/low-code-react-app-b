# JSON UI Components Registry

This document describes the JSON UI component system and lists all components that can be rendered from JSON schemas.

## Overview

The JSON UI system allows you to define user interfaces using JSON schemas instead of writing React code. This is useful for:
- Dynamic UI generation
- No-code/low-code interfaces
- Configuration-driven UIs
- Rapid prototyping

## JSON Eligibility Checklist

Use this checklist during every conversion to determine whether a component can be safely represented in JSON.

### Core requirements (must all be true)
- **No side-effects**: The component should be render-only; it must not perform data fetching, subscriptions, timers, or imperative DOM work. Side-effects belong in wrappers or higher-level orchestration. 
- **Supported bindings only**: Props must map to supported JSON bindings (static values, expression bindings, or schema-recognized props). Avoid custom callbacks, ref usage, or passing functions through JSON.
- **Stable props**: Props should be serializable and deterministic (strings, numbers, booleans, arrays, objects). Avoid non-serializable values like class instances, functions, or dates unless explicitly supported by the JSON schema.

### Derived state guidance
- **Prefer pure derivation**: If state can be derived from props or data bindings, compute it at render time in the renderer or via expression bindings rather than introducing component state.
- **Avoid local state in JSON components**: If a component needs internal state to function, wrap it in a React component and expose only the minimal, declarative props to JSON.
- **Keep calculations explicit**: Use named props (e.g., `selectedCount`, `isComplete`) rather than embedding complex logic that would need component state.

### Event handler guidance
- **Use schema-recognized actions**: Wire events to supported JSON actions or expression handlers (e.g., `onClick` -> `actions.navigate`, `actions.submit`), not raw functions.
- **Pass data, not closures**: Event handlers should reference IDs, routes, or action payloads so the runtime can resolve them.
- **Escalate complex logic**: If an event handler needs branching logic or side-effects, move that logic into an app-level action or wrapper component and keep JSON props declarative.

## Quick Start

### List All JSON-Compatible Components

```bash
# List all components with details
npm run components:list

# List only supported components
npm run components:list -- --status=supported

# List only planned components
npm run components:list -- --status=planned

# Output as JSON
npm run components:list -- --format=json
```

### Using JSON UI Components

Components are defined in the `ComponentType` union in `src/types/json-ui.ts` and registered in `src/lib/json-ui/component-registry.tsx`.

Example JSON schema:

```json
{
  "id": "example-page",
  "type": "Card",
  "props": {
    "className": "p-6"
  },
  "children": [
    {
      "id": "heading",
      "type": "Heading",
      "props": {
        "level": 2,
        "children": "Welcome"
      }
    },
    {
      "id": "description",
      "type": "Text",
      "props": {
        "children": "This is a dynamically rendered component"
      }
    },
    {
      "id": "cta",
      "type": "Button",
      "props": {
        "variant": "default",
        "children": "Get Started"
      }
    }
  ]
}
```

## Component Categories

### Layout Components (12)
Container elements for organizing content:
- `div`, `section`, `article`, `header`, `footer`, `main` - HTML semantic elements
- `Card` - Container with optional header, content, and footer
- `Grid` - Responsive grid layout
- `Stack` - Vertical or horizontal stack layout
- `Flex` - Flexible box layout
- `Container` - Centered container with max-width
- `Dialog` - Modal dialog overlay

### Input Components (11)
Form inputs and interactive controls:
- `Button` - Interactive button
- `Input` - Text input field
- `TextArea` - Multi-line text input
- `Select` - Dropdown select
- `Checkbox` - Checkbox toggle
- `Radio` - Radio button
- `Switch` - Toggle switch
- `Slider` - Numeric range slider
- `NumberInput` - Numeric input with increment/decrement
- `DatePicker` - Date selection
- `FileUpload` - File upload control

### Display Components (16)
Presentation and visual elements:
- `Heading` - Heading text (h1-h6)
- `Text` - Text content with typography
- `Label` - Form label
- `Badge` - Status or count indicator
- `Tag` - Removable tag/chip
- `Code` - Inline or block code
- `Image` - Image with loading states
- `Avatar` - User avatar image
- `Icon` - Icon from library (planned)
- `Progress` - Progress bar
- `Spinner` - Loading spinner
- `Skeleton` - Loading placeholder
- `Separator` - Visual divider
- `CircularProgress` - Circular indicator
- `ProgressBar` - Linear progress
- `Divider` - Section divider

### Navigation Components (3)
Navigation and routing:
- `Link` - Hyperlink element
- `Breadcrumb` - Navigation trail (planned)
- `Tabs` - Tabbed interface

### Feedback Components (7)
Alerts, notifications, and status:
- `Alert` - Alert notification message
- `InfoBox` - Information box with icon
- `EmptyState` - Empty state placeholder
- `StatusBadge` - Status indicator
- `StatusIcon` - Status icon (planned)
- `ErrorBadge` - Error state (planned)
- `Notification` - Toast notification (planned)

### Data Components (8)
Data display and visualization:
- `List` - Generic list renderer
- `Table` - Data table
- `KeyValue` - Key-value pair display
- `StatCard` - Statistic card
- `DataList` - Styled data list (planned)
- `DataTable` - Advanced table with sorting/filtering (planned)
- `Timeline` - Timeline visualization (planned)
- `MetricCard` - Metric display (planned)

### Custom Components (3)
Domain-specific components:
- `DataCard` - Custom data display card
- `SearchInput` - Search input with icon
- `ActionBar` - Action button toolbar

## Current Status

- **Total Components**: 60
- **Supported**: 51 (85%)
- **Planned**: 9 (15%)

## Status Summary

| Status | Count |
| --- | ---: |
| Supported | 51 |
| Maybe | 0 |
| Planned | 9 |

## Files

- `json-components-registry.json` - Complete registry with metadata
- `src/types/json-ui.ts` - TypeScript types and ComponentType union
- `src/lib/json-ui/component-registry.tsx` - Component registry mapping
- `src/lib/component-definitions.ts` - Component definitions with defaults
- `scripts/list-json-components.cjs` - CLI tool to list components

## Adding New Components

To add a new component to the JSON UI system:

1. Add the component type to `ComponentType` union in `src/types/json-ui.ts`
2. Import and register it in `src/lib/json-ui/component-registry.tsx`
3. Add component definition in `src/lib/component-definitions.ts`
4. Update `json-components-registry.json` with metadata
5. Test the component in a JSON schema

### JSON Compatibility Checklist

Before migrating a component, confirm all required conditions are met:

- [ ] **Hooks/state are registry-safe**: hooks and internal state are acceptable when the component registry can control or expose them through JSON bindings.
- [ ] **Bindings are defined**: any required actions, event handlers, or state bindings are already supported by the JSON UI binding system.
- [ ] **Refactoring covered by PR**: JSON compatibility gaps should be resolved via refactoring as part of the same pull request.

### Step-by-Step Migration Path

Use this repeatable migration flow for planned components:

1. **Update the type union** in `src/types/json-ui.ts` to include the new component type name.
2. **Register the component** in `src/lib/json-ui/component-registry.tsx` so JSON schemas can resolve it at runtime.
3. **Define component metadata** in `src/lib/component-definitions.ts` (defaults, prop schema, and any JSON-driven constraints).
4. **Validate JSON schema usage** by rendering a sample schema that uses the new type.
5. **Update registry metadata** in `json-components-registry.json` so the CLI/listing reflects the new status.

## Migration Strategy

Components marked as "planned" are:
- Available in the codebase as React components
- Not yet integrated into the JSON UI system
- Can be migrated following the steps above

Priority for migration:
1. High-usage components
2. Components with simple props
3. Components with good atomic design
4. Components without complex state management

## Related Documentation

- [PRD.md](./PRD.md) - Product requirements document
- [REDUX_DOCUMENTATION.md](./REDUX_DOCUMENTATION.md) - Redux integration
- [src/types/json-ui.ts](./src/types/json-ui.ts) - Type definitions
- [src/lib/component-definitions.ts](./src/lib/component-definitions.ts) - Component metadata
