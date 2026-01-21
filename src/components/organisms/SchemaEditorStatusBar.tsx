import { cn } from '@/lib/utils'
import { Badge, Chip, Text, Flex } from '@/components/atoms'

interface SchemaEditorStatusBarProps {
  componentCount: number
  selectedComponentType?: string
  hasUnsavedChanges?: boolean
  className?: string
}

export function SchemaEditorStatusBar({ 
  componentCount, 
  selectedComponentType,
  hasUnsavedChanges = false,
  className 
}: SchemaEditorStatusBarProps) {
  return (
    <div className={cn(
      "border-t border-border px-4 py-2 bg-card flex items-center justify-between",
      className
    )}>
      <Flex align="center" gap="lg">
        <Text variant="caption">
          <span className="font-medium text-foreground">{componentCount}</span> component{componentCount !== 1 ? 's' : ''}
        </Text>
        
        {selectedComponentType && (
          <Flex align="center" gap="sm">
            <Text variant="caption">Selected:</Text>
            <Chip 
              variant="default" 
              size="sm"
              className="font-mono"
            >
              {selectedComponentType}
            </Chip>
          </Flex>
        )}
      </Flex>
      
      <Flex align="center" gap="sm">
        {hasUnsavedChanges && (
          <Badge variant="outline" size="sm">
            Unsaved changes
          </Badge>
        )}
      </Flex>
    </div>
  )
}
