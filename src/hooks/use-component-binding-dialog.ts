import { useCallback, useEffect, useState } from 'react'
import { UIComponent } from '@/types/json-ui'

interface UseComponentBindingDialogParams {
  component: UIComponent | null
  onSave: (component: UIComponent) => void
  onOpenChange: (open: boolean) => void
}

export function useComponentBindingDialog({
  component,
  onSave,
  onOpenChange,
}: UseComponentBindingDialogParams) {
  const [editingComponent, setEditingComponent] = useState<UIComponent | null>(component)

  useEffect(() => {
    setEditingComponent(component)
  }, [component])

  const updateBindings = useCallback((bindings: Record<string, any>) => {
    setEditingComponent((prev) => {
      if (!prev) return prev
      return { ...prev, bindings }
    })
  }, [])

  const handleSave = useCallback(() => {
    if (!editingComponent) return
    onSave(editingComponent)
    onOpenChange(false)
  }, [editingComponent, onOpenChange, onSave])

  return {
    editingComponent,
    updateBindings,
    handleSave,
  }
}
