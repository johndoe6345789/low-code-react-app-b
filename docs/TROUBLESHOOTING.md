# Troubleshooting Guide

Quick reference for common issues and their solutions.

## Build Errors

### "Unknown at rule: @include"

**Symptom**: Tailwind CSS warnings about SCSS mixins

**Fix**: SCSS mixins have been converted to standard media queries. If you see this, clear your build cache:
```bash
rm -rf dist node_modules/.cache
npm run build
```

---

### "Property 'X' does not exist on type..."

**Symptom**: TypeScript can't find properties that clearly exist

**Fix**: Restart TypeScript server and clear cache:
```bash
# In VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or clear everything
rm -rf node_modules dist
npm install
```

---

### "Module has already exported a member named 'X'"

**Symptom**: Duplicate export names between atoms and molecules

**Fix**: Already fixed in `src/components/index.ts`. Use the prefixed versions:
- `MoleculeStatCard` instead of `StatCard` from molecules
- `MoleculeEmptyState` instead of `EmptyState` from molecules
- `MoleculeLoadingState` instead of `LoadingState` from molecules

---

## Dev Server Issues

### 502 Bad Gateway

**Symptom**: All Vite resources return 502 in Codespaces

**Root Cause**: Port mismatch

**Fix Option 1** (Easiest):
1. Check which port Vite is running on (usually 5173)
2. In Codespaces Ports panel, forward that port
3. Access the URL with the correct port

**Fix Option 2** (If you need port 5000):
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0'  // Required for Codespaces
  }
})
```

---

### "Cannot GET /"

**Symptom**: Published app shows "Cannot GET /" error

**Root Cause**: SPA routing not configured on server

**Fix**: Ensure your deployment has a catch-all route:
```nginx
# For nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Or add a `404.html` that redirects to index (GitHub Pages):
```html
<!DOCTYPE html>
<html>
<head>
<script>
  sessionStorage.redirect = location.href;
</script>
<meta http-equiv="refresh" content="0;URL='/index.html'"></meta>
</head>
</html>
```

---

## CI/CD Issues

### npm ci fails with "lock file not in sync"

**Symptom**: GitHub Actions build fails on `npm ci`

**Fix**:
```bash
# Locally
npm install
git add package.json package-lock.json
git commit -m "fix: sync package lock file"
git push
```

---

### Unsupported URL Type "workspace:"

**Symptom**: npm error about workspace protocol

**Fix**: The workspace dependencies are local packages. They should work in this repo. If deploying elsewhere:
1. Build the workspace packages first
2. Or replace workspace: references with specific versions

---

## Runtime Errors

### White screen / Loading forever

**Symptom**: App shows loading spinner but never renders

**Check**:
1. Open browser console for actual errors
2. Check Network tab for failed resource loads
3. Look for JavaScript errors

**Common Causes**:
- Failed API calls blocking render
- Circular dependencies in components
- Missing environment variables
- Incorrect base URL in production

**Fix**: Check `src/App.tsx` console logs to see where initialization stops

---

### React Hook Errors

**Symptom**: "Rendered more hooks than during previous render"

**Fix**: Make sure all hooks are:
1. Called at the top level (not in loops/conditions)
2. Called in the same order every render
3. Not conditionally called

---

## TypeScript Issues

### Types not updating after changes

**Fix**:
```bash
# Restart TS server
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# If that doesn't work
rm -rf node_modules
npm install
```

---

### JSON import type errors

**Symptom**: Can't import JSON or type errors on JSON imports

**Fix**: Use type assertion:
```typescript
import config from './config.json'
const typedConfig = config as unknown as MyConfigType
```

---

## Performance Issues

### Slow build times

**Fix**:
```bash
# Clear build cache
rm -rf dist node_modules/.cache

# Disable source maps in production
# vite.config.ts
build: {
  sourcemap: false
}
```

---

### Large bundle size

**Check**: `npm run build` and look at the bundle analysis

**Common Causes**:
- Heavy dependencies (Monaco, D3, Three.js) not code-split
- Multiple copies of React
- Unused dependencies

**Fix**:
1. Lazy load heavy components
2. Use dynamic imports: `const Component = lazy(() => import('./Component'))`
3. Remove unused dependencies

---

## Database/Storage Issues

### useKV data not persisting

**Symptom**: Data disappears on reload

**Check**:
1. Is the data being saved? Check browser DevTools → Application → IndexedDB
2. Are you using functional updates? `setValue(prev => newValue)` not `setValue(value)`

**Common Mistake**:
```typescript
// ❌ WRONG - uses stale closure
setValue([...value, newItem])

// ✅ CORRECT - uses current value
setValue(prev => [...prev, newItem])
```

---

## Preview vs Published Differences

### Works in Preview but not Published

**Common Causes**:
1. **Base path issue**: Production may use different base URL
2. **Environment variables**: Not set in production
3. **CORS**: API calls blocked in production
4. **Service worker**: Caching old version

**Fix**:
```typescript
// Use relative paths, not absolute
// ❌ src="/assets/logo.png"
// ✅ src="./assets/logo.png"

// Check environment
if (import.meta.env.PROD) {
  // Production-specific code
}
```

---

## Getting Help

### Before asking:

1. **Check the console**: Browser console + Terminal
2. **Check the docs**: This guide, ERROR_FIXES.md, README.md
3. **Search the codebase**: `grep -r "YourError"`
4. **Check git history**: `git log --grep="feature"`

### When asking:

Include:
- Full error message
- Steps to reproduce
- What you've already tried
- Relevant code snippets
- Browser/Node version

### Useful commands:

```bash
# Check all types
npm run type-check

# Build and see errors
npm run build

# Check installed packages
npm list --depth=0

# Check Node/npm version
node --version
npm --version

# Clear everything and start fresh
rm -rf node_modules dist .cache package-lock.json
npm install
npm run build
```

---

## Quick Reference

### Error Keywords → Solution

- **"@include"** → Clear build cache, SCSS already converted
- **"502"** → Fix port forwarding in Codespaces
- **"Module has already exported"** → Use prefixed molecule components
- **"lock file not in sync"** → Run `npm install` and commit
- **"Property does not exist"** → Restart TS server
- **"workspace:"** → Local package, should work in this repo
- **"Cannot GET /"** → Configure SPA routing on server
- **White screen** → Check console for actual error

---

## Still Stuck?

1. Try the nuclear option:
```bash
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

2. Check if it's a known issue in ERROR_FIXES.md

3. Look at recent commits: `git log --oneline -20`

4. Check if it works on a fresh clone:
```bash
git clone <repo> test-clone
cd test-clone
npm install
npm run dev
```
