# JSON-Driven UI Architecture Enhancement

Build a comprehensive JSON-driven UI system that allows building entire user interfaces from declarative JSON schemas, including a visual drag-and-drop schema editor for creating JSON UI configs, breaking down complex components into atomic pieces, and extracting reusable logic into custom hooks for maximum maintainability and rapid development.

**Experience Qualities**:
1. **Modular** - Every component under 150 LOC, highly composable and reusable
2. **Declarative** - Define UIs through configuration rather than imperative code
3. **Maintainable** - Clear separation of concerns between data, logic, and presentation

**Complexity Level**: Complex Application (advanced functionality with multiple views)

This is an advanced system that interprets JSON schemas, manages state across multiple data sources, executes actions dynamically, renders complex component hierarchies, and provides a visual editor for creating schemas through drag-and-drop - requiring sophisticated architecture with component registries, action executors, data source managers, and interactive canvas rendering.

## Essential Features

### Visual Schema Editor
- **Functionality**: Drag-and-drop interface for building JSON UI schemas with real-time preview
- **Purpose**: Enable non-technical users to create complex UIs without writing JSON
- **Trigger**: User opens the schema editor page
- **Progression**: Select component from palette → Drag to canvas → Drop at position → Configure properties → Preview result → Export JSON
- **Success criteria**: Users can create complete page schemas visually, with property editing, component tree view, and JSON export

### Data Source Binding UI
- **Functionality**: Visual interface for connecting components to KV storage and computed values with dependency tracking
- **Purpose**: Enable declarative data management without manual state handling
- **Trigger**: User opens data binding designer or edits component bindings in schema editor
- **Progression**: Create data source → Configure type (KV/computed/static) → Set up dependencies → Bind to component properties → Test reactive updates
- **Success criteria**: Users can create KV stores, computed values, and static data, then bind them to components with automatic reactive updates

### JSON Schema Parser
- **Functionality**: Parse and validate JSON UI schemas with full TypeScript type safety
- **Purpose**: Enable building UIs from configuration rather than code
- **Trigger**: User loads a page defined by JSON schema
- **Progression**: Load schema → Validate structure → Initialize data sources → Render component tree → Bind events
- **Success criteria**: Schemas render correctly with all data bindings and event handlers working

### Data Source Management
- **Functionality**: Manage multiple data sources (KV store, computed values, static data) with automatic dependency tracking
- **Purpose**: Centralize data management and enable reactive updates
- **Trigger**: Component needs data or data changes
- **Progression**: Request data → Check source type → Load/compute value → Update dependents → Re-render
- **Success criteria**: Data flows correctly between sources, components, and persistence layer

### Action Executor
- **Functionality**: Execute user actions declaratively (CRUD, navigation, toasts, custom actions)
- **Purpose**: Handle all user interactions declaratively without component-specific code
- **Trigger**: User interaction (click, change, submit, etc.)
- **Progression**: Parse action → Validate params → Execute handler → Update data → Show feedback
- **Success criteria**: All action types work correctly with proper error handling

### Atomic Component Library  
- **Functionality**: Library of small, focused, reusable components (atoms, molecules, organisms)
- **Purpose**: Build complex UIs from simple, tested building blocks
- **Trigger**: Developer needs a UI element
- **Progression**: Select component → Configure props → Compose with other components → Render
- **Success criteria**: No component exceeds 150 LOC, all components highly reusable

### Custom Hooks Library  
- **Functionality**: Extracted business logic in reusable hooks (useCRUD, useSearch, useFilter, useForm, etc.)
- **Purpose**: Separate concerns and enable logic reuse across components
- **Trigger**: Component needs common functionality (data management, search, form handling)
- **Progression**: Call hook → Provide config → Receive state and handlers → Render UI
- **Success criteria**: Hooks are testable, reusable, and follow React best practices

## Edge Case Handling

- **Invalid Schemas** - Validate JSON structure, show helpful error messages, provide fallback UI
- **Missing Components** - Log warnings, render fallback div, continue rendering other components
- **Data Source Errors** - Catch KV failures, show toast notifications, maintain app stability
- **Circular Dependencies** - Detect loops in computed data sources, break cycles, warn developer
- **Concurrent Updates** - Use optimistic updates with rollback on failure
- **Empty States** - Show helpful messages and actions when no data exists

