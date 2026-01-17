#!/usr/bin/env node

/**
 * JSON Components List Script
 * 
 * Lists all components that can be rendered from JSON using the JSON UI system.
 * 
 * Usage:
 *   node scripts/list-json-components.cjs [--format=table|json] [--status=all|supported|planned]
 */

const fs = require('fs')
const path = require('path')

// Read the JSON components registry
const registryPath = path.join(process.cwd(), 'json-components-registry.json')

if (!fs.existsSync(registryPath)) {
  console.error('❌ Could not find json-components-registry.json')
  process.exit(1)
}

let registry
try {
  registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'))
} catch (e) {
  console.error('❌ Failed to parse json-components-registry.json:', e.message)
  process.exit(1)
}

const format = process.argv.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'table'
const statusFilter = process.argv.find(arg => arg.startsWith('--status='))?.split('=')[1] || 'all'

// Filter components by status if requested
let componentsList = registry.components
if (statusFilter !== 'all') {
  componentsList = componentsList.filter(c => c.status === statusFilter)
}

if (format === 'json') {
  console.log(JSON.stringify(componentsList, null, 2))
  process.exit(0)
}

// Table format output
console.log('\n🧩 JSON-Compatible Components\n')
console.log('═══════════════════════════════════════════════════════════════════════════\n')
console.log(`These components can be rendered from JSON schemas using the JSON UI system.`)
if (statusFilter !== 'all') {
  console.log(`\nFiltered by status: ${statusFilter}`)
}
console.log()

// Group by category
const categories = ['layout', 'input', 'display', 'navigation', 'feedback', 'data', 'custom']
const categoryIcons = {
  layout: '📐',
  input: '⌨️ ',
  display: '🎨',
  navigation: '🧭',
  feedback: '💬',
  data: '📊',
  custom: '⚡'
}

categories.forEach(category => {
  const categoryComps = componentsList.filter(c => c.category === category)
  
  if (categoryComps.length === 0) return
  
  console.log(`\n${categoryIcons[category]} ${category.toUpperCase()}\n`)
  console.log('───────────────────────────────────────────────────────────────────────────')
  
  categoryComps.forEach(comp => {
    const children = comp.canHaveChildren ? '👶 Can have children' : '➖ No children'
    const statusIcon = comp.status === 'supported' ? '✅' : '📋'
    const subComps = comp.subComponents ? ` (includes: ${comp.subComponents.join(', ')})` : ''
    
    console.log(`  ${statusIcon} ${comp.name} (${comp.type})`)
    console.log(`    ${comp.description}`)
    console.log(`    ${children}`)
    if (comp.subComponents) {
      console.log(`    Sub-components: ${comp.subComponents.join(', ')}`)
    }
    console.log('')
  })
})

console.log('═══════════════════════════════════════════════════════════════════════════')
console.log(`\nTotal Components: ${componentsList.length}`)

if (statusFilter === 'all') {
  const supported = componentsList.filter(c => c.status === 'supported').length
  const planned = componentsList.filter(c => c.status === 'planned').length
  console.log(`\nBy Status:`)
  console.log(`  ✅ Supported: ${supported}`)
  console.log(`  📋 Planned: ${planned}`)
}

console.log(`\nBy Category:`)
categories.forEach(cat => {
  const count = componentsList.filter(c => c.category === cat).length
  if (count > 0) {
    console.log(`  ${categoryIcons[cat]} ${cat}: ${count}`)
  }
})

console.log(`\nComponents with children support: ${componentsList.filter(c => c.canHaveChildren).length}`)

console.log('\n💡 Tips:')
console.log('  • Full registry in json-components-registry.json')
console.log('  • Component types defined in src/types/json-ui.ts')
console.log('  • Component registry in src/lib/json-ui/component-registry.tsx')
console.log('  • Component definitions in src/lib/component-definitions.ts')
console.log('  • Run with --format=json for JSON output')
console.log('  • Run with --status=supported to see only supported components')
console.log('  • Run with --status=planned to see only planned components')
console.log('')
