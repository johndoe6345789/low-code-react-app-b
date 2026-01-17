import { useState, useEffect } from 'react'
import { PageRenderer } from '@/lib/schema-renderer'
import { useSchemaLoader } from '@/hooks/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Code, FileText, Database } from '@phosphor-icons/react'
import dashboardSchema from '@/config/schemas/json-ui-dashboard.json'

interface JSONUIShowcaseProps {
  files?: any[]
  models?: any[]
  components?: any[]
}

export function JSONUIShowcase({ 
  files = [], 
  models = [], 
  components = [] 
}: JSONUIShowcaseProps) {
  const [showJSON, setShowJSON] = useState(false)
  const {schema: loadedSchema, loading, error} = useSchemaLoader({ 
    schema: dashboardSchema as any
  })

  const data = {
    files: files.length > 0 ? files : [
      { name: 'App.tsx', type: 'TypeScript' },
      { name: 'index.css', type: 'CSS' },
      { name: 'schema-renderer.tsx', type: 'TypeScript' },
      { name: 'use-data-binding.ts', type: 'Hook' },
      { name: 'dashboard.json', type: 'JSON' },
    ],
    models: models.length > 0 ? models : [
      { name: 'User', fields: 5 },
      { name: 'Post', fields: 8 },
      { name: 'Comment', fields: 4 },
    ],
    components: components.length > 0 ? components : [
      { name: 'Button', type: 'atom' },
      { name: 'Card', type: 'molecule' },
      { name: 'Dashboard', type: 'organism' },
    ],
  }

  const functions = {
    handleClick: () => {
      console.log('Button clicked from JSON!')
    },
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading schema...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load schema: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!loadedSchema) {
    return (
      <div className="h-full p-6">
        <Alert>
          <AlertDescription>No schema loaded</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={24} weight="duotone" className="text-primary" />
              JSON-Driven UI System
            </CardTitle>
            <CardDescription>
              Complete UI rendering from declarative JSON schemas with data bindings and event handlers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowJSON(!showJSON)}
                variant="outline"
                size="sm"
              >
                <FileText size={16} weight="duotone" className="mr-2" />
                {showJSON ? 'Hide' : 'Show'} JSON Schema
              </Button>
            </div>
            {showJSON && (
              <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-xs font-mono max-h-96">
                {JSON.stringify(loadedSchema, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database size={20} weight="duotone" className="text-blue-500" />
                Schema-Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                UI structure defined in JSON, making it easy to modify without code changes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code size={20} weight="duotone" className="text-green-500" />
                Data Bindings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dynamic expressions in JSON connect UI to application state seamlessly
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={20} weight="duotone" className="text-purple-500" />
                Atomic Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Modular components composed from atoms to organisms following best practices
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-2xl font-bold mb-4">Rendered from JSON</h2>
          <p className="text-muted-foreground mb-6">
            The content below is entirely generated from the JSON schema above, demonstrating data bindings, 
            loops, and component composition.
          </p>
          <PageRenderer schema={loadedSchema} data={data} functions={functions} />
        </div>
      </div>
    </div>
  )
}
