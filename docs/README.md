# CodeForge Documentation

This directory contains comprehensive documentation for the CodeForge low-code application builder.

## 🚀 Quick Start

### New Features
- **[Hover-Based Preloading](./hover-preloading.md)** - Instant page navigation (NEW!)
- **[Preloading Quick Reference](./preloading-quick-reference.md)** - Quick start guide (NEW!)
- **[Router Quick Start](./ROUTER_QUICK_START.md)** - Enable React Router in 2 minutes
- **[React Router Integration](./REACT_ROUTER_INTEGRATION.md)** - Full router documentation

## 📚 Documentation Structure

### Getting Started
- **[Router Quick Start](./ROUTER_QUICK_START.md)** - Enable route-based code splitting
- **[PRD](./PRD.md)** - Product Requirements Document

### Performance & Optimization
- **[Bundle Optimization (Monaco Editor)](./bundle-optimization.md)** - Lazy-load heavy components (NEW!)
- **[Hover-Based Preloading](./hover-preloading.md)** - Instant navigation with preloading
- **[Preloading Quick Reference](./preloading-quick-reference.md)** - Quick start
- **[React Router Integration](./REACT_ROUTER_INTEGRATION.md)** - Route-based code splitting
- **[Router vs Tabs Comparison](./ROUTER_VS_TABS_COMPARISON.md)** - Performance benchmarks
- **[Router Quick Start](./ROUTER_QUICK_START.md)** - Enable router in 2 minutes
- **[Bundle Optimization](./BUNDLE_OPTIMIZATION.md)** - Bundle size and performance optimization

### Error Fixes & Troubleshooting
- **[502 Error Fix](./502_ERROR_FIX.md)** - Fix 502 Bad Gateway errors
- **[CI/CD Fixes](./CI_CD_FIXES.md)** - Continuous integration fixes

### Architecture & Organization
- **[Documentation Reorganization](./DOCUMENTATION_REORGANIZATION.md)** - Docs structure
- **[Cleanup Complete](./CLEANUP_COMPLETE.md)** - Code cleanup summary
- **[Changes Summary](./CHANGES_SUMMARY.md)** - Recent changes
- **[Organization Plan](./ORGANIZATION_PLAN.md)** - Project organization

### Detailed Sections
- **[API Documentation](./api/)** - API reference
- **[Architecture](./architecture/)** - System architecture
- **[Deployment](./deployment/)** - Deployment guides  
- **[Guides](./guides/)** - How-to guides
- **[Testing](./testing/)** - Testing documentation
- **[Reference](./reference/)** - Technical reference

## 🆕 Recent Additions

### Monaco Editor Lazy Loading (Latest)
Optimized bundle size by lazy-loading Monaco Editor (2.5MB+):

**Benefits:**
- ~2.5MB reduction in initial bundle size
- Faster initial page load for all users
- Monaco Editor loads only when needed
- Automatic preloading when editor pages are accessed

**Components optimized:**
- CodeEditor (main file editor)
- LambdaDesigner (lambda function editor)
- WorkflowDesigner (inline script editors)

