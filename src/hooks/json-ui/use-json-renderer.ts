import { useMemo } from 'react'
import { ComponentSchema } from '@/types/json-ui'

export function useJSONRenderer() {
  const resolveBinding = useMemo(() => {
    return (binding: string, data: Record<string, any>): any => {
      if (!binding) return undefined
      
      try {
        const func = new Function(...Object.keys(data), `return ${binding}`)
        return func(...Object.values(data))
      } catch {
        return binding
      }
    }
  }, [])

  const resolveValue = useMemo(() => {
    return (value: any, data: Record<string, any>): any => {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const binding = value.slice(2, -2).trim()
        return resolveBinding(binding, data)
      }
      return value
    }
  }, [resolveBinding])

  const resolveProps = useMemo(() => {
    return (props: Record<string, any>, data: Record<string, any>): Record<string, any> => {
      const resolved: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(props)) {
        resolved[key] = resolveValue(value, data)
      }
      
      return resolved
    }
  }, [resolveValue])

  return {
    resolveBinding,
    resolveValue,
    resolveProps,
  }
}
