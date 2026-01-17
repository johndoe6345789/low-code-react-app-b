# Planning Guide

A visual Docker build error analyzer that parses build logs, highlights errors, and provides actionable solutions with automatic fix generation.

**Experience Qualities**:
1. **Clarifying** - Takes cryptic Docker logs and transforms them into clear, understandable problem statements
2. **Actionable** - Provides specific, copy-paste ready solutions rather than generic advice
3. **Educational** - Explains the root cause so users learn what went wrong and why

**Complexity Level**: Light Application (multiple features with basic state)
This is a diagnostic tool with log parsing, error highlighting, and solution generation - more than a single-purpose tool but not a complex multi-view application.

## Essential Features

### Log Parser & Error Highlighter
- **Functionality**: Paste Docker build logs and automatically extract error information
- **Purpose**: Make sense of lengthy, unformatted build output
- **Trigger**: User pastes log text into a text area
- **Progression**: Paste log → Auto-parse on input → Highlight errors in red → Extract key details → Display structured output
- **Success criteria**: Correctly identifies build stage, error type, exit codes, and root cause from real Docker logs

### Smart Solution Generator
- **Functionality**: Analyzes parsed errors and suggests specific fixes with code examples
- **Purpose**: Provide actionable solutions tailored to the exact error type
- **Trigger**: After log is parsed and error identified
- **Progression**: Error identified → Match error pattern → Generate relevant solutions → Display with copy buttons → Show explanation
- **Success criteria**: Provides relevant, working solutions for common Docker build issues (missing dependencies, platform issues, build failures)

### Error Knowledge Base
- **Functionality**: Common Docker build errors with explanations and fixes
- **Purpose**: Quick reference for developers debugging builds
- **Trigger**: User browses error categories or searches
- **Progression**: Click category → View error patterns → Select specific error → See explanation and fixes
- **Success criteria**: Covers at least 10 common Docker build error patterns with clear explanations

### Fix Code Generator
- **Functionality**: Generate copy-paste ready Dockerfile snippets or package.json modifications
- **Purpose**: Speed up fixing by providing exact code changes needed
- **Trigger**: After solution is displayed
- **Progression**: Solution shown → Click "Generate Fix" → Code snippet created → Copy to clipboard → Apply to project
- **Success criteria**: Generated code is syntactically correct and addresses the identified issue

## Edge Case Handling

- **Incomplete Logs**: Gracefully handle partial logs by extracting whatever information is available
- **Unknown Errors**: For unrecognized error patterns, provide general debugging steps and encourage manual investigation
- **Multiple Errors**: When multiple errors present, prioritize and display them in order of likely root cause
- **Empty Input**: Show helpful placeholder text with example log format
- **Very Long Logs**: Truncate display but maintain full parsing capability

## Design Direction

The design should feel like a developer's diagnostic dashboard - technical but approachable, with clear visual hierarchy that guides the eye from problem to solution. Think of a code editor meets troubleshooting assistant.

## Color Selection

A code-focused palette with strong error signaling and calm backgrounds.

- **Primary Color**: `oklch(0.58 0.24 265)` - Tech purple that feels modern and developer-centric
- **Secondary Colors**: `oklch(0.25 0.03 265)` - Deep navy backgrounds for code blocks and panels
- **Accent Color**: `oklch(0.75 0.20 145)` - Bright teal for success states and actionable elements
- **Foreground/Background Pairings**: 
  - Background (`oklch(0.15 0.02 265)`): Light text `oklch(0.95 0.01 265)` - Ratio 11.2:1 ✓
  - Card (`oklch(0.19 0.02 265)`): Light text `oklch(0.95 0.01 265)` - Ratio 9.8:1 ✓
  - Accent (`oklch(0.75 0.20 145)`): Dark text `oklch(0.15 0.02 265)` - Ratio 7.5:1 ✓
  - Destructive/Error (`oklch(0.60 0.25 25)`): White text `oklch(1 0 0)` - Ratio 5.2:1 ✓

## Font Selection

Monospace for code and logs, clean sans-serif for explanations - reflecting the technical nature while remaining readable.

- **Typographic Hierarchy**:
  - H1 (Main Title): JetBrains Mono Bold/32px/tight letter spacing
  - H2 (Section Headers): JetBrains Mono Medium/24px/normal spacing
  - Body Text: IBM Plex Sans Regular/16px/1.6 line height
  - Code/Logs: JetBrains Mono Regular/14px/1.5 line height
  - Small Labels: IBM Plex Sans Medium/12px/uppercase tracking

## Animations

Animations should feel snappy and technical, like a terminal responding to commands.

- Error highlights fade in with a quick pulse (200ms) to draw attention
- Solutions expand/collapse smoothly (300ms ease-out)
- Copy confirmation shows brief checkmark animation (150ms)
- Log parsing shows subtle progress indicator during processing
- Tab switches use fast slide transitions (200ms)

## Component Selection

- **Components**: 
  - Textarea (custom styled) for log input with monospace font
  - Card for structured error display with distinct sections
  - Badge for error types, build stages, and exit codes
  - Tabs for switching between parsed errors, solutions, and knowledge base
  - Button (primary for actions, secondary for copy operations)
  - ScrollArea for long log outputs
  - Separator to divide error details from solutions
  - Alert for success/info messages after copying
  
- **Customizations**: 
  - Custom syntax highlighting for Docker logs using color coding
  - Custom error badge with pulsing animation for critical errors
  - Monospace code blocks with line numbers for generated fixes
  
- **States**: 
  - Buttons: Default solid with subtle shadow, hover lifts with brightness increase, active depresses
  - Input: Focused state has bright accent border with subtle glow
  - Code blocks: Hover shows copy button overlay in corner
  
- **Icon Selection**: 
  - Terminal (for log input)
  - Warning/WarningCircle (for errors)
  - CheckCircle (for solutions)
  - Copy/CopySimple (for copy actions)
  - MagnifyingGlass (for search in knowledge base)
  - Code (for generated fixes)
  - Stack (for Docker layers)
  
- **Spacing**: 
  - Container padding: p-6 on desktop, p-4 on mobile
  - Section gaps: gap-8 for major sections, gap-4 for related content
  - Card internal padding: p-6
  - Button spacing: px-6 py-3 for primary, px-4 py-2 for secondary
  
- **Mobile**: 
  - Stack all sections vertically on mobile
  - Reduce font sizes: H1 to 24px, Body to 14px
  - Full-width buttons and inputs
  - Collapsible sections for solutions to save space
  - Fixed header with title, scrollable content below
