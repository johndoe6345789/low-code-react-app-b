import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataSource } from '@/types/json-ui'
import { DataSourceBadge } from '@/components/atoms/DataSourceBadge'
import { DataSourceIdField } from '@/components/molecules/data-source-editor/DataSourceIdField'
import { KvSourceFields } from '@/components/molecules/data-source-editor/KvSourceFields'
import { StaticSourceFields } from '@/components/molecules/data-source-editor/StaticSourceFields'
import { ComputedSourceFields } from '@/components/molecules/data-source-editor/ComputedSourceFields'
import dataSourceEditorCopy from '@/data/data-source-editor-dialog.json'

interface DataSourceEditorDialogProps {
  open: boolean
  dataSource: DataSource | null
  allDataSources: DataSource[]
  onOpenChange: (open: boolean) => void
  onSave: (dataSource: DataSource) => void
}

export function DataSourceEditorDialog({
  open,
  dataSource,
  allDataSources,
  onOpenChange,
  onSave,
}: DataSourceEditorDialogProps) {
  const [editingSource, setEditingSource] = useState<DataSource | null>(dataSource)

  useEffect(() => {
    setEditingSource(dataSource)
  }, [dataSource])

  const handleSave = () => {
    if (!editingSource) return
    onSave(editingSource)
    onOpenChange(false)
  }

  const updateField = <K extends keyof DataSource>(field: K, value: DataSource[K]) => {
    if (!editingSource) return
    setEditingSource({ ...editingSource, [field]: value })
  }

  const addDependency = (depId: string) => {
    if (!editingSource || editingSource.type !== 'computed') return
    const deps = editingSource.dependencies || []
    if (!deps.includes(depId)) {
      updateField('dependencies', [...deps, depId])
    }
  }

  const removeDependency = (depId: string) => {
    if (!editingSource || editingSource.type !== 'computed') return
    const deps = editingSource.dependencies || []
    updateField('dependencies', deps.filter(d => d !== depId))
  }

  if (!editingSource) return null

  const availableDeps = allDataSources.filter(
    ds => ds.id !== editingSource.id && ds.type !== 'computed',
  )

  const selectedDeps = editingSource.dependencies || []
  const unselectedDeps = availableDeps.filter(ds => !selectedDeps.includes(ds.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dataSourceEditorCopy.title}
            <DataSourceBadge type={editingSource.type} />
          </DialogTitle>
          <DialogDescription>
            {dataSourceEditorCopy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <DataSourceIdField
            editingSource={editingSource}
            label={dataSourceEditorCopy.fields.id.label}
            placeholder={dataSourceEditorCopy.fields.id.placeholder}
            onChange={(value) => updateField('id', value)}
          />

          {editingSource.type === 'kv' && (
            <KvSourceFields
              editingSource={editingSource}
              copy={dataSourceEditorCopy.kv}
              onUpdateField={updateField}
            />
          )}

          {editingSource.type === 'static' && (
            <StaticSourceFields
              editingSource={editingSource}
              label={dataSourceEditorCopy.static.valueLabel}
              placeholder={dataSourceEditorCopy.static.valuePlaceholder}
              onUpdateField={updateField}
            />
          )}

          {editingSource.type === 'computed' && (
            <ComputedSourceFields
              editingSource={editingSource}
              availableDeps={availableDeps}
              selectedDeps={selectedDeps}
              unselectedDeps={unselectedDeps}
              copy={dataSourceEditorCopy.computed}
              onUpdateField={updateField}
              onAddDependency={addDependency}
              onRemoveDependency={removeDependency}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {dataSourceEditorCopy.actions.cancel}
          </Button>
          <Button onClick={handleSave}>
            {dataSourceEditorCopy.actions.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
