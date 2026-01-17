import { z } from 'zod'

export const BindingSchema = z.object({
  type: z.literal('binding'),
  expression: z.string(),
  fallback: z.any().optional(),
})

export const ComponentSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.any()).optional(),
    children: z.array(ComponentSchema).optional(),
    binding: z.string().optional(),
    condition: z.string().optional(),
    repeat: z
      .object({
        items: z.string(),
        itemVar: z.string(),
        indexVar: z.string().optional(),
      })
      .optional(),
    events: z.record(z.string()).optional(),
  })
)

export const LayoutSchema = z.object({
  type: z.enum(['flex', 'grid', 'stack', 'custom']),
  direction: z.enum(['row', 'column']).optional(),
  gap: z.string().optional(),
  columns: z
    .object({
      base: z.number().optional(),
      sm: z.number().optional(),
      md: z.number().optional(),
      lg: z.number().optional(),
      xl: z.number().optional(),
    })
    .optional(),
  className: z.string().optional(),
})

export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  layout: LayoutSchema,
  components: z.array(ComponentSchema),
  dataBindings: z.array(z.string()).optional(),
  functions: z.record(z.string()).optional(),
})

export type Binding = z.infer<typeof BindingSchema>
export type Component = z.infer<typeof ComponentSchema>
export type Layout = z.infer<typeof LayoutSchema>
export type PageSchemaType = z.infer<typeof PageSchema>
