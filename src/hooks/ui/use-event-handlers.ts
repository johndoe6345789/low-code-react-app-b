import { useCallback, useMemo } from 'react'

interface UseEventHandlersOptions {
  functions?: Record<string, (...args: any[]) => any>
  onError?: (error: Error, functionName: string) => void
}

export function useEventHandlers({ functions = {}, onError }: UseEventHandlersOptions) {
  const createHandler = useCallback(
    (functionName: string) => {
      return (...args: any[]) => {
        const handler = functions[functionName]
        
        if (!handler) {
          const error = new Error(`Function "${functionName}" not found`)
          if (onError) {
            onError(error, functionName)
          } else {
            console.error(error)
          }
          return
        }

        try {
          return handler(...args)
        } catch (error) {
          if (onError) {
            onError(error as Error, functionName)
          } else {
            console.error(`Error executing function "${functionName}":`, error)
          }
        }
      }
    },
    [functions, onError]
  )

  const resolveEvents = useCallback(
    (events?: Record<string, string>): Record<string, (...args: any[]) => any> => {
      if (!events) return {}

      const resolved: Record<string, (...args: any[]) => any> = {}
      
      for (const [eventName, functionName] of Object.entries(events)) {
        resolved[eventName] = createHandler(functionName)
      }
      
      return resolved
    },
    [createHandler]
  )

  const context = useMemo(
    () => ({
      createHandler,
      resolveEvents,
      functions,
    }),
    [createHandler, resolveEvents, functions]
  )

  return context
}
