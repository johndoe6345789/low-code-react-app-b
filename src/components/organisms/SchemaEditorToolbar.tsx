import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Upload, 
  Play, 
  Trash,
  Copy,
} from '@phosphor-icons/react'

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Schema Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build JSON UI schemas with drag-and-drop
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
          >
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
