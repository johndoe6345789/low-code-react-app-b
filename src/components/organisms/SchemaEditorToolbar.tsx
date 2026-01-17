import { 
  Download, 
  Upload, 
  Play, 
  Trash,
  Copy,
} from '@phosphor-icons/react'
import { 
  Heading, 
  TextGradient, 
  Text, 
  Separator, 
  Stack, 
  ActionButton,
  Flex 
} from '@/components/atoms'

interface SchemaEditorToolbarProps {
  onImport: () => void
  onExport: () => void
  onCopy: () => void
  onPreview: () => void
  onClear: () => void
}

export function SchemaEditorToolbar({
  onImport,
  onExport,
  onCopy,
  onPreview,
  onClear,
}: SchemaEditorToolbarProps) {
  return (
    <div className="border-b border-border px-6 py-3 bg-card">
      <Flex justify="between" align="center">
        <Stack direction="vertical" spacing="xs">
          <TextGradient 
            from="primary" 
            to="accent"
            className="text-2xl font-bold"
          >
            Schema Editor
          </TextGradient>
          <Text variant="muted">
            Build JSON UI schemas with drag-and-drop
          </Text>
        </Stack>
        
        <Flex align="center" gap="sm">
          <ActionButton
            icon={<Upload size={16} />}
            label="Import"
            onClick={onImport}
            variant="outline"
            size="sm"
          />
          <ActionButton
            icon={<Copy size={16} />}
            label="Copy JSON"
            onClick={onCopy}
            variant="outline"
            size="sm"
          />
          <ActionButton
            icon={<Download size={16} />}
            label="Export"
            onClick={onExport}
            variant="outline"
            size="sm"
          />
          <Separator orientation="vertical" className="h-6" />
          <ActionButton
            icon={<Play size={16} />}
            label="Preview"
            onClick={onPreview}
            variant="outline"
            size="sm"
          />
          <ActionButton
            icon={<Trash size={16} />}
            label="Clear"
            onClick={onClear}
            variant="destructive"
            size="sm"
          />
        </Flex>
      </Flex>
    </div>
  )
}
