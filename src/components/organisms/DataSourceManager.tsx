import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DataSourceEditorDialog } from '@/lib/json-ui/json-components'
import { useDataSourceManager } from '@/hooks/data/use-data-source-manager'
import { DataSource, DataSourceType } from '@/types/json-ui'
import { Database, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmptyState, Stack } from '@/components/atoms'
import { DataSourceManagerHeader } from '@/components/organisms/data-source-manager/DataSourceManagerHeader'
import { DataSourceGroupSection } from '@/components/organisms/data-source-manager/DataSourceGroupSection'
import dataSourceManagerCopy from '@/data/data-source-manager.json'

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
      const noun = dependents.length === 1 ? 'source' : 'sources'
      toast.error(dataSourceManagerCopy.toasts.deleteBlockedTitle, {
        description: dataSourceManagerCopy.toasts.deleteBlockedDescription
          .replace('{count}', String(dependents.length))
          .replace('{noun}', noun),
      })
      return
    }

    deleteDataSource(id)
    onChange(localSources.filter(ds => ds.id !== id))
    toast.success(dataSourceManagerCopy.toasts.deleted)
  }

  const handleSaveSource = (updatedSource: DataSource) => {
    updateDataSource(updatedSource.id, updatedSource)
    onChange(localSources.map(ds => ds.id === updatedSource.id ? updatedSource : ds))
    toast.success(dataSourceManagerCopy.toasts.updated)
  }

  const groupedSources = {
    kv: localSources.filter(ds => ds.type === 'kv'),
    static: localSources.filter(ds => ds.type === 'static'),
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <DataSourceManagerHeader
            copy={{
              title: dataSourceManagerCopy.header.title,
              description: dataSourceManagerCopy.header.description,
              addLabel: dataSourceManagerCopy.actions.add,
              menu: dataSourceManagerCopy.menu,
            }}
            onAdd={handleAddDataSource}
          />
        </CardHeader>
        <CardContent>
          {localSources.length === 0 ? (
            <EmptyState
              icon={<Database size={48} weight="duotone" />}
              title={dataSourceManagerCopy.emptyState.title}
              description={dataSourceManagerCopy.emptyState.description}
            />
          ) : (
            <Stack direction="vertical" spacing="xl">
              <DataSourceGroupSection
                icon={<Database size={16} />}
                label={dataSourceManagerCopy.groups.kv}
                dataSources={groupedSources.kv}
                getDependents={getDependents}
                onEdit={handleEditSource}
                onDelete={handleDeleteSource}
              />

              <DataSourceGroupSection
                icon={<FileText size={16} />}
                label={dataSourceManagerCopy.groups.static}
                dataSources={groupedSources.static}
                getDependents={getDependents}
                onEdit={handleEditSource}
                onDelete={handleDeleteSource}
              />
            </Stack>
          )}
        </CardContent>
      </Card>

      <DataSourceEditorDialog
        open={dialogOpen}
        dataSource={editingSource}
        onOpenChange={setDialogOpen}
        onSave={handleSaveSource}
      />
    </div>
  )
}
