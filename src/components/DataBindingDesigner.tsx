import { useState } from 'react'
import { DataSourceManager } from '@/components/organisms/DataSourceManager'
import { ComponentBindingDialog } from '@/components/molecules/ComponentBindingDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataSource, UIComponent } from '@/types/json-ui'
import { Link, Code } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function DataBindingDesigner() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'userProfile',
      type: 'kv',
      key: 'user-profile',
      defaultValue: { name: 'John Doe', email: 'john@example.com' },
    },
    {
      id: 'counter',
      type: 'kv',
      key: 'app-counter',
      defaultValue: 0,
    },
    {
      id: 'displayName',
      type: 'computed',
      compute: (data) => `Welcome, ${data.userProfile?.name || 'Guest'}!`,
      dependencies: ['userProfile'],
    },
  ])

  const [mockComponents] = useState<UIComponent[]>([
    {
      id: 'title',
      type: 'Heading',
      props: { className: 'text-2xl font-bold' },
      bindings: {
        children: { source: 'displayName' },
      },
    },
    {
      id: 'counter-display',
      type: 'Text',
      props: { className: 'text-lg' },
      bindings: {
        children: { source: 'counter' },
      },
    },
    {
      id: 'email-input',
      type: 'Input',
      props: { placeholder: 'Enter email' },
      bindings: {
        value: { source: 'userProfile', path: 'email' },
      },
    },
  ])

  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null)
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false)

  const handleEditBinding = (component: UIComponent) => {
    setSelectedComponent(component)
    setBindingDialogOpen(true)
  }

  const handleSaveBinding = (updatedComponent: UIComponent) => {
    console.log('Updated component bindings:', updatedComponent)
  }

  const getSourceById = (sourceId: string) => {
    return dataSources.find(ds => ds.id === sourceId)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Data Binding Designer
          </h1>
          <p className="text-muted-foreground">
            Connect UI components to KV storage and computed values
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DataSourceManager
              dataSources={dataSources}
              onChange={setDataSources}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Component Bindings
                </CardTitle>
                <CardDescription>
                  Example components with data bindings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {mockComponents.map(component => {
                      const bindingCount = Object.keys(component.bindings || {}).length
                      
                      return (
                        <Card key={component.id} className="bg-card/50 backdrop-blur">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {component.type}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    #{component.id}
                                  </span>
                                </div>

                                {bindingCount > 0 ? (
                                  <div className="space-y-1">
                                    {Object.entries(component.bindings || {}).map(([prop, binding]) => {
                                      const source = getSourceById(binding.source)
                                      return (
                                        <div key={prop} className="flex items-center gap-2 text-xs">
                                          <span className="text-muted-foreground font-mono">
                                            {prop}:
                                          </span>
                                          <Badge 
                                            variant="secondary" 
                                            className="font-mono h-5 text-xs"
                                          >
                                            {binding.source}
                                            {binding.path && `.${binding.path}`}
                                          </Badge>
                                          {source && (
                                            <Badge 
                                              variant="outline" 
                                              className="h-5 text-xs"
                                            >
                                              {source.type}
                                            </Badge>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">
                                    No bindings configured
                                  </p>
                                )}
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditBinding(component)}
                                className="h-8 px-3"
                              >
                                <Link className="w-4 h-4 mr-1" />
                                Bind
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    Create data sources (KV store for persistence, static for constants)
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Add computed sources to derive values from other sources
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Bind component properties to data sources for reactive updates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ComponentBindingDialog
        open={bindingDialogOpen}
        component={selectedComponent}
        dataSources={dataSources}
        onOpenChange={setBindingDialogOpen}
        onSave={handleSaveBinding}
      />
    </div>
  )
}
