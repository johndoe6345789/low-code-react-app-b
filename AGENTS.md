# Project Agent Guide

This repo is migrating legacy TSX components to JSON-driven components with hooks.
Use this file as the quick, local guide for automation and review.

## Conversion Workflow (TSX -> JSON)
1) Identify component under `src/components/atoms|molecules|organisms`.
2) Read TSX and decide if stateful.
3) If stateful, extract logic to `src/hooks/use-<component>.ts`.
4) Create JSON definition in `src/components/json-definitions/<component>.json`.
5) Add interface in `src/lib/json-ui/interfaces/<component>.ts`.
6) Export hook (if any) in `src/hooks/index.ts` and `src/lib/json-ui/hooks-registry.ts`.
7) Export interface in `src/lib/json-ui/interfaces/index.ts`.
8) Export JSON component in `src/lib/json-ui/json-components.ts`.
9) Update imports to `@/lib/json-ui/json-components` and delete TSX.
10) Verify with `npm run build` and `npm run audit:json`.

## CodeQL Helpers
Custom query pack: `codeql/custom-queries/`
Optimized DB (source-root `src/`): `codeql-db-optimized/`
Latest SARIF: `codeql-db-optimized/diagnostic/migration-queries.sarif`

Key queries:
- Legacy component imports and barrels
- Hooks usage in components (guides hook extraction)
- JSX presence in components
- Imports from json-definitions (should be zero)
- Migration target folder inventory

## Related Docs
- `CLAUDE.md` for migration status and CodeQL results
- `docs/reference/AGENTS.md` for agent architecture background
