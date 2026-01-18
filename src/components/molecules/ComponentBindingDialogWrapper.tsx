import type { ChangeEvent } from 'react'
import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import { cn } from '@/lib/utils'
import componentBindingDialogDefinition from './definitions/component-binding-dialog.json'
import type { ComponentBindingDialogWrapperProps } from './interfaces'

export function ComponentBindingDialogWrapper({
  open = false,
  title = 'Component Bindings',
  description = 'Connect component props to data sources.',
  componentType,
  componentId,
  bindings = [],
  onBindingChange,
  onSave,
  onCancel,
  onOpenChange,
  className,
}: ComponentBindingDialogWrapperProps) {
  const handleBindingFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldId = event.currentTarget?.dataset?.fieldId || event.target?.dataset?.fieldId
    if (!fieldId) return
    onBindingChange?.(fieldId, event.target.value)
  }

  return (
    <ComponentRenderer
      component={componentBindingDialogDefinition}
      data={{
        open,
        title,
        description,
        componentType,
        componentId,
        bindingFields: bindings,
        emptyMessage: 'No bindings configured.',
        contentClassName: cn('max-w-2xl', className),
        onBindingFieldChange: handleBindingFieldChange,
        onSave,
        onCancel,
        onOpenChange,
        cancelLabel: 'Cancel',
        saveLabel: 'Save',
      }}
    />
  )
}
