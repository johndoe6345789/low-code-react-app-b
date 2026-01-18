import { createElement, useMemo } from 'react'
import { UIComponent, Binding, ComponentRendererProps } from '@/types/json-ui'
import { getUIComponent } from './component-registry'
import { getNestedValue } from './utils'

function resolveBinding(binding: Binding, data: Record<string, unknown>): unknown {
  const sourceValue = binding.source.includes('.')
    ? getNestedValue(data, binding.source)
    : data[binding.source]
  let value: unknown = sourceValue
  
  if (binding.path) {
    value = getNestedValue(value, binding.path)
  }
  
  if (binding.transform) {
    value = binding.transform(value)
  }
  
  return value
}

export function ComponentRenderer({ component, data, context = {}, onEvent }: ComponentRendererProps) {
  const mergedData = useMemo(() => ({ ...data, ...context }), [data, context])
  const resolvedProps = useMemo(() => {
    const resolved: Record<string, unknown> = { ...component.props }
    
    if (component.bindings) {
      Object.entries(component.bindings).forEach(([propName, binding]) => {
        resolved[propName] = resolveBinding(binding, mergedData)
      })
    }
    
    if (component.events && onEvent) {
      component.events.forEach(handler => {
        resolved[`on${handler.event.charAt(0).toUpperCase()}${handler.event.slice(1)}`] = (e: unknown) => {
          if (!handler.condition || handler.condition(mergedData as Record<string, any>)) {
            onEvent(component.id, handler.event, e)
          }
        }
      })
    }
    
    return resolved
  }, [component, mergedData, onEvent])
  
  const Component = getUIComponent(component.type)
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`)
    return null
  }
  
  if (component.condition) {
    const conditionValue = resolveBinding(component.condition, mergedData)
    if (!conditionValue) {
      return null
    }
  }
  
  const children = component.children?.map((child, index) => (
    <ComponentRenderer
      key={child.id || index}
      component={child}
      data={data}
      context={context}
      onEvent={onEvent}
    />
  ))
  
  return createElement(Component, resolvedProps, children)
}
