import { lazy } from 'react'
import { lazyWithRetry, lazyWithPreload } from '@/lib/lazy-loader'
import { preloadMonacoEditor } from '@/components/molecules'
import componentRegistryConfig from '../../component-registry.json'

type ComponentConfig = {
  name: string
  path: string
  export: string
  type: string
  preload?: boolean
  preloadPriority?: 'high' | 'medium' | 'low'
  category?: string
  dependencies?: string[]
  preloadDependencies?: string[]
  experimental?: boolean
  description?: string
}

type RegistryConfig = {
  version: string
  components: ComponentConfig[]
  dialogs: ComponentConfig[]
  pwa: ComponentConfig[]
  preloadStrategy: {
    critical: string[]
    onDemand: string
    preloadDelay: number
  }
}

const config = componentRegistryConfig as RegistryConfig

const dependencyPreloaders: Record<string, () => void> = {
  preloadMonacoEditor
}

function createLazyComponent(componentConfig: ComponentConfig) {
  const loader = () => {
    if (componentConfig.preloadDependencies) {
      componentConfig.preloadDependencies.forEach(depName => {
        const preloader = dependencyPreloaders[depName]
        if (preloader) {
          preloader()
        }
      })
    }
    
    return import(componentConfig.path).then(m => ({ default: m[componentConfig.export] }))
  }

  if (componentConfig.type === 'dialog' || componentConfig.type === 'pwa') {
    return lazy(loader)
  }

  return lazyWithPreload(loader, componentConfig.name)
}

function buildRegistry(components: ComponentConfig[]) {
  return components.reduce((registry, component) => {
    registry[component.name] = createLazyComponent(component)
    return registry
  }, {} as Record<string, any>)
}

export const ComponentRegistry = buildRegistry(config.components) as Record<string, ReturnType<typeof lazyWithPreload>>
export const DialogRegistry = buildRegistry(config.dialogs) as Record<string, ReturnType<typeof lazy>>
export const PWARegistry = buildRegistry(config.pwa) as Record<string, ReturnType<typeof lazy>>

export function preloadCriticalComponents() {
  console.log('[REGISTRY] 🚀 Preloading critical components')
  
  const criticalComponents = config.preloadStrategy.critical
  
  criticalComponents.forEach(componentName => {
    const component = ComponentRegistry[componentName]
    if (component && 'preload' in component && typeof component.preload === 'function') {
      component.preload()
    }
  })
  
  console.log('[REGISTRY] ✅ Critical components preload initiated')
}

export function preloadComponentByName(name: string) {
  console.log(`[REGISTRY] 🎯 Preloading component: ${name}`)
  const component = ComponentRegistry[name]
  if (component && 'preload' in component && typeof component.preload === 'function') {
    component.preload()
    console.log(`[REGISTRY] ✅ Preload initiated for: ${name}`)
  } else {
    console.warn(`[REGISTRY] ⚠️ Component ${name} does not support preloading`)
  }
}

export function getComponentMetadata(name: string): ComponentConfig | undefined {
  return [...config.components, ...config.dialogs, ...config.pwa].find(c => c.name === name)
}

export function getComponentsByCategory(category: string): ComponentConfig[] {
  return config.components.filter(c => c.category === category)
}

export function getAllCategories(): string[] {
  const categories = new Set(config.components.map(c => c.category).filter(Boolean))
  return Array.from(categories) as string[]
}

export type ComponentName = keyof typeof ComponentRegistry
export type DialogName = keyof typeof DialogRegistry
export type PWAComponentName = keyof typeof PWARegistry
