import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState, Stack, Container, Card, Badge, ActionIcon, IconButton, Flex, Text, Heading, Button, TreeIcon } from '@/components/atoms'
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
      {/* TreeListHeader - inlined */}
      <Stack spacing="sm">
        <Flex justify="between" align="center">
          <Flex align="center" gap="sm">
            <TreeIcon size={20} />
            <Heading level={2} className="text-lg font-semibold">Component Trees</Heading>
          </Flex>
          <IconButton 
            icon={<ActionIcon action="add" size={16} />}
            size="sm" 
            onClick={onCreateNew}
          />
        </Flex>
        
        <Flex gap="sm">
          <Button
            size="sm"
            variant="outline"
            onClick={onImportJson}
            className="flex-1 text-xs"
            leftIcon={<ActionIcon action="upload" size={14} />}
          >
            Import JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onExportJson}
            disabled={!selectedTreeId}
            className="flex-1 text-xs"
            leftIcon={<ActionIcon action="download" size={14} />}
          >
            Export JSON
          </Button>
        </Flex>
      </Stack>

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
            {trees.map((tree) => {
              const isSelected = selectedTreeId === tree.id
              const disableDelete = trees.length === 1
              
              return (
                // TreeCard - inlined
                <Card
                  key={tree.id}
                  className={`cursor-pointer transition-all p-4 ${
                    isSelected ? 'ring-2 ring-primary bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => onTreeSelect(tree.id)}
                >
                  <Stack spacing="sm">
                    <Flex justify="between" align="start" gap="sm">
                      <Stack spacing="xs" className="flex-1 min-w-0">
                        <Heading level={4} className="text-sm truncate">{tree.name}</Heading>
                        {tree.description && (
                          <Text variant="caption" className="line-clamp-2">
                            {tree.description}
                          </Text>
                        )}
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {tree.rootNodes.length} components
                          </Badge>
                        </div>
                      </Stack>
                    </Flex>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Flex gap="xs" className="mt-1">
                        <IconButton
                          icon={<ActionIcon action="edit" size={14} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => onTreeEdit(tree)}
                          title="Edit tree"
                        />
                        <IconButton
                          icon={<ActionIcon action="duplicate" size={14} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => onTreeDuplicate(tree)}
                          title="Duplicate tree"
                        />
                        <IconButton
                          icon={<ActionIcon action="delete" size={14} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => onTreeDelete(tree.id)}
                          disabled={disableDelete}
                          title={disableDelete ? "Can't delete last tree" : "Delete tree"}
                        />
                      </Flex>
                    </div>
                  </Stack>
                </Card>
              )
            })}
          </Stack>
        </ScrollArea>
      )}
    </div>
  )
}

