# CodeForge Documentation

Welcome to the CodeForge documentation. This directory contains comprehensive guides, references, and troubleshooting resources.

## 📚 Documentation Structure

### Getting Started
- **[../README.md](../README.md)** - Main project README with features and quick start
- **[../PRD.md](../PRD.md)** - Product Requirements Document

### Architecture & Design
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - System architecture overview
- **[JSON_UI_REFACTOR_PRD.md](../JSON_UI_REFACTOR_PRD.md)** - JSON-driven UI system design
- **[architecture.json](../architecture.json)** - Machine-readable architecture definition

### Development Guides

#### JSON-Driven System
- **[JSON_UI_GUIDE.md](../JSON_UI_GUIDE.md)** - Complete guide to JSON-driven pages
- **[JSON_QUICK_REFERENCE.md](../JSON_QUICK_REFERENCE.md)** - Quick syntax reference
- **[DATA_BINDING_GUIDE.md](../DATA_BINDING_GUIDE.md)** - Data binding patterns and examples

#### Implementation
- **[IMPLEMENTATION_CHECKLIST.md](../IMPLEMENTATION_CHECKLIST.md)** - Feature implementation tracking
- **[REFACTOR_SUMMARY.md](../REFACTOR_SUMMARY.md)** - Refactoring history and patterns
- **[JSON_CONVERSION_SUMMARY.md](../JSON_CONVERSION_SUMMARY.md)** - Page migration progress

### Troubleshooting & Fixes

#### Quick Help
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - ⚡ **START HERE** for common issues
  - Build errors
  - Dev server issues
  - TypeScript problems
  - Runtime errors
  - Quick command reference

#### Detailed Error Documentation
- **[ERROR_FIXES.md](ERROR_FIXES.md)** - Comprehensive error analysis
  - Root cause explanations
  - Step-by-step fixes
  - Prevention strategies
  - CI/CD and browser issues

#### Session Notes
- **[SESSION_SUMMARY.md](SESSION_SUMMARY.md)** - Latest fix session summary
- **[CI_CD_QUICK_FIX_GUIDE.md](../CI_CD_QUICK_FIX_GUIDE.md)** - CI/CD specific issues

### Reference Summaries
- **[IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)** - Feature implementation status
- **[JSON_UI_ENHANCEMENT_SUMMARY.md](../JSON_UI_ENHANCEMENT_SUMMARY.md)** - UI system enhancements
- **[REFACTORING_COMPLETE_SUMMARY.md](../REFACTORING_COMPLETE_SUMMARY.md)** - Refactoring achievements

### Security & CI/CD
- **[SECURITY.md](../SECURITY.md)** - Security policies and reporting
- **[CI_CD_SIMULATION_RESULTS.md](../CI_CD_SIMULATION_RESULTS.md)** - CI/CD testing results

---

## 🚨 Having Issues?

### Quick Troubleshooting Path

1. **Build Error?** → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
2. **Need Details?** → See [ERROR_FIXES.md](ERROR_FIXES.md) for root causes
3. **CI/CD Failing?** → Check [CI_CD_QUICK_FIX_GUIDE.md](../CI_CD_QUICK_FIX_GUIDE.md)
4. **Still Stuck?** → Look at [SESSION_SUMMARY.md](SESSION_SUMMARY.md) for latest fixes

### Common Quick Fixes

```bash
# Clear everything and rebuild
rm -rf node_modules dist package-lock.json
npm install
npm run build

# Just restart TypeScript
# In VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Fix package lock for CI/CD
npm install
git add package-lock.json
git commit -m "fix: sync package lock"
```

---

## 📖 Learning the System

### If You're New
1. Read the main [README.md](../README.md)
2. Check [ARCHITECTURE.md](../ARCHITECTURE.md)
3. Try the [JSON_QUICK_REFERENCE.md](../JSON_QUICK_REFERENCE.md)
4. Build something with [JSON_UI_GUIDE.md](../JSON_UI_GUIDE.md)

### If You're Contributing
1. Review [IMPLEMENTATION_CHECKLIST.md](../IMPLEMENTATION_CHECKLIST.md)
2. Follow patterns in [REFACTOR_SUMMARY.md](../REFACTOR_SUMMARY.md)
3. Check [JSON_CONVERSION_SUMMARY.md](../JSON_CONVERSION_SUMMARY.md) for migration status

### If You're Debugging
1. Start with [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Deep dive with [ERROR_FIXES.md](ERROR_FIXES.md)
3. Check recent changes in [SESSION_SUMMARY.md](SESSION_SUMMARY.md)

---

## 📝 Document Conventions

### File Naming
- `*.md` - Markdown documentation
- `*_GUIDE.md` - Tutorial/how-to guides
- `*_SUMMARY.md` - Status/progress summaries
- `*_REFERENCE.md` - Quick reference sheets

### Update Frequency
- **Static**: Architecture, guides (update on major changes)
- **Living**: Summaries, checklists (update regularly)
- **Session**: Troubleshooting, fixes (update after each debug session)

---

## 🔗 Quick Links

### Most Used Docs
- [Troubleshooting Guide](TROUBLESHOOTING.md) 🔥
- [JSON UI Guide](../JSON_UI_GUIDE.md)
- [Main README](../README.md)

### Most Useful References
- [JSON Quick Reference](../JSON_QUICK_REFERENCE.md)
- [Data Binding Guide](../DATA_BINDING_GUIDE.md)
- [Error Fixes](ERROR_FIXES.md)

### Project Status
- [Implementation Checklist](../IMPLEMENTATION_CHECKLIST.md)
- [Latest Session](SESSION_SUMMARY.md)
- [Conversion Progress](../JSON_CONVERSION_SUMMARY.md)

---

## 💡 Tips

- **Use Cmd/Ctrl + F** to search within docs
- **Check git history** for context: `git log --grep="feature"`
- **Look at code** when docs unclear: Documentation references actual files
- **Update docs** when you fix something: Help the next person!

---

## 📬 Documentation Updates

If you find:
- Missing information
- Outdated instructions
- Confusing explanations
- New error patterns

Please update the relevant doc and include clear examples!

---

**Last Updated**: Latest error fix session  
**Maintained By**: CodeForge Team  
**Status**: Active Development
