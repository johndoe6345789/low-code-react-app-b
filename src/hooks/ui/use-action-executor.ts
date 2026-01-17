import { useCallback } from 'react'
import { toast } from 'sonner'
import { Action, JSONUIContext } from '@/types/json-ui'

export function useActionExecutor(context: JSONUIContext) {
  const { data, updateData, executeAction: contextExecute } = context

  const executeAction = useCallback(async (action: Action, event?: any) => {
    try {
      switch (action.type) {
        case 'create': {
          if (!action.target) return
          const currentData = data[action.target] || []
          const newValue = action.compute ? action.compute(data, event) : action.value
          updateData(action.target, [...currentData, newValue])
          break
        }

        case 'update': {
          if (!action.target) return
          const newValue = action.compute ? action.compute(data, event) : action.value
          updateData(action.target, newValue)
          break
        }

        case 'delete': {
          if (!action.target || !action.value) return
          const currentData = data[action.target] || []
          const filtered = currentData.filter((item: any) => {
            if (action.path) {
              return item[action.path] !== action.value
            }
            return item !== action.value
          })
          updateData(action.target, filtered)
          break
        }

        case 'set-value': {
          if (!action.target) return
          const newValue = action.compute ? action.compute(data, event) : action.value
          updateData(action.target, newValue)
          break
        }

        case 'toggle-value': {
          if (!action.target) return
          const currentValue = data[action.target]
          updateData(action.target, !currentValue)
          break
        }

        case 'increment': {
          if (!action.target) return
          const currentValue = data[action.target] || 0
          const amount = action.value || 1
          updateData(action.target, currentValue + amount)
          break
        }

        case 'decrement': {
          if (!action.target) return
          const currentValue = data[action.target] || 0
          const amount = action.value || 1
          updateData(action.target, currentValue - amount)
          break
        }

        case 'show-toast': {
          const message = action.message || 'Action completed'
          const variant = action.variant || 'success'
          
          switch (variant) {
            case 'success':
              toast.success(message)
              break
            case 'error':
              toast.error(message)
              break
            case 'info':
              toast.info(message)
              break
            case 'warning':
              toast.warning(message)
              break
          }
          break
        }

        case 'navigate': {
          if (action.path) {
            window.location.hash = action.path
          }
          break
        }

        case 'custom': {
          if (contextExecute) {
            await contextExecute(action, event)
          }
          break
        }
      }
    } catch (error) {
      console.error('Action execution failed:', error)
      toast.error('Action failed')
    }
  }, [data, updateData, contextExecute])

  const executeActions = useCallback(async (actions: Action[], event?: any) => {
    for (const action of actions) {
      await executeAction(action, event)
    }
  }, [executeAction])

  return {
    executeAction,
    executeActions,
  }
}
