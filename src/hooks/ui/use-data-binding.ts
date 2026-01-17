import { useCallback, useMemo } from 'react'

interface UseDataBindingOptions {
  data: Record<string, any>
  onError?: (error: Error, expression: string) => void
}

export function useDataBinding({ data, onError }: UseDataBindingOptions) {
  const resolveBinding = useCallback(
    (expression: string, fallback?: any): any => {
      if (!expression) return fallback

      try {
        const keys = Object.keys(data)
        const values = Object.values(data)
        const func = new Function(...keys, `"use strict"; return (${expression})`)
        return func(...values)
      } catch (error) {
        if (onError) {
          onError(error as Error, expression)
        }
        console.warn(`Failed to resolve binding: ${expression}`, error)
        return fallback
      }
    },
    [data, onError]
  )

  const resolveCondition = useCallback(
    (condition: string): boolean => {
      try {
        const result = resolveBinding(condition, false)
        return Boolean(result)
      } catch {
        return false
      }
    },
    [resolveBinding]
  )

  const resolveProps = useCallback(
    (props: Record<string, any>): Record<string, any> => {
      if (!props) return {}

      const resolved: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          const expression = value.slice(2, -2).trim()
          resolved[key] = resolveBinding(expression)
        } else if (typeof value === 'object' && value !== null && value.type === 'binding') {
          resolved[key] = resolveBinding(value.expression, value.fallback)
        } else {
          resolved[key] = value
        }
      }
      
      return resolved
    },
    [resolveBinding]
  )

  const context = useMemo(
    () => ({
      resolveBinding,
      resolveCondition,
      resolveProps,
      data,
    }),
    [resolveBinding, resolveCondition, resolveProps, data]
  )

  return context
}
