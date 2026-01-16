# Planning Guide

A visual low-code platform for generating Next.js applications with Material UI styling, integrated Monaco code editor, Prisma schema designer, and persistent project management.

**Experience Qualities**: 
1. **Empowering** - Users feel in control with both visual and code-level editing capabilities
2. **Intuitive** - Complex application generation feels approachable through well-organized GUI tools
3. **Professional** - Output-ready code that follows modern best practices and conventions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured low-code IDE with multiple integrated tools (code editor, visual designers, schema builder), state management across views, persistent project storage, and code generation capabilities that require sophisticated UI organization.

## Essential Features

### Project Save/Load Management
- **Functionality**: Complete project persistence system using Spark KV database with save, load, duplicate, export, import, and delete operations
- **Purpose**: Allow users to work on multiple projects over time without losing progress, share projects via JSON export, and maintain a library of saved work
- **Trigger**: Save/Load/New Project buttons in the header toolbar
- **Progression**: Click Save → Enter project name and description → Project saved to database → View saved projects list → Load any project → All state restored including files, models, components, trees, workflows, lambdas, themes, tests, and settings
- **Success criteria**: Projects persist between sessions; all application state is saved and restored correctly; can duplicate, export (JSON), import, and delete projects; project list shows metadata (name, description, dates); smooth loading experience with no data loss

### Monaco Code Editor Integration
- **Functionality**: Full-featured code editor with syntax highlighting, autocomplete, multi-file editing, and AI-powered code improvement and explanation
- **Purpose**: Allows direct code manipulation for users who want precise control, with AI assistance for learning and optimization
- **Trigger**: Clicking on files in the file tree or switching to code view
- **Progression**: Select file → Editor opens with syntax highlighting → Edit code → Use AI to improve or explain code → Changes auto-saved to state → Preview updates
- **Success criteria**: Code edits persist, syntax highlighting works for JS/TS/CSS, multiple files can be open in tabs, AI explanations are helpful, AI improvements are relevant

### AI-Powered Code Generation
- **Functionality**: Generate complete files, components, models, and themes using natural language descriptions via OpenAI integration
- **Purpose**: Accelerates development by automating boilerplate and scaffolding based on user intent
- **Trigger**: Clicking AI/Sparkle icons in various sections or the main "AI Generate" button
- **Progression**: User describes intent → AI processes request → Generated code appears → User can refine or accept
- **Success criteria**: Generated code is syntactically valid, follows conventions, matches user intent, integrates with existing project structure

### Prisma Schema Designer
- **Functionality**: Visual model designer for database schemas with drag-and-drop field creation and AI-powered model generation and field suggestions
- **Purpose**: Simplifies database modeling without requiring Prisma syntax knowledge, with intelligent AI assistance
- **Trigger**: Opening the Models tab
- **Progression**: Create model manually or with AI → Add fields with types or get AI suggestions → Define relations → Visual graph updates → Generate Prisma schema code
- **Success criteria**: Can create models, fields, relations; AI suggestions are contextually relevant; generates valid Prisma syntax; visual representation is clear

### Component Tree Builder
- **Functionality**: Hierarchical tree view for building React component structure with AI-powered component generation
- **Purpose**: Visual composition of component hierarchy without writing JSX, enhanced by AI scaffolding
- **Trigger**: Opening the Components tab
- **Progression**: Select component type or describe to AI → Add to tree → Configure props → Nest children → View generated JSX → Export component
- **Success criteria**: Can add/remove/reorder components; AI-generated components are well-structured; props are editable; generates valid React code

### Component Tree Manager
- **Functionality**: Manage multiple named component trees, each with its own hierarchy and component structure
- **Purpose**: Organize different parts of the application (Main App, Dashboard, Admin Panel) into separate, manageable trees
- **Trigger**: Opening the Component Trees tab
- **Progression**: Create tree → Name and describe purpose → Build component hierarchy → Switch between trees → Duplicate or delete trees → Export all trees
- **Success criteria**: Can create unlimited trees; each tree maintains independent state; trees can be duplicated; generates organized component structure per tree

### n8n-Style Workflow Designer
- **Functionality**: Visual workflow builder with draggable nodes (triggers, actions, conditions, transforms, lambdas, APIs, database queries) connected by visual connections
- **Purpose**: Design automation workflows and business logic visually without coding complex orchestration
- **Trigger**: Opening the Workflows tab
- **Progression**: Create workflow → Add nodes (drag/position on canvas) → Connect nodes → Configure each node (API endpoints, conditions, lambda code) → Activate workflow → Export workflow definition
- **Success criteria**: Nodes can be positioned freely; connections show data flow; Monaco editor for lambda/transform nodes; supports HTTP methods, database queries, conditional branching; workflows persist and can be activated/deactivated

