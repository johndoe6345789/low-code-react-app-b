import React, { useCallback } from 'react'
import type { EventHandler, JSONFormRendererProps, JSONUIRendererProps, UIComponent } from './types'
import { getUIComponent } from './component-registry'
import { resolveDataBinding, evaluateCondition, mergeClassNames } from './utils'
import { cn } from '@/lib/utils'

export function JSONUIRenderer({ 
  component, 
  dataMap = {}, 
  onAction, 
  context = {} 
}: JSONUIRendererProps) {
  
  if (component.conditional) {
    const conditionMet = evaluateCondition(component.conditional.if, { ...dataMap, ...context })
    if (conditionMet) {
      if (component.conditional.then) {
        return (
          <JSONUIRenderer 
            component={component.conditional.then as UIComponent} 
            dataMap={dataMap} 
            onAction={onAction}
            context={context}
          />
        )
      }
    } else {
      return component.conditional.else ? (
        <JSONUIRenderer 
          component={component.conditional.else as UIComponent} 
          dataMap={dataMap} 
          onAction={onAction}
          context={context}
        />
      ) : null
    }
  }

  const renderChildren = (
    children: UIComponent[] | string | undefined,
    renderContext: Record<string, unknown>
  ) => {
    if (!children) return null
    
    if (typeof children === 'string') {
      return children
    }
    
    return children.map((child, index) => (
      <JSONUIRenderer
        key={child.id || `child-${index}`}
        component={child}
        dataMap={dataMap}
        onAction={onAction}
        context={renderContext}
      />
    ))
  }

  if (component.loop) {
    const items = resolveDataBinding(component.loop.source, dataMap, context) || []
    const Component = getUIComponent(component.type)

    if (!Component) {
      console.warn(`Component type "${component.type}" not found in registry`)
      return null
    }

    return (
      <>
        {items.map((item: any, index: number) => {
          const loopContext = {
            ...context,
            [component.loop!.itemVar]: item,
            ...(component.loop!.indexVar ? { [component.loop!.indexVar]: index } : {}),
          }
          const props: Record<string, any> = { ...component.props }

          if (component.dataBinding) {
            const boundData = resolveDataBinding(component.dataBinding, dataMap, loopContext)
            if (boundData !== undefined) {
              props.value = boundData
              props.data = boundData
            }
          }

          if (component.events) {
            Object.entries(component.events).forEach(([eventName, handler]) => {
              props[eventName] = (event?: any) => {
                if (onAction) {
                  const eventHandler = typeof handler === 'string' 
                    ? { action: handler } as EventHandler
                    : handler as EventHandler
                  onAction(eventHandler, event)
                }
              }
            })
          }

          if (component.className) {
            props.className = cn(props.className, component.className)
          }

          if (component.style) {
            props.style = { ...props.style, ...component.style }
          }
          return (
            <React.Fragment key={`${component.id}-${index}`}>
              {typeof Component === 'string'
                ? React.createElement(Component, props, renderChildren(component.children, loopContext))
                : (
                  <Component {...props}>
                    {renderChildren(component.children, loopContext)}
                  </Component>
                )}
            </React.Fragment>
          )
        })}
      </>
    )
  }

  const Component = getUIComponent(component.type)
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found in registry`)
    return null
  }

  const props: Record<string, any> = { ...component.props }

  if (component.dataBinding) {
    const boundData = resolveDataBinding(component.dataBinding, dataMap, context)
    if (boundData !== undefined) {
      props.value = boundData
      props.data = boundData
    }
  }

  if (component.events) {
    Object.entries(component.events).forEach(([eventName, handler]) => {
      props[eventName] = (event?: any) => {
        if (onAction) {
          const eventHandler = typeof handler === 'string' 
            ? { action: handler } as EventHandler
            : handler as EventHandler
          onAction(eventHandler, event)
        }
      }
    })
  }

  if (component.className) {
    props.className = cn(props.className, component.className)
  }

  if (component.style) {
    props.style = { ...props.style, ...component.style }
  }

  if (typeof Component === 'string') {
    return React.createElement(Component, props, renderChildren(component.children, context))
  }

  return (
    <Component {...props}>
      {renderChildren(component.children, context)}
    </Component>
  )
}

export function JSONFormRenderer({ formData, fields, onSubmit, onChange }: JSONFormRendererProps) {
  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    const newData = { ...formData, [fieldName]: value }
    onChange?.(newData)
  }, [formData, onChange])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }, [formData, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const fieldComponent: UIComponent = {
          id: field.id,
          type: field.type === 'textarea' ? 'Textarea' : 'Input',
          props: {
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            type: field.type,
            value: formData[field.name] || field.defaultValue || '',
          },
          events: {
            onChange: {
              action: 'field-change',
              params: { field: field.name },
            },
          },
        }

        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}
            <JSONUIRenderer
              component={fieldComponent}
              dataMap={{}}
              onAction={(handler, event) => {
                if (handler.action === 'field-change') {
                  const targetValue = (event as { target?: { value?: unknown } } | undefined)?.target?.value
                  handleFieldChange(field.name, targetValue)
                }
              }}
            />
          </div>
        )}
      })}
    </form>
  )
}
