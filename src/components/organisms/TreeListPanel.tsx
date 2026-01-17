import { ScrollArea } from '@/components/ui/scroll-area'
import { TreeCard, TreeListHeader } from '@/components/molecules'
import { EmptyState, Stack, Container } from '@/components/atoms'
import { ComponentTree } from '@/types/project'
import { FolderOpen } from '@phosphor-icons/react'

interface TreeListPanelProps {
  trees: ComponentTree[]
  selectedTreeId: string | null
  onTreeSelect: (treeId: string) => void
  onTreeEdit: (tree: ComponentTree) => void
  onTreeDuplicate: (tree: ComponentTree) => void
  onTreeDelete: (treeId: string) => void
  onCreateNew: () => void
  onImportJson: () => void
  onExportJson: () => void
}

export function TreeListPanel({
  trees,
  selectedTreeId,
  onTreeSelect,
  onTreeEdit,
  onTreeDuplicate,
  onTreeDelete,
  onCreateNew,
  onImportJson,
  onExportJson,
}: TreeListPanelProps) {
  return (
    <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
      <TreeListHeader
        onCreateNew={onCreateNew}
        onImportJson={onImportJson}
        onExportJson={onExportJson}
        hasSelectedTree={!!selectedTreeId}
      />

      {trees.length === 0 ? (
        <Stack 
          direction="vertical" 
          align="center" 
          justify="center" 
          className="flex-1"
        >
          <EmptyState
            icon={<FolderOpen size={48} weight="duotone" />}
            title="No component trees yet"
            description="Create your first tree to get started"
            action={{
              label: 'Create First Tree',
              onClick: onCreateNew
            }}
          />
        </Stack>
      ) : (
        <ScrollArea className="flex-1">
          <Stack direction="vertical" spacing="sm">
            {trees.map((tree) => (
              <TreeCard
                key={tree.id}
                tree={tree}
                isSelected={selectedTreeId === tree.id}
                onSelect={() => onTreeSelect(tree.id)}
                onEdit={() => onTreeEdit(tree)}
                onDuplicate={() => onTreeDuplicate(tree)}
                onDelete={() => onTreeDelete(tree.id)}
                disableDelete={trees.length === 1}
              />
            ))}
          </Stack>
        </ScrollArea>
      )}
    </div>
  )
}

