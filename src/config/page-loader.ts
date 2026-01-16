import pagesConfig from './pages.json'

export interface PageConfig {
  id: string
  title: string
  icon: string
  component: string
  enabled: boolean
  toggleKey?: string
  shortcut?: string
  order: number
  requiresResizable?: boolean
}

export interface PagesConfig {
  pages: PageConfig[]
}

export function getPageConfig(): PagesConfig {
  return pagesConfig as PagesConfig
}

export function getPageById(id: string): PageConfig | undefined {
  return pagesConfig.pages.find(page => page.id === id)
}

export function getEnabledPages(featureToggles?: Record<string, boolean>): PageConfig[] {
  return pagesConfig.pages.filter(page => {
    if (!page.enabled) return false
    if (!page.toggleKey) return true
    return featureToggles?.[page.toggleKey] !== false
  }).sort((a, b) => a.order - b.order)
}

export function getPageShortcuts(featureToggles?: Record<string, boolean>): Array<{
  key: string
  ctrl?: boolean
  shift?: boolean
  description: string
  action: string
}> {
  return getEnabledPages(featureToggles)
    .filter(page => page.shortcut)
    .map(page => {
      const parts = page.shortcut!.toLowerCase().split('+')
      const ctrl = parts.includes('ctrl')
      const shift = parts.includes('shift')
      const key = parts[parts.length - 1]
      
      return {
        key,
        ctrl,
        shift,
        description: `Go to ${page.title}`,
        action: page.id
      }
    })
}
