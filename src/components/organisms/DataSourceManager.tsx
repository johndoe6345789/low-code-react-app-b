import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataSourceCard } from '@/components/molecules/DataSourceCard'
import { DataSourceEditorDialog } from '@/components/molecules/DataSourceEditorDialog'
import { useDataSourceManager } from '@/hooks/data/use-data-source-manager'
import { DataSource, DataSourceType } from '@/types/json-ui'
import { Plus, Database, Function, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface DataSourceManagerProps {
  dataSources: DataSource[]
  onChange: (dataSources: DataSource[]) => void
}

export function DataSourceManager({ dataSources, onChange }: DataSourceManagerProps) {
  const {
    dataSources: localSources,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    getDependents,
  } = useDataSourceManager(dataSources)

  const [editingSource, setEditingSource] = useState<DataSource | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddDataSource = (type: DataSourceType) => {
    const newSource = addDataSource(type)
    setEditingSource(newSource)
    setDialogOpen(true)
  }

  const handleEditSource = (id: string) => {
    const source = localSources.find(ds => ds.id === id)
    if (source) {
      setEditingSource(source)
      setDialogOpen(true)
    }
  }

  const handleDeleteSource = (id: string) => {
    const dependents = getDependents(id)
    if (dependents.length > 0) {
      toast.error('Cannot delete', {
        description: `This source is used by ${dependents.length} computed ${dependents.length === 1 ? 'source' : 'sources'}`,
      })
      return
    }

    deleteDataSource(id)
    onChange(localSources.filter(ds => ds.id !== id))
    toast.success('Data source deleted')
  }

  const handleSaveSource = (updatedSource: DataSource) => {
    updateDataSource(updatedSource.id, updatedSource)
    onChange(localSources.map(ds => ds.id === updatedSource.id ? updatedSource : ds))
    toast.success('Data source updated')
  }

  const groupedSources = {
    kv: localSources.filter(ds => ds.type === 'kv'),
    computed: localSources.filter(ds => ds.type === 'computed'),
    static: localSources.filter(ds => ds.type === 'static'),
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Manage KV storage, computed values, and static data
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Data Source
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAddDataSource('kv')}>
                  <Database className="w-4 h-4 mr-2" />
                  KV Store
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddDataSource('computed')}>
                  <Function className="w-4 h-4 mr-2" />
                  Computed Value
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddDataSource('static')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Static Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {localSources.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No data sources yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first data source to start binding data to components
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedSources.kv.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    KV Store ({groupedSources.kv.length})
                  </h3>
                  <div className="space-y-2">
                    {groupedSources.kv.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSources.static.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Static Data ({groupedSources.static.length})
                  </h3>
                  <div className="space-y-2">
                    {groupedSources.static.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSources.computed.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Function className="w-4 h-4" />
                    Computed Values ({groupedSources.computed.length})
                  </h3>
                  <div className="space-y-2">
                    {groupedSources.computed.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DataSourceEditorDialog
        open={dialogOpen}
        dataSource={editingSource}
        allDataSources={localSources}
        onOpenChange={setDialogOpen}
        onSave={handleSaveSource}
      />
    </div>
  )
}
