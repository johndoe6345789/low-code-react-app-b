import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JSONUIPage } from '@/components/JSONUIPage'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import dashboardExample from '@/config/ui-examples/dashboard.json'
import formExample from '@/config/ui-examples/form.json'
import tableExample from '@/config/ui-examples/table.json'
import settingsExample from '@/config/ui-examples/settings.json'
import { FileCode, Eye, Code, ChartBar, ListBullets, Table, Gear } from '@phosphor-icons/react'

export function JSONUIShowcase() {
  const [selectedExample, setSelectedExample] = useState('dashboard')
  const [showJSON, setShowJSON] = useState(false)

  const examples = {
    dashboard: {
      name: 'Dashboard',
      description: 'Complete dashboard with stats, activity feed, and quick actions',
      icon: ChartBar,
      config: dashboardExample,
    },
    form: {
      name: 'Form',
      description: 'Dynamic form with validation and data binding',
      icon: ListBullets,
      config: formExample,
    },
    table: {
      name: 'Data Table',
      description: 'Interactive table with row actions and looping',
      icon: Table,
      config: tableExample,
    },
    settings: {
      name: 'Settings',
      description: 'Tabbed settings panel with switches and selections',
      icon: Gear,
      config: settingsExample,
    },
  }

  const currentExample = examples[selectedExample as keyof typeof examples]

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">JSON UI System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Build complex UIs from declarative JSON configurations
            </p>
          </div>
          <Badge variant="secondary" className="font-mono">
            EXPERIMENTAL
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedExample} onValueChange={setSelectedExample} className="h-full flex flex-col">
          <div className="border-b border-border bg-muted/30 px-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-transparent border-0">
                {Object.entries(examples).map(([key, example]) => {
                  const Icon = example.icon
                  return (
                    <TabsTrigger key={key} value={key} className="gap-2">
                      <Icon size={16} />
                      {example.name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJSON(!showJSON)}
                className="gap-2"
              >
                {showJSON ? <Eye size={16} /> : <Code size={16} />}
                {showJSON ? 'Show Preview' : 'Show JSON'}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {Object.entries(examples).map(([key, example]) => (
              <TabsContent key={key} value={key} className="h-full m-0">
                {showJSON ? (
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">JSON Configuration</CardTitle>
                        <CardDescription>
                          {example.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-[600px]">
                          <code>{JSON.stringify(example.config, null, 2)}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <JSONUIPage jsonConfig={example.config} />
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      <div className="border-t border-border bg-card px-6 py-3">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Fully declarative - no React code needed</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Data binding with automatic updates</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Event handlers and actions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
