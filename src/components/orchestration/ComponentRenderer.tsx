import { ReactNode } from 'react'
import { ComponentSchema as ComponentSchemaType } from '@/types/page-schema'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

const COMPONENT_MAP: Record<string, any> = {
  Button,
  Card,
  Input,
  Badge,
  Textarea,
  div: 'div',
  span: 'span',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  p: 'p',
}

interface ComponentRendererProps {
  schema: ComponentSchemaType
  context: Record<string, any>
  onEvent?: (event: string, params?: any) => void
}

export function ComponentRenderer({ schema, context, onEvent }: ComponentRendererProps) {
  const Component = COMPONENT_MAP[schema.type]
  
  if (!Component) {
    console.warn(`Component type "${schema.type}" not found`)
    return null
  }
  
  if (schema.condition) {
    try {
      const conditionFn = new Function('context', `return ${schema.condition}`)
      if (!conditionFn(context)) {
        return null
      }
    } catch (error) {
      console.error(`Condition evaluation failed for ${schema.id}:`, error)
      return null
    }
  }
  
  const props = { ...schema.props }
  
  if (schema.bindings) {
    schema.bindings.forEach(binding => {
      const value = getNestedValue(context, binding.source)
      if (binding.transform) {
        try {
          const transformFn = new Function('value', 'context', `return ${binding.transform}`)
          props[binding.target] = transformFn(value, context)
        } catch (error) {
          console.error(`Transform failed for ${binding.target}:`, error)
          props[binding.target] = value
        }
      } else {
        props[binding.target] = value
      }
    })
  }
  
  if (schema.events) {
    schema.events.forEach(event => {
      props[event.event] = () => {
        if (onEvent) {
          onEvent(event.action, event.params)
        }
      }
    })
  }
  
  const children: ReactNode[] = []
  
  if (schema.children) {
    schema.children.forEach((child, index) => {
      children.push(
        <ComponentRenderer
          key={child.id || index}
          schema={child}
          context={context}
          onEvent={onEvent}
        />
      )
    })
  }
  
  if (typeof Component === 'string') {
    return <Component {...props}>{children}</Component>
  }
  
  return <Component {...props}>{children.length > 0 ? children : undefined}</Component>
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
