import { Card, Badge, ActionIcon, IconButton, Stack, Flex, Text, Heading } from '@/components/atoms'
import { ComponentTree } from '@/types/project'

interface TreeCardProps {
  tree: ComponentTree
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  disableDelete?: boolean
}

export function TreeCard({
  tree,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  disableDelete = false,
}: TreeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all p-4 ${
        isSelected ? 'ring-2 ring-primary bg-accent' : 'hover:bg-accent/50'
      }`}
      onClick={onSelect}
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
              onClick={onEdit}
              title="Edit tree"
            />
            <IconButton
              icon={<ActionIcon action="copy" size={14} />}
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              title="Duplicate tree"
            />
            <IconButton
              icon={<ActionIcon action="delete" size={14} />}
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={disableDelete}
              title="Delete tree"
            />
          </Flex>
        </div>
      </Stack>
    </Card>
  )
}
