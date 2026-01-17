import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
      "border-t border-border px-4 py-2 bg-card flex items-center justify-between text-xs text-muted-foreground",
      className
    )}>
      <div className="flex items-center gap-4">
        <span>
          <span className="font-medium text-foreground">{componentCount}</span> component{componentCount !== 1 ? 's' : ''}
        </span>
        
        {selectedComponentType && (
          <div className="flex items-center gap-2">
            <span>Selected:</span>
            <Badge variant="secondary" className="text-xs font-mono">
              {selectedComponentType}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {hasUnsavedChanges && (
          <Badge variant="outline" className="text-xs">
            Unsaved changes
          </Badge>
        )}
      </div>
    </div>
  )
}
