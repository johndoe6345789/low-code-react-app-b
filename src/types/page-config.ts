import { PropConfig } from './prop-config'
import { ResizableConfig } from './resizable-config'

export interface PageConfig {
  id: string
  title: string
  icon: string
  type?: 'component' | 'json'
  component?: string
  schemaPath?: string
  schema?: string
  enabled: boolean
  isRoot?: boolean
  toggleKey?: string
  shortcut?: string
  order: number
  requiresResizable?: boolean
  props?: PropConfig
  resizableConfig?: ResizableConfig
}
