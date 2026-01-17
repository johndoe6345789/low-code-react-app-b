import { lazy } from 'react'
import { lazyWithRetry, lazyWithPreload } from '@/lib/lazy-loader'
import { preloadMonacoEditor } from '@/components/molecules'

export const ComponentRegistry = {
  ProjectDashboard: lazyWithPreload(
    () => import('@/components/ProjectDashboard').then(m => ({ default: m.ProjectDashboard })),
    'ProjectDashboard'
  ),
  
  CodeEditor: lazyWithPreload(
    () => {
      preloadMonacoEditor()
      return import('@/components/CodeEditor').then(m => ({ default: m.CodeEditor }))
    },
    'CodeEditor'
  ),
  
  FileExplorer: lazyWithPreload(
    () => import('@/components/FileExplorer').then(m => ({ default: m.FileExplorer })),
    'FileExplorer'
  ),
  
  ModelDesigner: lazyWithPreload(
    () => import('@/components/ModelDesigner').then(m => ({ default: m.ModelDesigner })),
    'ModelDesigner'
  ),
  
  JSONModelDesigner: lazyWithPreload(
    () => import('@/components/JSONModelDesigner').then(m => ({ default: m.JSONModelDesigner })),
    'JSONModelDesigner'
  ),
  
  ComponentTreeBuilder: lazyWithPreload(
    () => import('@/components/ComponentTreeBuilder').then(m => ({ default: m.ComponentTreeBuilder })),
    'ComponentTreeBuilder'
  ),
  
  ComponentTreeManager: lazyWithPreload(
    () => import('@/components/ComponentTreeManager').then(m => ({ default: m.ComponentTreeManager })),
    'ComponentTreeManager'
  ),
  
  JSONComponentTreeManager: lazyWithPreload(
    () => import('@/components/JSONComponentTreeManager').then(m => ({ default: m.JSONComponentTreeManager })),
    'JSONComponentTreeManager'
  ),
  
  WorkflowDesigner: lazyWithPreload(
    () => {
      preloadMonacoEditor()
      return import('@/components/WorkflowDesigner').then(m => ({ default: m.WorkflowDesigner }))
    },
    'WorkflowDesigner'
  ),
  
  JSONWorkflowDesigner: lazyWithPreload(
    () => import('@/components/JSONWorkflowDesigner').then(m => ({ default: m.JSONWorkflowDesigner })),
    'JSONWorkflowDesigner'
  ),
  
  LambdaDesigner: lazyWithPreload(
    () => {
      preloadMonacoEditor()
      return import('@/components/LambdaDesigner').then(m => ({ default: m.LambdaDesigner }))
    },
    'LambdaDesigner'
  ),
  
  StyleDesigner: lazyWithPreload(
    () => import('@/components/StyleDesigner').then(m => ({ default: m.StyleDesigner })),
    'StyleDesigner'
  ),
  
  PlaywrightDesigner: lazyWithPreload(
    () => import('@/components/PlaywrightDesigner').then(m => ({ default: m.PlaywrightDesigner })),
    'PlaywrightDesigner'
  ),
  
  StorybookDesigner: lazyWithPreload(
    () => import('@/components/StorybookDesigner').then(m => ({ default: m.StorybookDesigner })),
    'StorybookDesigner'
  ),
  
  UnitTestDesigner: lazyWithPreload(
    () => import('@/components/UnitTestDesigner').then(m => ({ default: m.UnitTestDesigner })),
    'UnitTestDesigner'
  ),
  
  FlaskDesigner: lazyWithPreload(
    () => import('@/components/FlaskDesigner').then(m => ({ default: m.FlaskDesigner })),
    'FlaskDesigner'
  ),
  
  ProjectSettingsDesigner: lazyWithPreload(
    () => import('@/components/ProjectSettingsDesigner').then(m => ({ default: m.ProjectSettingsDesigner })),
    'ProjectSettingsDesigner'
  ),
  
  ErrorPanel: lazyWithPreload(
    () => import('@/components/ErrorPanel').then(m => ({ default: m.ErrorPanel })),
    'ErrorPanel'
  ),
  
  DocumentationView: lazyWithPreload(
    () => import('@/components/DocumentationView').then(m => ({ default: m.DocumentationView })),
    'DocumentationView'
  ),
  
  SassStylesShowcase: lazyWithPreload(
    () => import('@/components/SassStylesShowcase').then(m => ({ default: m.SassStylesShowcase })),
    'SassStylesShowcase'
  ),
  
  FeatureToggleSettings: lazyWithPreload(
    () => import('@/components/FeatureToggleSettings').then(m => ({ default: m.FeatureToggleSettings })),
    'FeatureToggleSettings'
  ),
  
  PWASettings: lazyWithPreload(
    () => import('@/components/PWASettings').then(m => ({ default: m.PWASettings })),
    'PWASettings'
  ),
  
  FaviconDesigner: lazyWithPreload(
    () => import('@/components/FaviconDesigner').then(m => ({ default: m.FaviconDesigner })),
    'FaviconDesigner'
  ),
  
  FeatureIdeaCloud: lazyWithPreload(
    () => import('@/components/FeatureIdeaCloud').then(m => ({ default: m.FeatureIdeaCloud })),
    'FeatureIdeaCloud'
  ),
  
  TemplateSelector: lazyWithPreload(
    () => import('@/components/TemplateSelector').then(m => ({ default: m.TemplateSelector })),
    'TemplateSelector'
  ),
  
  JSONUIShowcase: lazyWithPreload(
    () => import('@/components/JSONUIShowcasePage').then(m => ({ default: m.JSONUIShowcasePage })),
    'JSONUIShowcase'
  ),
  
  SchemaEditor: lazyWithPreload(
    () => import('@/components/SchemaEditorPage').then(m => ({ default: m.SchemaEditorPage })),
    'SchemaEditor'
  ),
  
  DataBindingDesigner: lazyWithPreload(
    () => import('@/components/DataBindingDesigner').then(m => ({ default: m.DataBindingDesigner })),
    'DataBindingDesigner'
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
  
  ComponentRegistry.ProjectDashboard.preload()
  ComponentRegistry.FileExplorer.preload()
  ComponentRegistry.CodeEditor.preload()
  
  console.log('[REGISTRY] ✅ Critical components preload initiated')
}

export function preloadComponentByName(name: keyof typeof ComponentRegistry) {
  console.log(`[REGISTRY] 🎯 Preloading component: ${name}`)
  const component = ComponentRegistry[name]
  if (component && 'preload' in component && typeof component.preload === 'function') {
    component.preload()
    console.log(`[REGISTRY] ✅ Preload initiated for: ${name}`)
  } else {
    console.warn(`[REGISTRY] ⚠️ Component ${name} does not support preloading`)
  }
}

export type ComponentName = keyof typeof ComponentRegistry
export type DialogName = keyof typeof DialogRegistry
export type PWAComponentName = keyof typeof PWARegistry
