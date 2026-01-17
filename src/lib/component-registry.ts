import { lazy } from 'react'
import { lazyWithRetry, lazyWithPreload } from '@/lib/lazy-loader'

export const ComponentRegistry = {
  ProjectDashboard: lazyWithPreload(
    () => import('@/components/ProjectDashboard').then(m => ({ default: m.ProjectDashboard })),
    'ProjectDashboard'
  ),
  
  CodeEditor: lazyWithRetry(
    () => import('@/components/CodeEditor').then(m => ({ default: m.CodeEditor })),
    { retries: 3, timeout: 15000 }
  ),
  
  FileExplorer: lazyWithPreload(
    () => import('@/components/FileExplorer').then(m => ({ default: m.FileExplorer })),
    'FileExplorer'
  ),
  
  ModelDesigner: lazy(
    () => import('@/components/ModelDesigner').then(m => ({ default: m.ModelDesigner }))
  ),
  
  ComponentTreeBuilder: lazy(
    () => import('@/components/ComponentTreeBuilder').then(m => ({ default: m.ComponentTreeBuilder }))
  ),
  
  ComponentTreeManager: lazy(
    () => import('@/components/ComponentTreeManager').then(m => ({ default: m.ComponentTreeManager }))
  ),
  
  WorkflowDesigner: lazyWithRetry(
    () => import('@/components/WorkflowDesigner').then(m => ({ default: m.WorkflowDesigner })),
    { retries: 2, timeout: 12000 }
  ),
  
  LambdaDesigner: lazy(
    () => import('@/components/LambdaDesigner').then(m => ({ default: m.LambdaDesigner }))
  ),
  
  StyleDesigner: lazy(
    () => import('@/components/StyleDesigner').then(m => ({ default: m.StyleDesigner }))
  ),
  
  PlaywrightDesigner: lazy(
    () => import('@/components/PlaywrightDesigner').then(m => ({ default: m.PlaywrightDesigner }))
  ),
  
  StorybookDesigner: lazy(
    () => import('@/components/StorybookDesigner').then(m => ({ default: m.StorybookDesigner }))
  ),
  
  UnitTestDesigner: lazy(
    () => import('@/components/UnitTestDesigner').then(m => ({ default: m.UnitTestDesigner }))
  ),
  
  FlaskDesigner: lazy(
    () => import('@/components/FlaskDesigner').then(m => ({ default: m.FlaskDesigner }))
  ),
  
  ProjectSettingsDesigner: lazy(
    () => import('@/components/ProjectSettingsDesigner').then(m => ({ default: m.ProjectSettingsDesigner }))
  ),
  
  ErrorPanel: lazy(
    () => import('@/components/ErrorPanel').then(m => ({ default: m.ErrorPanel }))
  ),
  
  DocumentationView: lazy(
    () => import('@/components/DocumentationView').then(m => ({ default: m.DocumentationView }))
  ),
  
  SassStylesShowcase: lazy(
    () => import('@/components/SassStylesShowcase').then(m => ({ default: m.SassStylesShowcase }))
  ),
  
  FeatureToggleSettings: lazy(
    () => import('@/components/FeatureToggleSettings').then(m => ({ default: m.FeatureToggleSettings }))
  ),
  
  PWASettings: lazy(
    () => import('@/components/PWASettings').then(m => ({ default: m.PWASettings }))
  ),
  
  FaviconDesigner: lazy(
    () => import('@/components/FaviconDesigner').then(m => ({ default: m.FaviconDesigner }))
  ),
  
  FeatureIdeaCloud: lazy(
    () => import('@/components/FeatureIdeaCloud').then(m => ({ default: m.FeatureIdeaCloud }))
  ),
  
  TemplateSelector: lazy(
    () => import('@/components/TemplateSelector').then(m => ({ default: m.TemplateSelector }))
  ),
} as const

export const DialogRegistry = {
  GlobalSearch: lazy(
    () => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch }))
  ),
  
  KeyboardShortcutsDialog: lazy(
    () => import('@/components/KeyboardShortcutsDialog').then(m => ({ default: m.KeyboardShortcutsDialog }))
  ),
  
  PreviewDialog: lazy(
    () => import('@/components/PreviewDialog').then(m => ({ default: m.PreviewDialog }))
  ),
} as const

export const PWARegistry = {
  PWAInstallPrompt: lazy(
    () => import('@/components/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt }))
  ),
  
  PWAUpdatePrompt: lazy(
    () => import('@/components/PWAUpdatePrompt').then(m => ({ default: m.PWAUpdatePrompt }))
  ),
  
  PWAStatusBar: lazy(
    () => import('@/components/PWAStatusBar').then(m => ({ default: m.PWAStatusBar }))
  ),
} as const

export function preloadCriticalComponents() {
  console.log('[REGISTRY] 🚀 Preloading critical components')
  
  if ('preload' in ComponentRegistry.ProjectDashboard) {
    ComponentRegistry.ProjectDashboard.preload()
  }
  
  if ('preload' in ComponentRegistry.FileExplorer) {
    ComponentRegistry.FileExplorer.preload()
  }
  
  console.log('[REGISTRY] ✅ Critical components preload initiated')
}

export function preloadComponentByName(name: keyof typeof ComponentRegistry) {
  console.log(`[REGISTRY] 🎯 Preloading component: ${name}`)
  const component = ComponentRegistry[name]
  if (component && 'preload' in component) {
    component.preload()
  }
}

export type ComponentName = keyof typeof ComponentRegistry
export type DialogName = keyof typeof DialogRegistry
export type PWAComponentName = keyof typeof PWARegistry
