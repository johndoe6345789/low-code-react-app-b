import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Code, Eye } from '@phosphor-icons/react'
import { UIComponent } from '@/types/json-ui'

interface SchemaCodeViewerProps {
  components: UIComponent[]
  schema: any
}

export function SchemaCodeViewer({ components, schema }: SchemaCodeViewerProps) {
  const jsonString = JSON.stringify(schema, null, 2)
  
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Schema Output</h3>
          </div>
        </div>
      </div>
      
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
            <p className="text-sm text-muted-foreground">
              Live preview coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
