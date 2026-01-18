import { useCallback } from 'react'
import { toast } from 'sonner'
import { Action, JSONUIContext } from '@/types/json-ui'
import { evaluateExpression, evaluateTemplate } from '@/lib/json-ui/expression-evaluator'

export function useActionExecutor(context: JSONUIContext) {
  const { data, updateData, updatePath, executeAction: contextExecute } = context

  const executeAction = useCallback(async (action: Action, event?: any) => {
    try {
      const evaluationContext = { data, event }
      const updateByPath = (sourceId: string, path: string, value: any) => {
        if (updatePath) {
          updatePath(sourceId, path, value)
          return
        }

        const sourceData = data[sourceId] ?? {}
        const pathParts = path.split('.')
        const newData = { ...sourceData }
        let current: any = newData

        for (let i = 0; i < pathParts.length - 1; i++) {
          const key = pathParts[i]
          current[key] = typeof current[key] === 'object' && current[key] !== null ? { ...current[key] } : {}
          current = current[key]
        }

        current[pathParts[pathParts.length - 1]] = value
        updateData(sourceId, newData)
      }

      const resolveDialogTarget = () => {
        const defaultSourceId = 'uiState'
        const hasExplicitTarget = Boolean(action.target && action.path)
        const sourceId = hasExplicitTarget ? action.target : defaultSourceId
        const dialogId = action.path ?? action.target

        if (!dialogId) return null

        const dialogPath = dialogId.startsWith('dialogs.') ? dialogId : `dialogs.${dialogId}`
        return { sourceId, dialogPath }
      }

      switch (action.type) {
        case 'create': {
          if (!action.target) return
          const currentData = data[action.target] || []
          
          let newValue
          if (action.compute) {
            // Legacy: compute function
            newValue = action.compute(data, event)
          } else if (action.expression) {
            // New: JSON expression
            newValue = evaluateExpression(action.expression, evaluationContext)
          } else if (action.valueTemplate) {
            // New: JSON template with dynamic values
            newValue = evaluateTemplate(action.valueTemplate, evaluationContext)
          } else {
            // Fallback: static value
            newValue = action.value
          }
          
          updateData(action.target, [...currentData, newValue])
          break
        }

        case 'update': {
          if (!action.target) return
          
          let newValue
          if (action.compute) {
            newValue = action.compute(data, event)
          } else if (action.expression) {
            newValue = evaluateExpression(action.expression, evaluationContext)
          } else if (action.valueTemplate) {
            newValue = evaluateTemplate(action.valueTemplate, evaluationContext)
          } else {
            newValue = action.value
          }
          
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
          
          let newValue
          if (action.compute) {
            newValue = action.compute(data, event)
          } else if (action.expression) {
            newValue = evaluateExpression(action.expression, evaluationContext)
          } else if (action.valueTemplate) {
            newValue = evaluateTemplate(action.valueTemplate, evaluationContext)
          } else {
            newValue = action.value
          }
          
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

        case 'open-dialog': {
          const dialogTarget = resolveDialogTarget()
          if (!dialogTarget) return
          updateByPath(dialogTarget.sourceId, dialogTarget.dialogPath, true)
          break
        }

        case 'close-dialog': {
          const dialogTarget = resolveDialogTarget()
          if (!dialogTarget) return
          updateByPath(dialogTarget.sourceId, dialogTarget.dialogPath, false)
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
  }, [data, updateData, updatePath, contextExecute])

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
