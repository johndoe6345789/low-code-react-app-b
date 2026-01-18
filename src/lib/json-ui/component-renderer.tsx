import { createElement, useMemo } from 'react'
import { UIComponent, Binding, ComponentRendererProps } from '@/types/json-ui'
import { getUIComponent } from './component-registry'

function resolveBinding(binding: Binding, data: Record<string, unknown>): unknown {
  let value: unknown = data[binding.source]
  
  if (binding.path) {
    const keys = binding.path.split('.')
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[key]
      } else {
        value = undefined
        break
      }
    }
  }
  
  if (binding.transform) {
    value = binding.transform(value)
  }
  
  return value
}

export function ComponentRenderer({ component, data, onEvent }: ComponentRendererProps) {
  const resolvedProps = useMemo(() => {
    const resolved: Record<string, unknown> = { ...component.props }
    
    if (component.bindings) {
      Object.entries(component.bindings).forEach(([propName, binding]) => {
        resolved[propName] = resolveBinding(binding, data)
      })
    }
    
    if (component.events && onEvent) {
      component.events.forEach(handler => {
        const eventName = handler.event
        const propName = eventName.startsWith('on')
          ? eventName
          : `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
        resolved[propName] = (e: unknown) => {
          if (!handler.condition || handler.condition(data)) {
            onEvent(component.id, handler, e)
          }
        }
      })
    }
    
    return resolved
  }, [component, data, onEvent])
  
  const Component = getUIComponent(component.type)
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`)
    return null
  }
  
  if (component.condition) {
    const conditionValue = resolveBinding(component.condition, data)
    if (!conditionValue) {
      return null
    }
  }
  
  const children = component.children?.map((child, index) => (
    <ComponentRenderer
      key={child.id || index}
      component={child}
      data={data}
      onEvent={onEvent}
    />
  ))
  
  return createElement(Component, resolvedProps, children)
}