### Lambda Function Designer
- **Functionality**: Full-featured serverless function editor with Monaco code editor, multiple runtime support (Node.js, Python), environment variables, and trigger configuration
- **Purpose**: Create and manage serverless functions with professional IDE features
- **Trigger**: Opening the Lambdas tab
- **Progression**: Create lambda → Select language (TypeScript/JavaScript/Python) → Write code in Monaco editor → Configure runtime, timeout, memory → Add triggers (HTTP, schedule, event, queue) → Set environment variables → Export lambda definitions
- **Success criteria**: Monaco editor with syntax highlighting; supports multiple languages; configuration matches AWS Lambda standards; triggers are configurable; environment variables are managed securely; generates deployment-ready functions

### Style Designer
- **Functionality**: Visual interface for Material UI theming with support for multiple theme variants (light/dark/custom), custom color management, and AI theme generation from descriptions
- **Purpose**: Configure colors, typography, spacing with support for unlimited theme variants and custom color palettes beyond standard specifications, with AI design assistance
- **Trigger**: Opening the Styling tab
- **Progression**: Select or create theme variant → Adjust standard colors or add custom colors → Configure typography and spacing → Preview updates live across all variants → Switch between variants → Export theme configuration with all variants
- **Success criteria**: Color pickers work; custom colors can be added/removed; multiple theme variants persist; AI themes match descriptions and have good contrast; generates valid MUI theme code for all variants including light and dark modes

### Playwright E2E Test Designer
- **Functionality**: Visual designer for Playwright end-to-end tests with step-by-step action configuration and AI-powered test generation
- **Purpose**: Create comprehensive E2E tests without writing Playwright code manually
- **Trigger**: Opening the Playwright tab
- **Progression**: Create test suite manually or with AI → Add test steps (navigate, click, fill, expect) → Configure selectors and assertions → AI can generate complete test flows → Export Playwright test files
- **Success criteria**: Can create tests with multiple steps; selectors and assertions are properly configured; AI-generated tests are executable; generates valid Playwright test code

### Storybook Story Designer
- **Functionality**: Visual designer for Storybook stories with component args/props configuration and AI story generation
- **Purpose**: Document component variations and states without manually writing story files
- **Trigger**: Opening the Storybook tab
- **Progression**: Create story manually or with AI → Configure component name and story name → Add args/props → Organize by category → AI can suggest appropriate variations → Export Storybook story files
- **Success criteria**: Can create stories for any component; args can be added/edited with type detection; organized by categories; AI stories showcase meaningful variations; generates valid Storybook CSF3 format

### Unit Test Designer
- **Functionality**: Visual designer for unit tests with test case and assertion management, supports component/function/hook/integration tests, and AI test generation
- **Purpose**: Create comprehensive test suites with proper setup, assertions, and teardown without writing test code manually
- **Trigger**: Opening the Unit Tests tab
- **Progression**: Create test suite manually or with AI → Select test type (component/function/hook/integration) → Add test cases → Configure setup, assertions, and teardown → AI can generate complete test suites → Export test files for Vitest/React Testing Library
- **Success criteria**: Can create test suites for different types; test cases have multiple assertions; setup/teardown code is optional; AI tests are comprehensive; generates valid Vitest test code

### Flask Backend Designer
- **Functionality**: Visual designer for Flask REST API with blueprint management, endpoint configuration, route parameters, authentication settings, and CORS configuration
- **Purpose**: Design Python Flask backends without writing Flask code manually, creating a complete full-stack application ecosystem
- **Trigger**: Opening the Flask API tab
- **Progression**: Create blueprint → Add endpoints with HTTP methods → Configure query/path parameters → Set authentication and CORS requirements → Generate complete Flask application with blueprints
- **Success criteria**: Can create blueprints with multiple endpoints; supports all HTTP methods (GET/POST/PUT/DELETE/PATCH); parameters are properly configured; generates valid Flask code with proper routing

