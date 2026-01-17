import { ComponentDefinition, getCategoryComponents } from '@/lib/component-definitions'
import { ComponentPaletteItem } from '@/components/atoms/ComponentPaletteItem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ComponentPaletteProps {
  onDragStart: (component: ComponentDefinition, e: React.DragEvent) => void
}

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const categories = [
    { id: 'layout', label: 'Layout' },
    { id: 'input', label: 'Input' },
    { id: 'display', label: 'Display' },
    { id: 'custom', label: 'Custom' },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag components to the canvas
        </p>
      </div>
      
      <Tabs defaultValue="layout" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-2">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="flex-1 m-0 mt-2">
            <ScrollArea className="h-full px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {getCategoryComponents(cat.id).map((comp) => (
                  <ComponentPaletteItem
                    key={comp.type}
                    component={comp}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
