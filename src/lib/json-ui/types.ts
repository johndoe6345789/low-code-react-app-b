import type { EventHandler, FormField, UIComponent } from './schema'

export type { EventHandler, FormField, UIComponent }

export interface JSONUIRendererProps {
  component: UIComponent
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
