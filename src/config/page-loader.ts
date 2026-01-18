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
  type?: 'component' | 'json'
  component?: string
  schemaPath?: string
  enabled: boolean
  isRoot?: boolean
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
  console.log('[CONFIG] 📄 getPageConfig called')
  const config = pagesConfig as PagesConfig
  console.log('[CONFIG] ✅ Pages config loaded:', config.pages.length, 'pages')
  return config
}

export function getPageById(id: string): PageConfig | undefined {
  console.log('[CONFIG] 🔍 getPageById called for:', id)
  const page = pagesConfig.pages.find(page => page.id === id)
  console.log('[CONFIG]', page ? '✅ Page found' : '❌ Page not found')
  return page
}

export function getEnabledPages(featureToggles?: FeatureToggles): PageConfig[] {
  console.log('[CONFIG] 🔍 getEnabledPages called with toggles:', featureToggles)
  const enabled = pagesConfig.pages.filter(page => {
    if (!page.enabled) {
      console.log('[CONFIG] ⏭️ Skipping disabled page:', page.id)
      return false
    }
    if (!page.toggleKey) return true
    return featureToggles?.[page.toggleKey as keyof FeatureToggles] !== false
  }).sort((a, b) => a.order - b.order)
  console.log('[CONFIG] ✅ Enabled pages:', enabled.map(p => p.id).join(', '))
  return enabled
}

export function getPageShortcuts(featureToggles?: FeatureToggles): Array<{
  key: string
  ctrl?: boolean
  shift?: boolean
  description: string
  action: string
}> {
  console.log('[CONFIG] ⌨️ getPageShortcuts called')
  const shortcuts = getEnabledPages(featureToggles)
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
  console.log('[CONFIG] ✅ Shortcuts configured:', shortcuts.length)
  return shortcuts
}

export function resolveProps(propConfig: PropConfig | undefined, stateContext: Record<string, any>, actionContext: Record<string, any>): Record<string, any> {
  console.log('[CONFIG] 🔧 resolveProps called')
  if (!propConfig) {
    console.log('[CONFIG] ⏭️ No prop config provided')
    return {}
  }
  
  const resolvedProps: Record<string, any> = {}
  
  try {
    if (propConfig.state) {
      console.log('[CONFIG] 📦 Resolving', propConfig.state.length, 'state props')
      for (const stateKey of propConfig.state) {
        try {
          const [propName, contextKey] = stateKey.includes(':') 
            ? stateKey.split(':') 
            : [stateKey, stateKey]
          
          if (stateContext[contextKey] !== undefined) {
            resolvedProps[propName] = stateContext[contextKey]
            console.log('[CONFIG] ✅ Resolved state prop:', propName)
          } else {
            console.log('[CONFIG] ⚠️ State prop not found:', contextKey)
          }
        } catch (err) {
          console.warn('[CONFIG] ❌ Failed to resolve state prop:', stateKey, err)
        }
      }
    }
    
    if (propConfig.actions) {
      console.log('[CONFIG] 🎬 Resolving', propConfig.actions.length, 'action props')
      for (const actionKey of propConfig.actions) {
        try {
          const [propName, contextKey] = actionKey.split(':')
          
          if (actionContext[contextKey]) {
            resolvedProps[propName] = actionContext[contextKey]
            console.log('[CONFIG] ✅ Resolved action prop:', propName)
          } else {
            console.log('[CONFIG] ⚠️ Action prop not found:', contextKey)
          }
        } catch (err) {
          console.warn('[CONFIG] ❌ Failed to resolve action prop:', actionKey, err)
        }
      }
    }
  } catch (err) {
    console.error('[CONFIG] ❌ Failed to resolve props:', err)
  }
  
  console.log('[CONFIG] ✅ Props resolved:', Object.keys(resolvedProps).length, 'props')
  return resolvedProps
}
