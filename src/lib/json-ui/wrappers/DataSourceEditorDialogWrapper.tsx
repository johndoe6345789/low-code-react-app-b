import type { ChangeEvent } from 'react'
import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import { cn } from '@/lib/utils'
import dataSourceEditorDialogDefinition from './definitions/data-source-editor-dialog.json'
import type { DataSourceEditorDialogWrapperProps } from './interfaces'

export function DataSourceEditorDialogWrapper({
  open = false,
  title = 'Data Source',
  description = 'Update data source details and fields.',
  fields = [],
  onFieldChange,
  onSave,
  onCancel,
  onOpenChange,
  className,
}: DataSourceEditorDialogWrapperProps) {
  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldId = event.currentTarget?.dataset?.fieldId || event.target?.dataset?.fieldId
    if (!fieldId) return
    onFieldChange?.(fieldId, event.target.value)
  }

  return (
    <ComponentRenderer
      component={dataSourceEditorDialogDefinition}
      data={{
        open,
        title,
        description,
        fields,
        emptyMessage: 'No fields configured.',
        contentClassName: cn('max-w-2xl', className),
        onFieldChange: handleFieldChange,
        onSave,
        onCancel,
        onOpenChange,
        cancelLabel: 'Cancel',
        saveLabel: 'Save',
      }}
    />
  )
}
