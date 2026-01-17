import { createElement, useMemo } from 'react'
import { UIComponent, Binding } from '@/types/json-ui'
import { getUIComponent } from './component-registry'

interface ComponentRendererProps {
  component: UIComponent
  data: Record<string, any>
  onEvent?: (componentId: string, event: string, eventData: any) => void
}

function resolveBinding(binding: Binding, data: Record<string, any>): any {
  let value = data[binding.source]
  
  if (binding.path) {
    const keys = binding.path.split('.')
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key]
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
  const Component = getUIComponent(component.type)
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`)
    return null
  }
  
  const props = useMemo(() => {
    const resolved: Record<string, any> = { ...component.props }
    
    if (component.bindings) {
      Object.entries(component.bindings).forEach(([propName, binding]) => {
        resolved[propName] = resolveBinding(binding, data)
      })
    }
    
    if (component.events && onEvent) {
      component.events.forEach(handler => {
        resolved[`on${handler.event.charAt(0).toUpperCase()}${handler.event.slice(1)}`] = (e: any) => {
          if (!handler.condition || handler.condition(data)) {
            onEvent(component.id, handler.event, e)
          }
        }
      })
    }
    
    return resolved
  }, [component, data, onEvent])
  
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
  
  return createElement(Component, props, children)
}
