#!/usr/bin/env tsx
/**
 * Helper script to convert a TSX component to JSON
 * Usage: npm run tsx scripts/convert-component.ts ComponentName
 */

import fs from 'fs'
import path from 'path'

const componentName = process.argv[2]

if (!componentName) {
  console.error('Usage: npm run tsx scripts/convert-component.ts ComponentName')
  process.exit(1)
}

const ROOT_DIR = path.resolve(process.cwd())

console.log(`🔄 Converting ${componentName} to JSON...`)
console.log(`
Next steps:
1. Create JSON definition: src/components/json-definitions/${componentName.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.json
2. Create interface: src/lib/json-ui/interfaces/${componentName.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.ts
3. Export interface: src/lib/json-ui/interfaces/index.ts
4. Export component: src/lib/json-ui/json-components.ts
5. Update index: src/components/atoms/index.ts or src/components/molecules/index.ts
6. Delete TSX file
`)
