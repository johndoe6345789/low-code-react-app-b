#!/usr/bin/env node

/**
 * JSON Components List Script
 * 
 * Lists all components that can be rendered from JSON using the JSON UI system.
 * 
 * Usage:
 *   node scripts/list-json-components.js [--format=table|json]
 */

const fs = require('fs')
const path = require('path')

// Read the component definitions
const componentDefsPath = path.join(process.cwd(), 'src', 'lib', 'component-definitions.ts')

if (!fs.existsSync(componentDefsPath)) {
  console.error('❌ Could not find src/lib/component-definitions.ts')
  process.exit(1)
}

// Read the types file to get the ComponentType union
const typesPath = path.join(process.cwd(), 'src', 'types', 'json-ui.ts')

if (!fs.existsSync(typesPath)) {
  console.error('❌ Could not find src/types/json-ui.ts')
  process.exit(1)
}

// Parse the component definitions from the TypeScript file
const componentDefsContent = fs.readFileSync(componentDefsPath, 'utf8')

// Extract the component definitions array using regex
const arrayMatch = componentDefsContent.match(/export const componentDefinitions: ComponentDefinition\[\] = (\[[\s\S]*?\n\])/m)

if (!arrayMatch) {
  console.error('❌ Could not parse componentDefinitions from file')
  process.exit(1)
}

// Convert the TypeScript array to JSON by replacing single quotes with double quotes
// and removing trailing commas
let arrayStr = arrayMatch[1]
  .replace(/'/g, '"')
  .replace(/,(\s*[}\]])/g, '$1')

// Parse as JSON
let componentDefinitions
try {
  componentDefinitions = JSON.parse(arrayStr)
} catch (e) {
  console.error('❌ Failed to parse component definitions:', e.message)
  process.exit(1)
}

// Parse the ComponentType union from types file
const typesContent = fs.readFileSync(typesPath, 'utf8')
const typeMatch = typesContent.match(/export type ComponentType = \n([\s\S]*?)\n\n/)

let componentTypes = []
if (typeMatch) {
  const typeLines = typeMatch[1].split('\n')
  componentTypes = typeLines
    .map(line => line.trim())
    .filter(line => line.startsWith('|'))
    .map(line => line.replace(/^\|\s*/, '').replace(/['"\s]/g, ''))
    .filter(t => t.length > 0)
}

const format = process.argv.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'table'

// Build the output data
const componentsList = componentDefinitions.map(comp => ({
  type: comp.type,
  label: comp.label,
  category: comp.category,
  icon: comp.icon,
  canHaveChildren: comp.canHaveChildren || false,
  hasDefaultProps: !!comp.defaultProps
}))

if (format === 'json') {
  console.log(JSON.stringify(componentsList, null, 2))
  process.exit(0)
}

// Table format output
console.log('\n🧩 JSON-Compatible Components\n')
console.log('═══════════════════════════════════════════════════════════════════════════\n')
console.log('These components can be rendered from JSON schemas using the JSON UI system.\n')

// Group by category
const categories = ['layout', 'input', 'display', 'custom']
const categoryIcons = {
  layout: '📐',
  input: '⌨️ ',
  display: '🎨',
  custom: '⚡'
}

categories.forEach(category => {
  const categoryComps = componentsList.filter(c => c.category === category)
  
  if (categoryComps.length === 0) return
  
  console.log(`\n${categoryIcons[category]} ${category.toUpperCase()}\n`)
  console.log('───────────────────────────────────────────────────────────────────────────')
  
  categoryComps.forEach(comp => {
    const children = comp.canHaveChildren ? '👶 Can have children' : '➖ No children'
    const defaults = comp.hasDefaultProps ? '✓' : '✗'
    
    console.log(`  • ${comp.label} (${comp.type})`)
    console.log(`    Icon: ${comp.icon}`)
    console.log(`    ${children}`)
    console.log(`    Default Props: ${defaults}`)
    console.log('')
  })
})

console.log('═══════════════════════════════════════════════════════════════════════════')
console.log(`\nTotal Components: ${componentsList.length}`)
console.log(`By Category:`)
categories.forEach(cat => {
  const count = componentsList.filter(c => c.category === cat).length
  if (count > 0) {
    console.log(`  ${cat}: ${count}`)
  }
})

console.log(`\nComponents with children support: ${componentsList.filter(c => c.canHaveChildren).length}`)
console.log(`Components with default props: ${componentsList.filter(c => c.hasDefaultProps).length}`)

console.log('\n💡 Tips:')
console.log('  • These components are defined in src/lib/component-definitions.ts')
console.log('  • Component types are listed in src/types/json-ui.ts')
console.log('  • Component registry is in src/lib/json-ui/component-registry.tsx')
console.log('  • Run with --format=json for JSON output')
console.log('')

// List all available ComponentTypes
console.log('\n📝 Available ComponentTypes:\n')
console.log('───────────────────────────────────────────────────────────────────────────')
componentTypes.forEach(type => {
  const isDefined = componentsList.some(c => c.type === type)
  const status = isDefined ? '✓' : '⚠️ '
  console.log(`  ${status} ${type}`)
})
console.log('')