### Project Settings Designer
- **Functionality**: Configure Next.js settings, manage npm packages and dependencies, define npm scripts, and set package manager preferences
- **Purpose**: Comprehensive project configuration without manually editing package.json or config files
- **Trigger**: Opening the Settings tab
- **Progression**: Configure Next.js features (TypeScript, ESLint, Tailwind, App Router) → Add/edit npm packages → Define build scripts → Set package manager → Export complete package.json
- **Success criteria**: Next.js config options are properly applied; packages separated into dependencies and devDependencies; scripts are valid; supports npm/yarn/pnpm; generates valid package.json

### Auto Error Detection & Repair
- **Functionality**: Automated error detection and AI-powered code repair system that scans files for syntax, type, import, and lint errors
- **Purpose**: Automatically identify and fix code errors without manual debugging, saving time and reducing bugs
- **Trigger**: Opening the Error Repair tab or clicking "Scan" button
- **Progression**: Scan files → Detect errors (syntax, imports, types, lint) → Display errors grouped by file → Repair individual errors or batch repair all → View explanations → Rescan to verify fixes
- **Success criteria**: Detects common errors accurately; AI repairs produce valid, working code; can repair single errors or entire files; provides clear explanations of fixes; supports context-aware repair using related files

### Project Generator
- **Functionality**: Exports complete Next.js project with all configurations
- **Purpose**: Converts visual designs into downloadable, runnable applications
- **Trigger**: Clicking "Generate Project" or "Export Code"
- **Progression**: User finalizes design → Clicks export → System bundles files → Downloads zip or shows code → User extracts and runs locally
- **Success criteria**: Generated project structure is valid; includes package.json; code runs without errors

### Custom Sass Styling System
- **Functionality**: Comprehensive Sass-based styling system for non-standard Material UI components with pre-built components, utilities, mixins, and animations
- **Purpose**: Extend Material UI with custom styled components and provide consistent design patterns through Sass
- **Trigger**: Using Sass classes in components or importing Sass modules for custom styling
- **Progression**: Import main.scss → Apply custom component classes → Use mixins for custom styles → Configure variables for theming
- **Success criteria**: All Sass styles compile correctly; custom components render with proper styling; mixins work as expected; animations are smooth and respect reduced motion preferences

## Edge Case Handling
- **Empty Projects**: Show welcome screen with quick-start templates when no project exists; AI can generate entire projects from scratch
- **Invalid Prisma Schemas**: Validate models and show inline errors before generating code
- **Circular Component Dependencies**: Detect and warn when component tree has circular references
- **Missing Required Props**: Highlight components with missing required Material UI props
- **Large Files**: Implement virtual scrolling and lazy loading for large component trees and file lists
- **AI Generation Failures**: Provide clear error messages and fallback to manual editing when AI requests fail
- **Rate Limiting**: Handle OpenAI API rate limits gracefully with user-friendly messages
- **Invalid AI Responses**: Validate and sanitize AI-generated code before insertion
- **Empty Test Suites**: Show helpful empty states with guidance for creating first test/story
- **Invalid Test Selectors**: Warn when Playwright selectors might be problematic
- **Missing Test Assertions**: Highlight test cases without assertions as incomplete
- **Storybook Args Type Mismatch**: Auto-detect arg types and provide appropriate input controls
- **No Errors Found**: Show success state when error scan finds no issues
- **Unrepairable Errors**: Display clear messages when AI cannot fix certain errors and suggest manual intervention
- **Context-Dependent Errors**: Use related files as context for more accurate error repair
- **Empty Flask Blueprints**: Show empty state with guidance for creating first endpoint
- **Invalid Flask Routes**: Validate route paths and warn about conflicts or invalid syntax
- **Missing Required Parameters**: Highlight endpoints with incomplete parameter configurations
- **Duplicate Package Names**: Prevent adding the same npm package twice
- **Invalid Package Versions**: Validate semantic versioning format for npm packages
- **Conflicting Scripts**: Warn when npm script names conflict with built-in commands

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
  - Flask (flask icon) for Flask backend API
  - Gear (gear icon) for project settings
  - Play (play icon) for Playwright E2E tests
  - BookOpen (book-open icon) for Storybook stories
  - Cube (cube icon) for unit tests
  - Wrench (wrench icon) for error repair
  - FileCode (file-code icon) for individual files
  - Plus (plus icon) for create actions
  - Download (download icon) for export
  - Sparkle (sparkle icon) for AI generation
  - Lightning (lightning icon) for scan/quick actions
  - CheckCircle (check-circle icon) for success states
  - Warning (warning icon) for warnings
  - X (x icon) for errors
  - Package (package icon) for npm packages
  - Pencil (pencil icon) for edit actions
  
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
