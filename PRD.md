# JSON-Driven UI Architecture Enhancement

Build a comprehensive JSON-driven UI system that allows building entire user interfaces from declarative JSON schemas, breaking down complex components into atomic pieces, and extracting reusable logic into custom hooks for maximum maintainability and rapid development.

2. **Modular** - Every co

This is an advanced system that interprets JSON schemas, manages state across multiple data sources, executes actions d
## Essential Features

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is an advanced system that interprets JSON schemas, manages state across multiple data sources, executes actions dynamically, and renders complex component hierarchies - requiring sophisticated architecture with component registries, action executors, and data source managers.

## Essential Features

### JSON Schema Parser
- **Functionality**: Parse and validate JSON UI schemas with full TypeScript type safety
- **Purpose**: Enable building UIs from configuration rather than code
- **Trigger**: User loads a page defined by JSON schema
- **Progression**: Look up type → Resolve component → Pass props → Render with children


- **Trigger**: Component need
- **Success criteria**: Data flows correctly between sources, components, and
### Action Executor
- **Purpose**: Handle all user interactions declarativel
- **Progression**: Parse action → Validate params → Execute handler → Update data → Sho


- **Trigger**: Develope
- **Success criteria**: No component exceeds 150 LOC, all components highly reus
### Custom Hooks Library  
- **Purpose**: Separate concerns and enable logic reuse acr
- **Progression**: Call hook → Provide config → Receive state and handlers → Render UI


- **Missing Compone
- **Data Source Errors** - Catch KV failures, show toast notifications, mai
- **Concurrent Updates** - Use optimistic updates with ro





- **Secondary Colors**: 
  - Deep Navy `oklch(0.18 0.02 250)` for cards and elevated surfaces
- **Foreground/Background Pairings**:
  - Card (Darker Navy #252535) → Card Foreground (Light Gray #E8E8EC) - Ratio 11.2:1 ✓ 
  - Accent (Cyan #5DD5F5) → Accent Foreground (Deep Navy #1E1E2E) - Ratio 9.2:1 ✓



  - H1 (Page Titles): Space Grotesk Bold/32px/tight (-0.02em) - Geometric
  - H3 (Component Headers): Space Grotesk Medium/18px/normal
  - Code/Technical: JetBrains Mono Regular/13px/normal (1.5) - Monospace for code and 




  - `Card` for containing feature sections and data panels
  - `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` for forms
  - `Tabs` for organizing related content
  - `Progress` for completion metrics
  - `ScrollArea` for contained scrollable regions
  
  - Create `JSONRenderer` component to interpret schemas

  

  - Cards: subtle lift shadow on hover for interactive cards

  - Code, Database

A **dark cyberpunk development theme** with electric accents and technical precision.

- **Primary Color**: Deep Purple `oklch(0.45 0.15 270)` - Commands attention for primary actions, evokes advanced technology and power
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
  - `Card` for containing feature sections and data panels
  - `Button` with variants (default, outline, ghost) for all actions
  - `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` for forms
  - `Dialog` for modals and confirmations
  - `Tabs` for organizing related content
  - `Badge` for status indicators and counts
  - `Progress` for completion metrics
  - `Separator` for visual dividers
  - `ScrollArea` for contained scrollable regions
  - `Tooltip` for contextual help
  
- **Customizations**: 
  - Create `JSONRenderer` component to interpret schemas
  - Build `ActionButton` that executes JSON-defined actions
  - Develop `DataBoundInput` that syncs with data sources
  - Design `EmptyState` for zero-data scenarios
  
- **States**: 
  - Buttons: subtle scale on press, glow effect on hover, disabled with opacity
  - Inputs: border color shift on focus, inline validation icons, smooth error states
  - Cards: subtle lift shadow on hover for interactive cards
  
- **Icon Selection**: 
  - Phosphor Icons with duotone weight for primary actions
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
  - Stack toolbar actions vertically on <640px
  - Single column layouts on <768px
  - Reduce padding to p-4 on mobile
  - Bottom sheet dialogs instead of centered modals
  - Hamburger menu for navigation on small screens
  - MagnifyingGlass, Gear, Download for utilities
  
- **Spacing**: 
  - Container padding: p-6 (1.5rem)
  - Section gaps: gap-6 (1.5rem) 
  - Card gaps: gap-4 (1rem)
  - Button groups: gap-2 (0.5rem)
  - Tight elements: gap-1 (0.25rem)
  
- **Mobile**: 
  - Stack toolbar actions vertically on <640px
  - Single column layouts on <768px
  - Reduce padding to p-4 on mobile
  - Bottom sheet dialogs instead of centered modals
  - Hamburger menu for navigation on small screens
