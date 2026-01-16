# 🔨 CodeForge - Low-Code Next.js App Builder

![CodeForge](https://img.shields.io/badge/CodeForge-v5.3-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-green)
![PWA](https://img.shields.io/badge/PWA-Enabled-orange)

A comprehensive visual low-code platform for generating production-ready Next.js applications with Material UI, Prisma, Flask backends, comprehensive testing suites, and persistent project management. Built with AI-powered code generation and Progressive Web App capabilities for offline-first development.

## ✨ Features

### 🎯 Core Capabilities
- **Progressive Web App** - Install on desktop/mobile, work offline, automatic updates, and push notifications
- **Project Management** - Save, load, duplicate, export, and import complete projects with full state persistence
- **Project Dashboard** - At-a-glance overview of project status, completion metrics, and quick tips
- **Monaco Code Editor** - Full-featured IDE with syntax highlighting, autocomplete, and multi-file editing
- **Prisma Schema Designer** - Visual database model builder with relations and field configuration
- **Component Tree Builder** - Hierarchical React component designer with Material UI integration
- **Component Tree Manager** - Manage multiple named component trees for different app sections
- **Workflow Designer** - n8n-style visual workflow builder with triggers, actions, conditions, and lambdas
- **Lambda Designer** - Serverless function editor with multi-runtime support and trigger configuration
- **Theme Designer** - Advanced theming with multiple variants (light/dark/custom) and unlimited custom colors
- **Favicon Designer** - Visual icon designer with shapes, text, emojis, and multi-size export (16px to 512px)
- **Sass Styling System** - Custom Material UI components with Sass, including utilities, mixins, and animations
- **Flask Backend Designer** - Python REST API designer with blueprints, endpoints, and CORS configuration
- **Project Settings** - Configure Next.js options, npm packages, scripts, and build settings
- **CI/CD Integration** - Generate workflow files for GitHub Actions, GitLab CI, Jenkins, and CircleCI
- **Feature Toggles** - Customize your workspace by enabling/disabling designer features
- **Keyboard Shortcuts** - Power-user shortcuts for rapid navigation and actions

### 🤖 AI-Powered Generation
- **Complete App Generation** - Describe your app and get a full project structure
- **Smart Code Improvements** - Optimize code for performance and best practices
- **Model Generation** - Create Prisma schemas from natural language
- **Component Generation** - Build complex React components with proper structure
- **Theme Generation** - Generate beautiful, accessible color palettes
- **Test Generation** - Create comprehensive E2E, unit, and integration tests
- **Code Explanations** - Understand any code snippet with detailed explanations
- **Auto Error Repair** - Detect and fix syntax, type, import, and lint errors automatically

### 🧪 Testing & Quality
- **Playwright Designer** - Visual E2E test builder with step-by-step configuration
- **Storybook Designer** - Component story builder with args and variations
- **Unit Test Designer** - Comprehensive test suite builder for components, functions, and hooks
- **Error Detection** - Automated scanning for syntax, type, and lint errors
- **Auto Repair System** - AI-powered context-aware error fixing
- **Smoke Tests** - 17 critical tests validating all major features (~30-60s execution)
- **E2E Test Suite** - 50+ comprehensive tests across all functionality (~3-5min execution)

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers (for testing)
npx playwright install

# Start development server
npm run dev
```

### Quick Start
1. **Save Your Work** - Use **Save Project** button to persist your work to the database
2. **Load Projects** - Click **Load Project** to view and switch between saved projects
3. Open the **Documentation** tab in the app for comprehensive guides
4. Use **AI Generate** to scaffold a complete application from a description
5. Navigate between tabs to design models, components, themes, and backend APIs
6. Click **Export Project** to download your complete Next.js application

### Running Tests
```bash
# Run smoke tests (quick validation - ~30-60 seconds)
npm run test:e2e:smoke

# Run all E2E tests (comprehensive - ~3-5 minutes)
npm run test:e2e

# Run tests in interactive UI mode (recommended for debugging)
npm run test:e2e:ui

# Run tests with browser visible
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

**See [RUN_TESTS.md](./RUN_TESTS.md) for detailed test execution guide.**

### Project Management
- **Save Project** - Save current work with name and description to database
- **Load Project** - Browse and load any saved project
- **New Project** - Start fresh with a blank workspace
- **Duplicate** - Create a copy of any saved project
- **Export** - Download project as JSON file for backup or sharing
- **Import** - Load a project from an exported JSON file
- **Delete** - Remove projects from database

### Manual Building
1. **Models Tab** - Create your database schema with Prisma models
2. **Components Tab** - Build your UI component hierarchy
3. **Component Trees Tab** - Organize components into named trees
4. **Workflows Tab** - Design automation workflows visually
5. **Lambdas Tab** - Create serverless functions
6. **Styling Tab** - Design your theme with custom colors and typography
7. **Favicon Designer Tab** - Create app icons and favicons with visual designer
8. **Flask API Tab** - Configure your backend REST API
9. **Settings Tab** - Configure Next.js and npm packages
10. **Code Editor Tab** - Fine-tune generated code directly
11. **Export** - Download your complete, production-ready application

### Accessing Features
- **Global Search** - Press `Ctrl+K` (or `Cmd+K`) to search all features, files, and navigate instantly
- **Hamburger Menu** - Click the menu icon (☰) in the top-left to browse all available tabs
- **Feature Toggles** - Go to **Features** tab to enable/disable specific designers
- **Need Help?** - See [FAVICON_DESIGNER_ACCESS.md](./FAVICON_DESIGNER_ACCESS.md) for troubleshooting

## 📋 Technology Stack

### Frontend
- Next.js 14 with App Router
- React 18 with TypeScript
- Material UI 5
- Sass/SCSS for custom styling
- Monaco Editor
- Tailwind CSS
- Framer Motion

### Backend & Testing
- Flask REST API (Python)
- Prisma ORM
- Playwright (E2E Testing)
- Vitest + React Testing Library
- Storybook for Component Development

### AI Integration
- OpenAI GPT-4 for code generation
- Context-aware prompt engineering
- Intelligent error detection and repair
- Natural language to code translation

## 📚 Documentation

The application includes comprehensive built-in documentation:
- **README** - Complete feature overview and getting started guide
- **Roadmap** - Completed features and planned enhancements
- **Agents Files** - AI service architecture and integration points
- **Sass Styles Guide** - Custom Material UI components, utilities, mixins, and animations
- **CI/CD Guide** - Complete setup guide for all CI/CD platforms
- **PWA Features** - Progressive Web App capabilities and offline support

Access documentation by clicking the **Documentation** tab in the application.

### 📱 Progressive Web App Features

CodeForge is a full-featured PWA that you can install and use offline:

- **Install Anywhere** - Install on desktop (Windows, Mac, Linux) or mobile (iOS, Android)
- **Offline Support** - Work without internet connection; changes sync when reconnected
- **Automatic Updates** - Get notified when new versions are available
- **Push Notifications** - Stay informed about project builds and updates (optional)
- **Fast Loading** - Intelligent caching for near-instant startup
- **App Shortcuts** - Quick access to Dashboard, Code Editor, and Models from your OS
- **Share Target** - Share code files directly to CodeForge from other apps
- **Background Sync** - Project changes sync automatically in the background

**To Install:**
1. Visit the app in a supported browser (Chrome, Edge, Safari, Firefox)
2. Look for the install prompt in the address bar or use the "Install" button in the app
3. Follow the installation prompts for your platform
4. Access the app from your applications menu or home screen

**PWA Settings:**
- Navigate to **PWA** tab to configure notifications, clear cache, and check installation status
- Monitor network status and cache size
- Manage service worker and offline capabilities

## 🗺️ Roadmap

### ✅ Completed (v1.0 - v5.3)
- Progressive Web App with offline support and installability
- Project persistence with save/load functionality
- Project dashboard with completion metrics
- Monaco code editor integration
- Visual designers for models, components, and themes
- Multiple component trees management
- n8n-style workflow designer
- Lambda function designer with multi-runtime support
- AI-powered generation across all features
- Multi-theme variant support
- Testing suite designers (Playwright, Storybook, Unit Tests)
- Auto error detection and repair
- Flask backend designer
- Project settings and npm management
- Custom Sass styling system with utilities and mixins
- ZIP file export with README generation
- Keyboard shortcuts for power users
- Complete CI/CD configurations (GitHub Actions, GitLab CI, Jenkins, CircleCI)
- Docker containerization with multi-stage builds
- Feature toggle system for customizable workspace
- Project export/import as JSON
- Project duplication and deletion
- Service Worker with intelligent caching
- Push notifications and background sync
- App shortcuts and share target API

### 🔮 Planned
- Real-time preview with hot reload
- Database seeding designer
- API client generator
- Visual form builder
- Authentication designer (JWT, OAuth, sessions)
- GraphQL API designer
- State management designer (Redux, Zustand, Jotai)
- Component library export
- Design system generator
- Collaboration features

## 🎨 Design Philosophy

CodeForge combines the power of visual low-code tools with professional IDE capabilities:
- **Empowering** - Control at both visual and code levels
- **Intuitive** - Complex generation made approachable
- **Professional** - Production-ready, best-practice code output

## 🤝 Contributing

CodeForge is built on the Spark platform. Contributions, feature requests, and feedback are welcome!

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🔗 Resources

- [Full Documentation](./PRD.md) - Complete product requirements and design decisions
- [Error Repair Guide](./ERROR_REPAIR_GUIDE.md) - Error detection and repair system documentation
- [CI/CD Guide](./CI_CD_GUIDE.md) - Complete CI/CD setup and configuration guide
- [Favicon Designer Access](./FAVICON_DESIGNER_ACCESS.md) - How to access and use the Favicon Designer
- [E2E Test Documentation](./e2e/README.md) - Comprehensive Playwright test suite guide
- [E2E Test Summary](./E2E_TEST_SUMMARY.md) - Test coverage and validation details
- [Run Tests Guide](./RUN_TESTS.md) - How to execute smoke tests and full test suite
- [PWA Guide](./PWA_GUIDE.md) - Progressive Web App features and setup

---

**Built with ❤️ using GitHub Spark**
