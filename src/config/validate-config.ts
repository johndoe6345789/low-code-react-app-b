import pagesConfig from './pages.json'
import { PageConfig } from './page-loader'

export interface ValidationError {
  page: string
  field: string
  message: string
  severity: 'error' | 'warning'
}

export function validatePageConfig(): ValidationError[] {
  const errors: ValidationError[] = []
  const seenIds = new Set<string>()
  const seenShortcuts = new Set<string>()
  const seenOrders = new Set<number>()

  pagesConfig.pages.forEach((page: PageConfig) => {
    if (!page.id) {
      errors.push({
        page: page.title || 'Unknown',
        field: 'id',
        message: 'Page ID is required',
        severity: 'error',
      })
    } else if (seenIds.has(page.id)) {
      errors.push({
        page: page.id,
        field: 'id',
        message: `Duplicate page ID: ${page.id}`,
        severity: 'error',
      })
    } else {
      seenIds.add(page.id)
    }

    if (!page.title) {
      errors.push({
        page: page.id || 'Unknown',
        field: 'title',
        message: 'Page title is required',
        severity: 'error',
      })
    }

    if (!page.component) {
      errors.push({
        page: page.id || 'Unknown',
        field: 'component',
        message: 'Component name is required',
        severity: 'error',
      })
    }

    if (!page.icon) {
      errors.push({
        page: page.id || 'Unknown',
        field: 'icon',
        message: 'Icon is required',
        severity: 'warning',
      })
    }

    if (page.shortcut) {
      if (seenShortcuts.has(page.shortcut)) {
        errors.push({
          page: page.id || 'Unknown',
          field: 'shortcut',
          message: `Duplicate shortcut: ${page.shortcut}`,
          severity: 'warning',
        })
      } else {
        seenShortcuts.add(page.shortcut)
      }

      const validShortcutPattern = /^(ctrl\+)?(shift\+)?(alt\+)?[a-z0-9]$/i
      if (!validShortcutPattern.test(page.shortcut)) {
        errors.push({
          page: page.id || 'Unknown',
          field: 'shortcut',
          message: `Invalid shortcut format: ${page.shortcut}. Use format like "ctrl+1" or "ctrl+shift+e"`,
          severity: 'error',
        })
      }
    }

    if (page.order !== undefined) {
      if (seenOrders.has(page.order)) {
        errors.push({
          page: page.id || 'Unknown',
          field: 'order',
          message: `Duplicate order number: ${page.order}`,
          severity: 'warning',
        })
      } else {
        seenOrders.add(page.order)
      }
    }

    if (page.toggleKey) {
      const validToggleKeys = [
        'codeEditor',
        'models',
        'components',
        'componentTrees',
        'workflows',
        'lambdas',
        'styling',
        'flaskApi',
        'playwright',
        'storybook',
        'unitTests',
        'errorRepair',
        'documentation',
        'sassStyles',
        'faviconDesigner',
        'ideaCloud',
      ]
      
      if (!validToggleKeys.includes(page.toggleKey)) {
        errors.push({
          page: page.id || 'Unknown',
          field: 'toggleKey',
          message: `Unknown toggle key: ${page.toggleKey}. Must match a key in FeatureToggles type.`,
          severity: 'error',
        })
      }
    }
  })

  return errors
}

export function printValidationErrors(errors: ValidationError[]) {
  if (errors.length === 0) {
    console.log('✅ Page configuration is valid!')
    return
  }

  const errorCount = errors.filter(e => e.severity === 'error').length
  const warningCount = errors.filter(e => e.severity === 'warning').length

  console.log('\n📋 Page Configuration Validation Results\n')
  
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`)
    errors
      .filter(e => e.severity === 'error')
      .forEach(e => {
        console.log(`  • [${e.page}] ${e.field}: ${e.message}`)
      })
  }

  if (warningCount > 0) {
    console.log(`\n⚠️  Warnings: ${warningCount}`)
    errors
      .filter(e => e.severity === 'warning')
      .forEach(e => {
        console.log(`  • [${e.page}] ${e.field}: ${e.message}`)
      })
  }

  console.log('\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = validatePageConfig()
  printValidationErrors(errors)
  process.exit(errors.filter(e => e.severity === 'error').length > 0 ? 1 : 0)
}
