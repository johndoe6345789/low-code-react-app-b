import pagesConfig from './pages.json'
import { FeatureToggles } from '@/types/project'

export interface PropConfig {
  state?: string[]
  actions?: string[]
}

export interface ResizableConfig {
  leftComponent: string
  leftProps: PropConfig
  leftPanel: {
    defaultSize: number
    minSize: number
    maxSize: number
  }
  rightPanel: {
    defaultSize: number
  }
}

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
  props?: PropConfig
  resizableConfig?: ResizableConfig
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

export function getEnabledPages(featureToggles?: FeatureToggles): PageConfig[] {
  return pagesConfig.pages.filter(page => {
    if (!page.enabled) return false
    if (!page.toggleKey) return true
    return featureToggles?.[page.toggleKey as keyof FeatureToggles] !== false
  }).sort((a, b) => a.order - b.order)
}

export function getPageShortcuts(featureToggles?: FeatureToggles): Array<{
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

export function resolveProps(propConfig: PropConfig | undefined, stateContext: Record<string, any>, actionContext: Record<string, any>): Record<string, any> {
  if (!propConfig) return {}
  
  const resolvedProps: Record<string, any> = {}
  
  try {
    if (propConfig.state) {
      for (const stateKey of propConfig.state) {
        try {
          const [propName, contextKey] = stateKey.includes(':') 
            ? stateKey.split(':') 
            : [stateKey, stateKey]
          
          if (stateContext[contextKey] !== undefined) {
            resolvedProps[propName] = stateContext[contextKey]
          }
        } catch (err) {
          console.warn(`Failed to resolve state prop: ${stateKey}`, err)
        }
      }
    }
    
    if (propConfig.actions) {
      for (const actionKey of propConfig.actions) {
        try {
          const [propName, contextKey] = actionKey.split(':')
          
          if (actionContext[contextKey]) {
            resolvedProps[propName] = actionContext[contextKey]
          }
        } catch (err) {
          console.warn(`Failed to resolve action prop: ${actionKey}`, err)
        }
      }
    }
  } catch (err) {
    console.error('Failed to resolve props:', err)
  }
  
  return resolvedProps
}
