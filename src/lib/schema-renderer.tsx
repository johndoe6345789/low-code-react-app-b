import { createElement, type ComponentType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Component as ComponentSchema, Layout } from '@/schemas/ui-schema'
import { useDataBinding, useEventHandlers, useComponentRegistry } from '@/hooks/ui'

interface SchemaRendererProps {
  schema: ComponentSchema
  data: Record<string, any>
  functions?: Record<string, (...args: any[]) => any>
  componentRegistry?: Record<string, ComponentType<any>>
}

interface LayoutRendererProps {
  layout: Layout
  children: ReactNode
}

function LayoutRenderer({ layout, children }: LayoutRendererProps) {
  const getLayoutClasses = () => {
    const classes: string[] = []
    
    if (layout.type === 'flex') {
      classes.push('flex')
      if (layout.direction) {
        classes.push(layout.direction === 'column' ? 'flex-col' : 'flex-row')
      }
    } else if (layout.type === 'grid') {
      classes.push('grid')
      if (layout.columns) {
        const { base = 1, sm, md, lg, xl } = layout.columns
        classes.push(`grid-cols-${base}`)
        if (sm) classes.push(`sm:grid-cols-${sm}`)
        if (md) classes.push(`md:grid-cols-${md}`)
        if (lg) classes.push(`lg:grid-cols-${lg}`)
        if (xl) classes.push(`xl:grid-cols-${xl}`)
      }
    } else if (layout.type === 'stack') {
      classes.push('flex flex-col')
    }
    
    if (layout.gap) {
      classes.push(`gap-${layout.gap}`)
    }
    
    if (layout.className) {
      classes.push(layout.className)
    }
    
    return cn(...classes)
  }

  return <div className={getLayoutClasses()}>{children}</div>
}

export function SchemaRenderer({ schema, data, functions = {}, componentRegistry }: SchemaRendererProps) {
  const { resolveCondition, resolveProps, resolveBinding } = useDataBinding({ data })
  const { resolveEvents } = useEventHandlers({ functions })
  const { getComponent, getIcon } = useComponentRegistry({ customComponents: componentRegistry })

  if (schema.condition && !resolveCondition(schema.condition)) {
    return null
  }

  if (schema.repeat) {
    const items = resolveBinding(schema.repeat.items, []) as any[]
    return (
      <>
        {items.map((item, index) => {
          const itemData = {
            ...data,
            [schema.repeat!.itemVar]: item,
            ...(schema.repeat!.indexVar ? { [schema.repeat!.indexVar]: index } : {}),
          }
          return (
            <SchemaRenderer
              key={index}
              schema={{ ...schema, repeat: undefined }}
              data={itemData}
              functions={functions}
              componentRegistry={componentRegistry}
            />
          )
        })}
      </>
    )
  }

  const props = resolveProps(schema.props || {})
  const events = resolveEvents(schema.events)
  const combinedProps = { ...props, ...events }

  if (schema.binding) {
    const iconName = resolveBinding(schema.binding)
    if (typeof iconName === 'string' && schema.type === 'Icon') {
      const IconComponent = getComponent(iconName)
      if (IconComponent) {
        return createElement(IconComponent, combinedProps)
      }
      return getIcon(iconName, combinedProps)
    }
  }

  const Component = getComponent(schema.type)
  
  if (!Component) {
    console.warn(`Component type "${schema.type}" not found in registry`)
    return (
      <div className="border-2 border-dashed border-destructive p-4 rounded-md">
        <p className="text-destructive font-mono text-sm">
          Unknown component: {schema.type}
        </p>
      </div>
    )
  }

  const children = schema.children?.map((child, index) => (
    <SchemaRenderer
      key={child.id || index}
      schema={child}
      data={data}
      functions={functions}
      componentRegistry={componentRegistry}
    />
  ))

  return <Component {...combinedProps}>{children}</Component>
}

interface PageRendererProps {
  schema: {
    id: string
    title?: string
    description?: string
    layout: Layout
    components: ComponentSchema[]
  }
  data: Record<string, any>
  functions?: Record<string, (...args: any[]) => any>
  componentRegistry?: Record<string, ComponentType<any>>
}

export function PageRenderer({ schema, data, functions = {}, componentRegistry }: PageRendererProps) {
  return (
    <LayoutRenderer layout={schema.layout}>
      {schema.components.map((component) => (
        <SchemaRenderer
          key={component.id}
          schema={component}
          data={data}
          functions={functions}
          componentRegistry={componentRegistry}
        />
      ))}
    </LayoutRenderer>
  )
}
