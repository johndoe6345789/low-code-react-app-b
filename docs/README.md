# Error Fixes Summary

This directory contains documentation for various error fixes and troubleshooting guides.

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
