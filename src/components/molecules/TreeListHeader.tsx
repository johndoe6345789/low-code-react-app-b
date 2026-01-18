import { Button, TreeIcon, ActionIcon, Flex, Heading, Stack, IconButton } from '@/components/atoms'

interface TreeListHeaderProps {
  onCreateNew: () => void
  onImportJson: () => void
  onExportJson: () => void
  hasSelectedTree?: boolean
}

export function TreeListHeader({
  onCreateNew,
  onImportJson,
  onExportJson,
  hasSelectedTree = false,
}: TreeListHeaderProps) {
  return (
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
          disabled={!hasSelectedTree}
          className="flex-1 text-xs"
          leftIcon={<ActionIcon action="download" size={14} />}
        >
          Export JSON
        </Button>
      </Flex>
    </Stack>
  )
}
