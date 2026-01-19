import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Code, Eye } from '@phosphor-icons/react'
import { UIComponent } from '@/types/json-ui'
import { PanelHeader, Text, Code as CodeAtom, Stack, IconText } from '@/components/atoms'

interface SchemaCodeViewerProps {
  components: UIComponent[]
  schema: any
}

export function SchemaCodeViewer({ components, schema }: SchemaCodeViewerProps) {
  const jsonString = JSON.stringify(schema, null, 2)
  
  return (
    <div className="h-full flex flex-col bg-card">
      <PanelHeader title="Schema Output" icon={<Code size={20} weight="duotone" />} />
      
      <Tabs defaultValue="json" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-2">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="json" className="flex-1 m-0 mt-2">
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono text-foreground">
              {jsonString}
            </pre>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 m-0 mt-2">
          <div className="p-4">
            <Text variant="muted">
              Live preview coming soon
            </Text>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
