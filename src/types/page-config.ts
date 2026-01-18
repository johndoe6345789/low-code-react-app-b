import { PropConfig } from './prop-config'
import { ResizableConfig } from './resizable-config'

export interface PageConfig {
  id: string
  title: string
  icon: string
  component?: string
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
