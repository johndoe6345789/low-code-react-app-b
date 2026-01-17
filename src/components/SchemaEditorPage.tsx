import { useSchemaEditor } from '@/hooks/ui/use-schema-editor'
import { useDragDrop } from '@/hooks/ui/use-drag-drop'
import { useJsonExport } from '@/hooks/ui/use-json-export'
import { ComponentPalette } from '@/components/molecules/ComponentPalette'
import { ComponentTree } from '@/components/molecules/ComponentTree'
import { PropertyEditor } from '@/components/molecules/PropertyEditor'
import { CanvasRenderer } from '@/components/molecules/CanvasRenderer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ComponentDefinition } from '@/lib/component-definitions'
import { UIComponent } from '@/types/json-ui'
import { 
  Download, 
  Upload, 
  Play, 
  Trash,
  Copy,
  Code,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { PageSchema } from '@/types/json-ui'

export function SchemaEditorPage() {
  const {
    components,
    selectedId,
    hoveredId,
    setSelectedId,
    setHoveredId,
    findComponentById,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    clearAll,
  } = useSchemaEditor()

  const {
    draggedItem,
    dropTarget,
    dropPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragDrop()

  const { exportToJson, copyToClipboard, importFromJson } = useJsonExport()

  const handleComponentDragStart = (component: ComponentDefinition, e: React.DragEvent) => {
    const newComponent: UIComponent = {
      id: `${component.type.toLowerCase()}-${Date.now()}`,
      type: component.type,
      props: component.defaultProps || {},
      children: component.canHaveChildren ? [] : undefined,
    }
    
    handleDragStart({
      id: 'new',
      type: 'component',
      data: newComponent,
    }, e)
  }

  const handleComponentTreeDragStart = (id: string, e: React.DragEvent) => {
    handleDragStart({
      id,
      type: 'existing',
      data: id,
    }, e)
  }

  const handleCanvasDrop = (targetId: string, e: React.DragEvent) => {
    if (!draggedItem) return
    
    const position = dropPosition || 'inside'
    
    if (draggedItem.type === 'component') {
      addComponent(draggedItem.data, targetId === 'root' ? undefined : targetId, position)
    } else if (draggedItem.type === 'existing') {
      if (draggedItem.data !== targetId) {
        moveComponent(draggedItem.data, targetId, position)
      }
    }
    
    handleDrop(targetId, e)
  }

  const handleExportJson = () => {
    const schema: PageSchema = {
      id: 'custom-page',
      name: 'Custom Page',
      layout: { type: 'single' },
      dataSources: [],
      components,
    }
    exportToJson(schema, 'schema.json')
  }

  const handleCopyJson = () => {
    const schema: PageSchema = {
      id: 'custom-page',
      name: 'Custom Page',
      layout: { type: 'single' },
      dataSources: [],
      components,
    }
    copyToClipboard(schema)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0]
      if (file) {
        importFromJson(file, (data) => {
          if (data.components) {
            clearAll()
            data.components.forEach((comp: UIComponent) => {
              addComponent(comp)
            })
          }
        })
      }
    }
    input.click()
  }

  const handlePreview = () => {
    toast.info('Preview mode coming soon')
  }

  const selectedComponent = selectedId ? findComponentById(selectedId) : null

  return (
    <div className="h-full flex flex-col bg-background">
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
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-border bg-card">
          <ComponentPalette onDragStart={handleComponentDragStart} />
        </div>

        <div className="flex-1 flex flex-col">
          <CanvasRenderer
            components={components}
            selectedId={selectedId}
            hoveredId={hoveredId}
            draggedOverId={dropTarget}
            dropPosition={dropPosition}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            onHoverEnd={() => setHoveredId(null)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleCanvasDrop}
          />
        </div>

        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ComponentTree
              components={components}
              selectedId={selectedId}
              hoveredId={hoveredId}
              draggedOverId={dropTarget}
              dropPosition={dropPosition}
              onSelect={setSelectedId}
              onHover={setHoveredId}
              onHoverEnd={() => setHoveredId(null)}
              onDragStart={handleComponentTreeDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleCanvasDrop}
            />
          </div>
          
          <Separator />
          
          <div className="flex-1 overflow-hidden">
            <PropertyEditor
              component={selectedComponent}
              onUpdate={(updates) => {
                if (selectedId) {
                  updateComponent(selectedId, updates)
                }
              }}
              onDelete={() => {
                if (selectedId) {
                  deleteComponent(selectedId)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
