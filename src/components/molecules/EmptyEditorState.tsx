import { EmptyStateIcon, Stack, Text } from '@/components/atoms'
import { FileCode } from '@phosphor-icons/react'

export function EmptyEditorState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Stack direction="vertical" align="center" spacing="md">
        <EmptyStateIcon icon={<FileCode size={48} />} />
        <Text variant="muted">Select a file to edit</Text>
      </Stack>
    </div>
  )
}
