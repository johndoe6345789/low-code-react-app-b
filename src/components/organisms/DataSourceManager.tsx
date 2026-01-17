import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { DataSourceCard } from '@/components/molecules/DataSourceCard'
import { DataSourceEditorDialog } from '@/components/molecules/DataSourceEditorDialog'
import { useDataSourceManager } from '@/hooks/data/use-data-source-manager'
import { DataSource, DataSourceType } from '@/types/json-ui'
import { Plus, Database, Function, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  EmptyState, 
  ActionButton, 
  Heading, 
  Text, 
  IconText,
  Stack,
  Section
} from '@/components/atoms'

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
            <Stack direction="vertical" spacing="xs">
              <Heading level={2}>Data Sources</Heading>
              <Text variant="muted">
                Manage KV storage, computed values, and static data
              </Text>
            </Stack>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ActionButton
                    icon={<Plus size={16} />}
                    label="Add Data Source"
                    variant="default"
                    onClick={() => {}}
                  />
                </div>
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
            <EmptyState
              icon={<Database size={48} weight="duotone" />}
              title="No data sources yet"
              description="Create your first data source to start binding data to components"
            />
          ) : (
            <Stack direction="vertical" spacing="xl">
              {groupedSources.kv.length > 0 && (
                <Section>
                  <IconText 
                    icon={<Database size={16} />}
                    className="text-sm font-semibold mb-3"
                  >
                    KV Store ({groupedSources.kv.length})
                  </IconText>
                  <Stack direction="vertical" spacing="sm">
                    {groupedSources.kv.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </Stack>
                </Section>
              )}

              {groupedSources.static.length > 0 && (
                <Section>
                  <IconText 
                    icon={<FileText size={16} />}
                    className="text-sm font-semibold mb-3"
                  >
                    Static Data ({groupedSources.static.length})
                  </IconText>
                  <Stack direction="vertical" spacing="sm">
                    {groupedSources.static.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </Stack>
                </Section>
              )}

              {groupedSources.computed.length > 0 && (
                <Section>
                  <IconText 
                    icon={<Function size={16} />}
                    className="text-sm font-semibold mb-3"
                  >
                    Computed Values ({groupedSources.computed.length})
                  </IconText>
                  <Stack direction="vertical" spacing="sm">
                    {groupedSources.computed.map(ds => (
                      <DataSourceCard
                        key={ds.id}
                        dataSource={ds}
                        dependents={getDependents(ds.id)}
                        onEdit={handleEditSource}
                        onDelete={handleDeleteSource}
                      />
                    ))}
                  </Stack>
                </Section>
              )}
            </Stack>
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
