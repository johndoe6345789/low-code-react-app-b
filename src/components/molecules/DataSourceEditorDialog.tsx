import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DataSource, DataSourceType } from '@/types/json-ui'
import { DataSourceBadge } from '@/components/atoms/DataSourceBadge'
import { Badge } from '@/components/ui/badge'
import { X } from '@phosphor-icons/react'

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
  onSave 
}: DataSourceEditorDialogProps) {
  const [editingSource, setEditingSource] = useState<DataSource | null>(dataSource)

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
    ds => ds.id !== editingSource.id && ds.type !== 'computed'
  )

  const selectedDeps = editingSource.dependencies || []
  const unselectedDeps = availableDeps.filter(ds => !selectedDeps.includes(ds.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Data Source
            <DataSourceBadge type={editingSource.type} />
          </DialogTitle>
          <DialogDescription>
            Configure the data source settings and dependencies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>ID</Label>
            <Input
              value={editingSource.id}
              onChange={(e) => updateField('id', e.target.value)}
              placeholder="unique-id"
              className="font-mono"
            />
          </div>

          {editingSource.type === 'kv' && (
            <>
              <div className="space-y-2">
                <Label>KV Store Key</Label>
                <Input
                  value={editingSource.key || ''}
                  onChange={(e) => updateField('key', e.target.value)}
                  placeholder="storage-key"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Key used for persistent storage in the KV store
                </p>
              </div>

              <div className="space-y-2">
                <Label>Default Value (JSON)</Label>
                <Textarea
                  value={JSON.stringify(editingSource.defaultValue, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('defaultValue', parsed)
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  placeholder='{"key": "value"}'
                  className="font-mono text-sm h-24"
                />
              </div>
            </>
          )}

          {editingSource.type === 'static' && (
            <div className="space-y-2">
              <Label>Value (JSON)</Label>
              <Textarea
                value={JSON.stringify(editingSource.defaultValue, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    updateField('defaultValue', parsed)
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"key": "value"}'
                className="font-mono text-sm h-24"
              />
            </div>
          )}

          {editingSource.type === 'computed' && (
            <>
              <div className="space-y-2">
                <Label>Compute Function</Label>
                <Textarea
                  value={editingSource.compute?.toString() || ''}
                  onChange={(e) => {
                    try {
                      const fn = new Function('data', `return (${e.target.value})`)()
                      updateField('compute', fn)
                    } catch (err) {
                      // Invalid function
                    }
                  }}
                  placeholder="(data) => data.source1 + data.source2"
                  className="font-mono text-sm h-24"
                />
                <p className="text-xs text-muted-foreground">
                  Function that computes the value from other data sources
                </p>
              </div>

              <div className="space-y-2">
                <Label>Dependencies</Label>
                
                {selectedDeps.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded border border-border">
                    {selectedDeps.map(depId => (
                      <Badge
                        key={depId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {depId}
                        <button
                          onClick={() => removeDependency(depId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {unselectedDeps.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Available Sources</Label>
                    <div className="flex flex-wrap gap-2">
                      {unselectedDeps.map(ds => (
                        <Button
                          key={ds.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addDependency(ds.id)}
                          className="h-7 text-xs"
                        >
                          + {ds.id}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {unselectedDeps.length === 0 && selectedDeps.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No data sources available. Create KV or static sources first.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
