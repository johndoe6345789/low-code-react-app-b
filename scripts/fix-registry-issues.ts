#!/usr/bin/env tsx
/**
 * Fix registry issues:
 * 1. Fix broken load paths
 * 2. Add missing registry entries for orphaned JSON files
 */

import fs from 'fs'
import path from 'path'

const ROOT_DIR = path.resolve(process.cwd())
const REGISTRY_FILE = path.join(ROOT_DIR, 'json-components-registry.json')

interface RegistryEntry {
  type: string
  name: string
  category?: string
  canHaveChildren?: boolean
  description?: string
  status?: string
  source?: string
  jsonCompatible?: boolean
  metadata?: any
  load?: {
    path?: string
    export?: string
  }
}

async function fixRegistry() {
  console.log('🔧 Fixing registry issues...\n')

  const content = fs.readFileSync(REGISTRY_FILE, 'utf-8')
  const registryData = JSON.parse(content)
  const registry = registryData.components as RegistryEntry[]

  let fixCount = 0

  // Components with no TSX files - remove load paths
  const componentsWithoutFiles = ['ComponentTreeManager', 'PageHeader', 'SearchInput', 'StyleDesigner']

  // Fix broken load paths
  const pathFixes: Record<string, { path: string; export: string } | null> = {
    Chart: null, // Already correct
    ComponentTreeManager: null, // No file, will remove load
    JSONUIShowcase: null, // Already correct
    PageHeader: null, // No file, will remove load
    Resizable: null, // Already correct
    Separator: null, // Already correct
    Skeleton: null, // Already correct
  }

  for (const entry of registry) {
    // Remove load paths for components without TSX files
    if (componentsWithoutFiles.includes(entry.type) && entry.load) {
      delete entry.load
      entry.jsonCompatible = true
      console.log(`✅ Removed load path for ${entry.type} (no TSX file exists)`)
      fixCount++
    }

    // Remove .tsx, .ts, .jsx, .js extensions from paths (audit script adds them)
    if (entry.load?.path) {
      const oldPath = entry.load.path
      const newPath = oldPath.replace(/\.(tsx|ts|jsx|js)$/, '')
      if (oldPath !== newPath) {
        entry.load.path = newPath
        console.log(`✅ Removed extension from ${entry.type}: ${oldPath} → ${newPath}`)
        fixCount++
      }
    }
  }

  // Add missing registry entries for orphaned JSON files
  const newEntries: RegistryEntry[] = [
    {
      type: 'single',
      name: 'SingleColumnLayout',
      category: 'layout',
      canHaveChildren: true,
      description: 'Single column layout',
      status: 'supported',
      source: 'layouts',
      jsonCompatible: true,
    },
    {
      type: 'kv',
      name: 'KVStorage',
      category: 'data',
      canHaveChildren: false,
      description: 'Key-value storage data source',
      status: 'supported',
      source: 'data-sources',
      jsonCompatible: true,
    },
    {
      type: 'create',
      name: 'CreateAction',
      category: 'action',
      canHaveChildren: false,
      description: 'Create action',
      status: 'supported',
      source: 'actions',
      jsonCompatible: true,
    },
    {
      type: 'delete',
      name: 'DeleteAction',
      category: 'action',
      canHaveChildren: false,
      description: 'Delete action',
      status: 'supported',
      source: 'actions',
      jsonCompatible: true,
    },
    {
      type: 'navigate',
      name: 'NavigateAction',
      category: 'action',
      canHaveChildren: false,
      description: 'Navigate action',
      status: 'supported',
      source: 'actions',
      jsonCompatible: true,
    },
    {
      type: 'update',
      name: 'UpdateAction',
      category: 'action',
      canHaveChildren: false,
      description: 'Update action',
      status: 'supported',
      source: 'actions',
      jsonCompatible: true,
    },
  ]

  for (const newEntry of newEntries) {
    const exists = registry.find((e) => e.type === newEntry.type)
    if (!exists) {
      registry.push(newEntry)
      console.log(`✅ Added missing registry entry for ${newEntry.type}`)
      fixCount++
    }
  }

  // Write the updated registry
  registryData.components = registry
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registryData, null, 2) + '\n')

  console.log(`\n✅ Fixed ${fixCount} registry issues`)
  console.log('📄 Updated json-components-registry.json')
}

fixRegistry().catch(console.error)