## Design Direction

A **dark cyberpunk development theme** with electric accents and technical precision that feels like a high-powered code editor with visual design tools integrated.

## Color Selection

Convey technical sophistication with electric highlights against deep, professional backgrounds.

- **Primary Color**: Deep Purple `oklch(0.45 0.15 270)` - Commands attention for primary actions, evokes advanced technology
- **Secondary Colors**: 
  - Dark Slate `oklch(0.35 0.02 250)` for secondary surfaces
  - Deep Navy `oklch(0.18 0.02 250)` for cards and elevated surfaces
- **Accent Color**: Cyan Glow `oklch(0.70 0.15 200)` - Electric highlight for CTAs, active states, and focus indicators
- **Foreground/Background Pairings**:
  - Background (Deep Navy #1E1E2E) → Foreground (Light Gray #E8E8EC) - Ratio 12.5:1 ✓
  - Card (Darker Navy #252535) → Card Foreground (Light Gray #E8E8EC) - Ratio 11.2:1 ✓  
  - Primary (Deep Purple #7C3AED) → Primary Foreground (White #FFFFFF) - Ratio 6.8:1 ✓
  - Accent (Cyan #5DD5F5) → Accent Foreground (Deep Navy #1E1E2E) - Ratio 9.2:1 ✓
  - Muted (Slate #38384A) → Muted Foreground (Mid Gray #A8A8B0) - Ratio 5.2:1 ✓

## Font Selection

Convey **technical precision and modern development** with a mix of geometric sans-serif and monospace fonts.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Space Grotesk Bold/32px/tight (-0.02em) - Geometric, technical, commanding
  - H2 (Section Headers): Space Grotesk Semi-Bold/24px/tight (-0.01em)
  - H3 (Component Headers): Space Grotesk Medium/18px/normal
  - Body Text: Inter Regular/14px/relaxed (1.6) - Highly readable, neutral, professional
  - Code/Technical: JetBrains Mono Regular/13px/normal (1.5) - Monospace for code and technical content
  - Captions/Labels: Inter Medium/12px/normal - Slightly bolder for hierarchy

## Animations

Animations should feel **snappy and purposeful** - fast micro-interactions (100-150ms) for buttons and inputs, smooth transitions (250-300ms) for page changes and dialogs, with spring physics for natural movement. Use subtle scale transforms (0.98→1.0) on button press, slide-in animations for modals, and fade effects for state changes. Avoid unnecessary flourishes - every animation serves feedback or orientation.

## Component Selection

- **Components**: 
  - `Card`, `Button`, `Input`, `Select`, `Checkbox`, `Switch` for core UI
  - `Dialog`, `Tabs`, `Badge`, `Progress`, `Separator` for layout and feedback
  - `Heading`, `Text`, `List`, `Grid` for typography and layout primitives
  - `ScrollArea` for contained scrollable regions
  - `Tooltip` for contextual help
  
- **Customizations**: 
  - `StatusBadge` - Status indicator with predefined styles
  - `DataCard` - Stat card with icon, trend, and loading states
  - `SearchInput` - Input with search icon and clear button
  - `ActionBar` - Title with action buttons
  - All new atomic components follow the 150 LOC limit
  
- **States**: 
  - Buttons: subtle scale on press, glow effect on hover, disabled with opacity
  - Inputs: border color shift on focus, inline validation icons, smooth error states
  - Cards: subtle lift shadow on hover for interactive cards
  
- **Icon Selection**: 
  - Phosphor Icons throughout
  - Code, Database, Tree, Cube for feature areas
  - Plus, Pencil, Trash for CRUD operations
  - MagnifyingGlass, Gear, Download for utilities
  
- **Spacing**: 
  - Container padding: p-6 (1.5rem)
  - Section gaps: gap-6 (1.5rem) 
  - Card gaps: gap-4 (1rem)
  - Button groups: gap-2 (0.5rem)
  - Tight elements: gap-1 (0.25rem)
  
- **Mobile**: 
  - Stack layouts vertically on <768px
  - Reduce padding to p-4 on mobile
  - Touch-friendly tap targets (min 44px)
  - Responsive grid columns (1 → 2 → 3 → 4)
  - Bottom sheet dialogs on small screens
