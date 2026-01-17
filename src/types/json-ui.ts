import { ReactNode } from 'react'

export type ComponentType = 
  | 'div' | 'section' | 'article' | 'header' | 'footer' | 'main'
  | 'Button' | 'Card' | 'CardHeader' | 'CardTitle' | 'CardDescription' | 'CardContent' | 'CardFooter'
  | 'Input' | 'Select' | 'Checkbox' | 'Switch'
  | 'Badge' | 'Progress' | 'Separator' | 'Tabs' | 'Dialog'
  | 'Text' | 'Heading' | 'Label' | 'List' | 'Grid'
  | 'StatusBadge' | 'DataCard' | 'SearchInput' | 'ActionBar'

export type ActionType =
  | 'create' | 'update' | 'delete' | 'navigate'
  | 'show-toast' | 'open-dialog' | 'close-dialog'
  | 'set-value' | 'toggle-value' | 'increment' | 'decrement'
  | 'custom'

export type DataSourceType =
  | 'kv' | 'computed' | 'static'

export interface DataSource {
  id: string
  type: DataSourceType
  key?: string
  defaultValue?: any
  compute?: (data: Record<string, any>) => any
  dependencies?: string[]
}

export interface Action {
  id: string
  type: ActionType
  target?: string
  path?: string
  value?: any
  compute?: (data: Record<string, any>, event?: any) => any
  message?: string
  variant?: 'success' | 'error' | 'info' | 'warning'
}

export interface Binding {
  source: string
  path?: string
  transform?: (value: any) => any
}

export interface EventHandler {
  event: string
  actions: Action[]
  condition?: (data: Record<string, any>) => boolean
}

export interface UIComponent {
  id: string
  type: ComponentType
  props?: Record<string, any>
  bindings?: Record<string, Binding>
  events?: EventHandler[]
  children?: UIComponent[]
  condition?: Binding
}

export interface Layout {
  type: 'single' | 'split' | 'tabs' | 'grid'
  areas?: LayoutArea[]
  columns?: number
  gap?: number
}

export interface LayoutArea {
  id: string
  component: UIComponent
  size?: number
}

export interface PageSchema {
  id: string
  name: string
  layout: Layout
  dataSources: DataSource[]
  components: UIComponent[]
  globalActions?: Action[]
}

export interface JSONUIContext {
  data: Record<string, any>
  updateData: (sourceId: string, value: any) => void
  executeAction: (action: Action, event?: any) => Promise<void>
}

export type ComponentSchema = UIComponent