**Learn more:**
- [Full Documentation](./bundle-optimization.md) - Complete optimization guide
- [Implementation Details](./bundle-optimization.md#optimization-strategy) - Technical details

### Hover-Based Route Preloading
Instant page navigation with intelligent preloading:

**Benefits:**
- Instant navigation on hover-preloaded routes
- Adjacent route preloading for smooth sequential navigation
- Popular routes preloaded in background
- Visual feedback with preload indicator

**Features:**
- Hover detection with 100ms delay
- Smart concurrency control (max 3 concurrent)
- Automatic adjacent and popular route preloading
- Cache management and status tracking

**Learn more:**
- [Full Documentation](./hover-preloading.md) - Complete guide
- [Quick Reference](./preloading-quick-reference.md) - Quick start

### React Router Integration
We've added full React Router support with route-based code splitting:

**Benefits:**
- 52% smaller initial bundle (1.2MB vs 2.5MB)
- 50% faster time to interactive
- URL-based navigation
- Browser back/forward support
- Better code organization

**Enable it:**
```typescript
// src/config/app.config.ts
export const APP_CONFIG = {
  useRouter: true,  // Change this!
}
```

**Learn more:**
- [Quick Start Guide](./ROUTER_QUICK_START.md) - Get started in 2 minutes
- [Full Documentation](./REACT_ROUTER_INTEGRATION.md) - Complete guide

## Available Guides

### [502 Bad Gateway Error Fix](./502_ERROR_FIX.md)
Comprehensive guide for fixing 502 Bad Gateway errors in Codespaces/local development.

**Quick Fix:**
```bash
# Run the diagnostic script
bash scripts/diagnose-502.sh

# Then restart the dev server
npm run kill
npm run dev
```

**Key Changes Made:**
- ✅ Updated `vite.config.ts` to use port 5000 (was 5173)
- ✅ Server already configured to bind to `0.0.0.0`
- ✅ Updated CI/CD workflows to use `npm install` instead of `npm ci`

## Common Issues

### 1. Port Mismatch
**Symptom**: 502 errors when accessing Codespaces URL
**Cause**: Vite running on different port than forwarded
**Fix**: Ensure vite.config.ts uses port 5000

### 2. Workspace Dependencies
**Symptom**: CI/CD fails with `EUNSUPPORTEDPROTOCOL`
**Cause**: `npm ci` doesn't support workspace protocol
**Fix**: Use `npm install` or switch to pnpm

### 3. Server Not Accessible
**Symptom**: 502 errors even when server is running
**Cause**: Server bound to localhost only
**Fix**: Use `host: '0.0.0.0'` in vite.config.ts (already done)

### 4. MIME Type Errors
**Symptom**: Resources refused as wrong content type
**Cause**: Usually secondary to 502 errors
**Fix**: Fix 502 errors first, MIME issues resolve automatically

## Quick Commands

```bash
# Check if server is running
lsof -i :5000

# Kill server on port 5000
npm run kill

# Start dev server
npm run dev

# Run diagnostics
bash scripts/diagnose-502.sh

# Check Codespaces ports
gh codespace ports

# Install dependencies (with workspace support)
npm install
```

## File Changes Made

| File | Change | Status |
|------|--------|--------|
| `vite.config.ts` | Port 5173 → 5000 | ✅ Fixed |
| `.github/workflows/ci.yml` | `npm ci` → `npm install` (4 places) | ✅ Fixed |
| `.github/workflows/e2e-tests.yml` | `npm ci` → `npm install` | ✅ Fixed |
| `scripts/diagnose-502.sh` | Created diagnostic script | ✅ New |
| `docs/502_ERROR_FIX.md` | Created comprehensive guide | ✅ New |

## Next Steps After Fixes

1. **Restart Development Server**
   ```bash
   npm run kill  # Kill existing processes
   npm run dev   # Start fresh
   ```

2. **Verify in Browser**
   - Open Codespaces forwarded URL for port 5000
   - Should see React app load without errors
   - Check browser console - no 502s

3. **Test CI/CD**
   - Push changes to trigger workflow
   - Verify `npm install` succeeds
   - Build should complete successfully

4. **Long-term Improvements**
   - Consider migrating to pnpm for better workspace support
   - Add health check endpoint for monitoring
   - Document port configuration for team

## Troubleshooting

If issues persist after applying fixes:

1. **Check the diagnostic output**:
   ```bash
   bash scripts/diagnose-502.sh
   ```

2. **Verify Codespaces port forwarding**:
   - Open Ports panel in VS Code
   - Ensure port 5000 is forwarded
   - Set visibility to Public or Private to Org

3. **Check server logs**:
   - Look for errors in terminal where dev server runs
   - Common issues: missing deps, syntax errors, port conflicts

4. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

5. **Rebuild dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

## Additional Resources

- [Vite Configuration Guide](https://vitejs.dev/config/)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [pnpm Workspace Guide](https://pnpm.io/workspaces)

## Support

If you continue experiencing issues:

1. Check existing documentation in `docs/` directory
2. Review browser console for specific error messages
3. Check server terminal logs for backend errors
4. Verify all file changes were applied correctly
