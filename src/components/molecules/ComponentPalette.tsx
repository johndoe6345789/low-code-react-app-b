import { ComponentDefinition, getCategoryComponents } from '@/lib/component-definitions'
import { ComponentPaletteItem } from '@/components/atoms/ComponentPaletteItem'
import { PanelHeader, Stack } from '@/components/atoms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Package } from '@phosphor-icons/react'

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
    <Stack direction="vertical" className="h-full">
      <div className="p-4">
        <PanelHeader
          title="Components"
          subtitle="Drag components to the canvas"
          icon={<Package size={20} weight="duotone" />}
          showSeparator={false}
        />
      </div>
      
      <Tabs defaultValue="layout" className="flex-1 flex flex-col border-t border-border">
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
    </Stack>
  )
}
