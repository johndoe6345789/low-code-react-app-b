import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useSeedTemplates } from '@/hooks/data/use-seed-templates'
import { Copy, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function TemplateExplorer() {
  const { templates } = useSeedTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || 'default')

  const currentTemplate = templates.find(t => t.id === selectedTemplate)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadJSON = () => {
    if (!currentTemplate) return
    
    const dataStr = JSON.stringify(currentTemplate.data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentTemplate.id}-template.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Template downloaded')
  }

  const exportCurrentData = async () => {
    const keys = await window.spark.kv.keys()
    const data: Record<string, any> = {}
    
    for (const key of keys) {
      data[key] = await window.spark.kv.get(key)
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'current-project-data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Current project data exported')
  }

  if (!currentTemplate) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Template Explorer</h2>
          <p className="text-muted-foreground">
            Browse and inspect template structures
          </p>
        </div>
        <Button onClick={exportCurrentData} variant="outline">
          <Download className="mr-2" size={16} />
          Export Current Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-colors ${
                selectedTemplate === template.id ? 'border-primary bg-accent/50' : 'hover:bg-accent/20'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentTemplate.icon}</span>
                <div>
                  <CardTitle>{currentTemplate.name}</CardTitle>
                  <CardDescription>{currentTemplate.description}</CardDescription>
                </div>
              </div>
              <Button onClick={downloadJSON} variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentTemplate.data).map(([key, value]) => (
                    <Card key={key}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{key.replace('project-', '')}</CardTitle>
                        <CardDescription>
                          {Array.isArray(value) ? `${value.length} items` : 'Configuration'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4">
                <ScrollArea className="h-[500px]">
                  {Object.entries(currentTemplate.data).map(([key, value]) => (
                    <div key={key} className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{key}</h3>
                        <Badge variant="outline">
                          {Array.isArray(value) ? `${value.length} items` : 'object'}
                        </Badge>
                      </div>
                      {Array.isArray(value) && value.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {value.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="py-1">
                              • {item.name || item.title || item.id}
                            </div>
                          ))}
                          {value.length > 3 && (
                            <div className="py-1 italic">... and {value.length - 3} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="json">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-2 z-10"
                    onClick={() => copyToClipboard(JSON.stringify(currentTemplate.data, null, 2))}
                  >
                    <Copy size={16} />
                  </Button>
                  <ScrollArea className="h-[500px]">
                    <pre className="text-xs p-4 bg-muted rounded-lg">
                      {JSON.stringify(currentTemplate.data, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
