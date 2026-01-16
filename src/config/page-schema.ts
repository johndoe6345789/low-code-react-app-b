import { z } from 'zod'

export const PropConfigSchema = z.object({
  state: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
})

export const ResizablePanelConfigSchema = z.object({
  defaultSize: z.number(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
})

export const ResizableConfigSchema = z.object({
  leftComponent: z.string(),
  leftProps: PropConfigSchema,
  leftPanel: ResizablePanelConfigSchema,
  rightPanel: ResizablePanelConfigSchema,
})

export const SimplePageConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  component: z.string(),
  enabled: z.boolean(),
  toggleKey: z.string().optional(),
  shortcut: z.string().optional(),
  order: z.number(),
  requiresResizable: z.boolean().optional(),
  props: PropConfigSchema.optional(),
  resizableConfig: ResizableConfigSchema.optional(),
})

export const SimplePagesConfigSchema = z.object({
  pages: z.array(SimplePageConfigSchema),
})

export const KeyboardShortcutSchema = z.object({
  key: z.string(),
  ctrl: z.boolean().optional(),
  shift: z.boolean().optional(),
  alt: z.boolean().optional(),
  action: z.string(),
})

export const PanelConfigSchema = z.object({
  id: z.string(),
  component: z.string(),
  props: z.record(z.string(), z.any()).optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
})

export const LayoutConfigSchema = z.object({
  type: z.enum(['single', 'split', 'grid', 'tabs'], { message: 'Invalid layout type' }),
  panels: z.array(PanelConfigSchema).optional(),
  direction: z.enum(['horizontal', 'vertical'], { message: 'Invalid direction' }).optional(),
  defaultSizes: z.array(z.number()).optional(),
})

export const FeatureConfigSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  config: z.record(z.string(), z.any()).optional(),
})

export const PageConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  component: z.string(),
  layout: LayoutConfigSchema,
  features: z.array(FeatureConfigSchema).optional(),
  permissions: z.array(z.string()).optional(),
  shortcuts: z.array(KeyboardShortcutSchema).optional(),
})

export const PageRegistrySchema = z.object({
  pages: z.array(PageConfigSchema),
})

export type PropConfig = z.infer<typeof PropConfigSchema>
export type ResizablePanelConfig = z.infer<typeof ResizablePanelConfigSchema>
export type ResizableConfig = z.infer<typeof ResizableConfigSchema>
export type SimplePageConfig = z.infer<typeof SimplePageConfigSchema>
export type SimplePagesConfig = z.infer<typeof SimplePagesConfigSchema>
export type KeyboardShortcut = z.infer<typeof KeyboardShortcutSchema>
export type PanelConfig = z.infer<typeof PanelConfigSchema>
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>
export type FeatureConfig = z.infer<typeof FeatureConfigSchema>
export type PageConfig = z.infer<typeof PageConfigSchema>
export type PageRegistry = z.infer<typeof PageRegistrySchema>
