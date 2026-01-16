# Planning Guide

A visual low-code platform for generating Next.js applications with Material UI styling, integrated Monaco code editor, and Prisma schema designer.

**Experience Qualities**: 
1. **Empowering** - Users feel in control with both visual and code-level editing capabilities
2. **Intuitive** - Complex application generation feels approachable through well-organized GUI tools
3. **Professional** - Output-ready code that follows modern best practices and conventions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured low-code IDE with multiple integrated tools (code editor, visual designers, schema builder), state management across views, and code generation capabilities that require sophisticated UI organization.

## Essential Features

### Monaco Code Editor Integration
- **Functionality**: Full-featured code editor with syntax highlighting, autocomplete, and multi-file editing
- **Purpose**: Allows direct code manipulation for users who want precise control
- **Trigger**: Clicking on files in the file tree or switching to code view
- **Progression**: Select file → Editor opens with syntax highlighting → Edit code → Changes auto-saved to state → Preview updates
- **Success criteria**: Code edits persist, syntax highlighting works for JS/TS/CSS, multiple files can be open in tabs

### Prisma Schema Designer
- **Functionality**: Visual model designer for database schemas with drag-and-drop field creation
- **Purpose**: Simplifies database modeling without requiring Prisma syntax knowledge
- **Trigger**: Opening the Models tab
- **Progression**: Create model → Add fields with types → Define relations → Visual graph updates → Generate Prisma schema code
- **Success criteria**: Can create models, fields, relations; generates valid Prisma syntax; visual representation is clear

### Component Tree Builder
- **Functionality**: Hierarchical tree view for building React component structure
- **Purpose**: Visual composition of component hierarchy without writing JSX
- **Trigger**: Opening the Components tab
- **Progression**: Select component type → Add to tree → Configure props → Nest children → View generated JSX → Export component
- **Success criteria**: Can add/remove/reorder components; props are editable; generates valid React code

### Style Designer
- **Functionality**: Visual interface for Material UI theming and component styling
- **Purpose**: Configure colors, typography, spacing without manual theme object creation
- **Trigger**: Opening the Styling tab
- **Progression**: Select theme property → Adjust values with controls → Preview updates live → Export theme configuration
- **Success criteria**: Color pickers work; typography scales properly; generates valid MUI theme code

### Project Generator
- **Functionality**: Exports complete Next.js project with all configurations
- **Purpose**: Converts visual designs into downloadable, runnable applications
- **Trigger**: Clicking "Generate Project" or "Export Code"
- **Progression**: User finalizes design → Clicks export → System bundles files → Downloads zip or shows code → User extracts and runs locally
- **Success criteria**: Generated project structure is valid; includes package.json; code runs without errors

## Edge Case Handling
- **Empty Projects**: Show welcome screen with quick-start templates when no project exists
- **Invalid Prisma Schemas**: Validate models and show inline errors before generating code
- **Circular Component Dependencies**: Detect and warn when component tree has circular references
- **Missing Required Props**: Highlight components with missing required Material UI props
- **Large Files**: Implement virtual scrolling and lazy loading for large component trees and file lists

## Design Direction
The design should evoke a professional IDE environment while remaining approachable - think Visual Studio Code meets Figma. Clean panels, clear hierarchy, and purposeful use of space to avoid overwhelming users with options.

## Color Selection

- **Primary Color**: Deep indigo `oklch(0.45 0.15 270)` - Communicates professionalism and technical capability
- **Secondary Colors**: Slate gray `oklch(0.35 0.02 250)` for UI chrome and panels; cool blue `oklch(0.55 0.12 240)` for secondary actions
- **Accent Color**: Bright cyan `oklch(0.70 0.15 200)` - Highlights active elements, code selections, and important CTAs
- **Foreground/Background Pairings**: 
  - Background (Dark slate #1a1d29 / oklch(0.14 0.02 250)): Light text (#e8eaed / oklch(0.93 0.005 250)) - Ratio 12.5:1 ✓
  - Primary (Deep indigo oklch(0.45 0.15 270)): White text (#ffffff / oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Bright cyan oklch(0.70 0.15 200)): Dark text (#1a1d29 / oklch(0.14 0.02 250)) - Ratio 9.2:1 ✓
  - Card (Elevated slate #23273a / oklch(0.18 0.02 250)): Light text (#e8eaed / oklch(0.93 0.005 250)) - Ratio 10.1:1 ✓

## Font Selection
Typography should balance code readability with UI clarity, using a monospace font for the editor and a clean sans-serif for the interface.

- **Typographic Hierarchy**: 
  - H1 (Panel Titles): Space Grotesk Bold/20px/tight letter spacing
  - H2 (Section Headers): Space Grotesk Medium/16px/normal letter spacing  
  - Body (UI Text): Inter Regular/14px/normal letter spacing
  - Code (Editor): JetBrains Mono Regular/14px/normal letter spacing with ligatures
  - Labels: Inter Medium/12px/wide letter spacing/uppercase

## Animations
Animations should feel responsive and purposeful - quick panel transitions (200ms) for switching views, smooth accordion expansions (250ms) for tree nodes, and subtle hover states (100ms) on interactive elements. Use elastic easing for drawer slides to add personality without slowing workflow.

## Component Selection
- **Components**: 
  - Tabs for main navigation between Code/Models/Components/Styling views
  - ResizablePanels for adjustable file tree, editor, and preview panes
  - Accordion for collapsible sections in designers
  - ScrollArea for file lists and component trees
  - Select dropdowns for component type and field type pickers
  - Input fields for text properties with real-time validation
  - Button with variants (primary for generate/export, secondary for add/create)
  - Card for model and component visual representations
  - Dialog for configuration modals and confirmations
  - Badge for type indicators and status labels
  
- **Customizations**: 
  - Custom MonacoEditor wrapper component with theme integration
  - Custom SchemaNode component for visual Prisma model representation
  - Custom ComponentTreeItem with drag handles and inline editing
  - Custom ColorPicker using native color input wrapped in Popover
  
- **States**: 
  - Buttons: Subtle glow on hover, pressed state with scale, disabled with reduced opacity
  - Inputs: Border highlight on focus with accent color, error state with red border
  - Tree items: Background highlight on hover, bold text when selected
  - Panels: Shadow increase when resizing, smooth opacity transitions
  
- **Icon Selection**: 
  - Code (code icon) for editor view
  - Database (database icon) for models
  - Tree (tree-structure icon) for components  
  - PaintBrush (paint-brush icon) for styling
  - FileCode (file-code icon) for individual files
  - Plus (plus icon) for create actions
  - Download (download icon) for export
  
- **Spacing**: 
  - Panel padding: p-6 (24px) for main content areas
  - Card padding: p-4 (16px) for nested items
  - Gap between elements: gap-4 (16px) default, gap-2 (8px) for tight groups
  - Section margins: mb-6 (24px) between major sections
  
- **Mobile**: 
  - Stack panels vertically instead of resizable horizontal splits
  - Convert main tabs to a drawer menu on mobile
  - Full-screen editor mode as default on small screens
  - Collapse file tree into slide-out sheet
  - Touch-friendly hit areas (min 44px) for all tree items and buttons
