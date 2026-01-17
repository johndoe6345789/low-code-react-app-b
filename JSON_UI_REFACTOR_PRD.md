# JSON-Driven UI Refactoring Project

Transform CodeForge into a fully JSON-driven component architecture with atomic design patterns and comprehensive custom hooks.

**Experience Qualities**:
1. **Declarative** - UI structure defined through JSON schemas rather than hardcoded components
2. **Composable** - Small, focused atomic components that combine elegantly into complex interfaces
3. **Maintainable** - Clear separation of concerns with reusable hooks extracting all business logic

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a comprehensive refactoring that introduces a sophisticated JSON rendering engine, breaks down large monolithic components into atomic pieces, and extracts complex logic into custom hooks for maximum reusability.

## Essential Features

### JSON Schema Engine
- **Functionality**: Interprets JSON declarations to render complete UI hierarchies
- **Purpose**: Enable rapid UI changes without code modifications
- **Trigger**: Page load with JSON schema file
- **Progression**: Load schema → Parse structure → Resolve bindings → Render components → Attach handlers
- **Success criteria**: Any page can be fully defined via JSON with data bindings and event handlers

### Atomic Component Library
- **Functionality**: Break all components into atoms, molecules, and organisms following atomic design
- **Purpose**: Maximize reusability and maintainability
- **Trigger**: Component import in any context
- **Progression**: Import atom → Compose into molecule → Compose into organism → Render in page
- **Success criteria**: No component exceeds 150 LOC, all follow single responsibility principle

### Custom Hooks Extraction
- **Functionality**: Extract all business logic, state management, and side effects into focused hooks
- **Purpose**: Separate concerns and enable logic reuse across components
- **Trigger**: Component mount or user interaction
- **Progression**: Hook initialization → State setup → Effect registration → Return interface → Component consumption
- **Success criteria**: Components are primarily presentational with logic delegated to hooks

### Dynamic Data Binding
- **Functionality**: Support JavaScript expressions in JSON to bind data dynamically
- **Purpose**: Connect UI declarations to application state
- **Trigger**: Schema parsing
- **Progression**: Parse binding → Evaluate expression → Subscribe to changes → Update UI
- **Success criteria**: Any data property can be referenced in JSON using binding syntax

### Event Handler Mapping
- **Functionality**: Map string function names in JSON to actual function implementations
- **Purpose**: Enable interactive UIs defined in JSON
- **Trigger**: User interaction
- **Progression**: Event fires → Look up handler → Execute function → Update state → Re-render
- **Success criteria**: All common interactions can be declared in JSON

## Edge Case Handling

- **Invalid JSON Schema**: Validate schemas on load, show helpful error messages with schema path
- **Missing Data Bindings**: Gracefully handle undefined data with fallback values
- **Unknown Components**: Log warning and render placeholder component with schema details
- **Circular References**: Detect and prevent infinite rendering loops
- **Performance Issues**: Implement memoization and virtualization for large lists
- **Type Safety**: Generate TypeScript types from JSON schemas where possible

## Design Direction

The design should feel like a sophisticated developer tool - clean, precise, and confidence-inspiring. A refined dark theme with vibrant accent colors that pop against the deep background.

## Color Selection

**Primary Color**: Deep purple (`oklch(0.55 0.18 280)`) - Commands attention for primary actions and conveys technical sophistication

**Secondary Colors**:
- Card backgrounds: `oklch(0.16 0.02 260)` - Subtle depth without overwhelming
- Muted surfaces: `oklch(0.20 0.02 260)` - For secondary content areas

**Accent Color**: Bright cyan (`oklch(0.75 0.15 195)`) - High-energy highlight for interactive elements and status indicators

**Foreground/Background Pairings**:
- Background (`oklch(0.12 0.02 260)`): Foreground (`oklch(0.95 0.005 260)`) - Ratio 17.8:1 ✓
- Card (`oklch(0.16 0.02 260)`): Card Foreground (`oklch(0.95 0.005 260)`) - Ratio 15.2:1 ✓
- Primary (`oklch(0.55 0.18 280)`): Primary Foreground (`oklch(1 0 0)`) - Ratio 6.1:1 ✓
- Accent (`oklch(0.75 0.15 195)`): Accent Foreground (`oklch(0.12 0.02 260)`) - Ratio 11.4:1 ✓

## Font Selection

Use a distinctive technical aesthetic with modern developer-focused typefaces that communicate precision and clarity.

**Typographic Hierarchy**:
- H1 (Page Title): Space Grotesk Bold/32px/tight letter spacing/-0.02em
- H2 (Section Header): Space Grotesk SemiBold/24px/normal/0em
- H3 (Card Title): Space Grotesk Medium/18px/normal/0em
- Body: Inter Regular/14px/relaxed/1.6 line height
- Code: JetBrains Mono Regular/13px/monospace/1.5 line height
- Caption: Inter Regular/12px/relaxed/tracking-wide

## Animations

Animations should emphasize the technical nature while remaining subtle. Use sharp, precise movements that reflect data flow and system operations. Key moments: schema loading (pulse effect), component mounting (fade-up), data updates (highlight flash), and navigation transitions (slide).

## Component Selection

**Components**:
- **Card** - Primary container for grouped content, heavy use throughout
- **Badge** - Status indicators for components, data sources, build status
- **Button** - All sizes from icon-only to full CTAs
- **Tabs** - Navigation between schemas, configuration views
- **Dialog** - Modals for editing schemas, previewing renders
- **ScrollArea** - Custom scrollbars for code editors and tree views
- **Select/Combobox** - Component type selection, binding target selection
- **Input/Textarea** - JSON editing, binding expressions
- **Accordion** - Collapsible sections in property panels
- **Separator** - Visual hierarchy in dense information displays

**Customizations**:
- Custom JSON editor component with syntax highlighting
- Schema visualizer component showing component hierarchy
- Binding expression builder with autocomplete
- Component palette with drag-and-drop preview

**States**:
- Buttons: Hover lifts slightly with shadow, active presses down, disabled grays out with reduced opacity
- Inputs: Focus shows accent ring, error shows destructive ring with shake animation
- Cards: Hover subtly brightens border, selected shows accent border

**Icon Selection**:
- Code/FileCode for schemas and JSON files
- Tree/TreeStructure for component hierarchies  
- Database for data bindings
- Lightning for actions and functions
- Cube for atomic components
- Stack for composed components
- Eye for preview modes
- Wrench for configuration

**Spacing**:
- Base unit: 4px (Tailwind's spacing scale)
- Card padding: p-6
- Section gaps: gap-6
- Grid gaps: gap-4
- Inline gaps: gap-2
- Tight groups: gap-1

**Mobile**:
- Stack navigation tabs vertically in sheet
- Single column grid for stat cards
- Collapsible property panels
- Full-screen modals
- Bottom sheet for quick actions
- Touch-optimized hit areas (min 44px)
