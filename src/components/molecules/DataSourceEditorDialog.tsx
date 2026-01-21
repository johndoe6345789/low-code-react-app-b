import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataSource } from '@/types/json-ui'
import { DataSourceBadge } from '@/components/atoms'
import { DataSourceIdField } from '@/components/molecules/data-source-editor/DataSourceIdField'
import { KvSourceFields } from '@/components/molecules/data-source-editor/KvSourceFields'
import { StaticSourceFields } from '@/components/molecules/data-source-editor/StaticSourceFields'
import dataSourceEditorCopy from '@/data/data-source-editor-dialog.json'
import { useDataSourceEditor } from '@/hooks/data/use-data-source-editor'

interface DataSourceEditorDialogProps {
  open: boolean
  dataSource: DataSource | null
  onOpenChange: (open: boolean) => void
  onSave: (dataSource: DataSource) => void
}

export function DataSourceEditorDialog({
  open,
  dataSource,
  onOpenChange,
  onSave,
}: DataSourceEditorDialogProps) {
  const {
    editingSource,
    updateField,
  } = useDataSourceEditor(dataSource)

  const handleSave = () => {
    if (!editingSource) return
    onSave(editingSource)
    onOpenChange(false)
  }

  if (!editingSource) return null

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
