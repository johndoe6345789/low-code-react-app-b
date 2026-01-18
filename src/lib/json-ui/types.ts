import type { EventHandler, FormField, UIComponent as SchemaUIComponent } from './schema'
import type { UIComponent as LegacyUIComponent } from '@/types/json-ui'

export interface JSONUIRendererProps {
  component: SchemaUIComponent
  dataMap?: Record<string, unknown>
  onAction?: (handler: EventHandler, event?: unknown) => void
  context?: Record<string, unknown>
}

export interface JSONFormRendererProps {
  formData: Record<string, unknown>
  fields: FormField[]
  onSubmit: (data: Record<string, unknown>) => void
  onChange?: (data: Record<string, unknown>) => void
}

export interface ComponentRendererProps {
  component: LegacyUIComponent
  data: Record<string, unknown>
  onEvent?: (componentId: string, event: string, eventData: unknown) => void
}

export interface DataSourceConfig {
  type: 'kv' | 'api' | 'computed' | 'static'
  key?: string
  url?: string
  defaultValue?: unknown
  transform?: (data: unknown) => unknown
}
