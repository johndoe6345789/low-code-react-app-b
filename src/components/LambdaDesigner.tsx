import { useState } from 'react'
import { Lambda, LambdaTrigger } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Trash,
  Code,
  Play,
  Copy,
  Pencil,
  Lightning,
  Clock,
  Globe,
  Queue,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { LazyInlineMonacoEditor } from '@/components/molecules/LazyInlineMonacoEditor'

interface LambdaDesignerProps {
  lambdas: Lambda[]
  onLambdasChange: (updater: (lambdas: Lambda[]) => Lambda[]) => void
}

const DEFAULT_JS_CODE = `// Lambda function
export async function handler(event, context) {
  console.log('Event:', event);
  
  // Your logic here
  const result = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      input: event,
    }),
  };
  
  return result;
}`

const DEFAULT_TS_CODE = `// Lambda function
interface Event {
  [key: string]: any;
}

interface Context {
  requestId: string;
  functionName: string;
  [key: string]: any;
}

interface Response {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export async function handler(event: Event, context: Context): Promise<Response> {
  console.log('Event:', event);
  
  // Your logic here
  const result: Response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      input: event,
    }),
  };
  
  return result;
}`

const DEFAULT_PYTHON_CODE = `# Lambda function
def handler(event, context):
    print('Event:', event)
    
    # Your logic here
    result = {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Hello from Lambda!',
            'input': event,
        })
    }
    
    return result`

const TRIGGER_TYPES = [
  { value: 'http', label: 'HTTP API', icon: Globe },
  { value: 'schedule', label: 'Schedule', icon: Clock },
  { value: 'event', label: 'Event', icon: Lightning },
  { value: 'queue', label: 'Queue', icon: Queue },
]

export function LambdaDesigner({ lambdas, onLambdasChange }: LambdaDesignerProps) {
  const [selectedLambdaId, setSelectedLambdaId] = useState<string | null>(lambdas[0]?.id || null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [triggerDialogOpen, setTriggerDialogOpen] = useState(false)
  const [newLambdaName, setNewLambdaName] = useState('')
  const [newLambdaDescription, setNewLambdaDescription] = useState('')
  const [newLambdaLanguage, setNewLambdaLanguage] = useState<Lambda['language']>('typescript')
  const [editingLambda, setEditingLambda] = useState<Lambda | null>(null)
  const [newTriggerType, setNewTriggerType] = useState<LambdaTrigger['type']>('http')

  const selectedLambda = lambdas.find((l) => l.id === selectedLambdaId)

  const getDefaultCode = (language: Lambda['language']) => {
    switch (language) {
      case 'javascript':
        return DEFAULT_JS_CODE
      case 'typescript':
        return DEFAULT_TS_CODE
      case 'python':
        return DEFAULT_PYTHON_CODE
      default:
        return DEFAULT_JS_CODE
    }
  }

  const handleCreateLambda = () => {
    if (!newLambdaName.trim()) {
      toast.error('Please enter a lambda name')
      return
    }

    const newLambda: Lambda = {
      id: `lambda-${Date.now()}`,
      name: newLambdaName,
      description: newLambdaDescription,
      code: getDefaultCode(newLambdaLanguage),
      language: newLambdaLanguage,
      runtime: newLambdaLanguage === 'python' ? 'python3.11' : 'nodejs20.x',
      handler: 'index.handler',
      timeout: 30,
      memory: 256,
      environment: {},
      triggers: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onLambdasChange((current) => [...current, newLambda])
    setSelectedLambdaId(newLambda.id)
    setNewLambdaName('')
    setNewLambdaDescription('')
    setNewLambdaLanguage('typescript')
    setCreateDialogOpen(false)
    toast.success('Lambda created')
  }

  const handleEditLambda = () => {
    if (!editingLambda || !newLambdaName.trim()) return

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === editingLambda.id
          ? {
              ...lambda,
              name: newLambdaName,
              description: newLambdaDescription,
              updatedAt: Date.now(),
            }
          : lambda
      )
    )
    setEditDialogOpen(false)
    setEditingLambda(null)
    setNewLambdaName('')
    setNewLambdaDescription('')
    toast.success('Lambda updated')
  }

  const handleDeleteLambda = (lambdaId: string) => {
    if (confirm('Are you sure you want to delete this lambda?')) {
      onLambdasChange((current) => current.filter((l) => l.id !== lambdaId))
      if (selectedLambdaId === lambdaId) {
        setSelectedLambdaId(lambdas.find((l) => l.id !== lambdaId)?.id || null)
      }
      toast.success('Lambda deleted')
    }
  }

  const handleDuplicateLambda = (lambda: Lambda) => {
    const duplicatedLambda: Lambda = {
      ...lambda,
      id: `lambda-${Date.now()}`,
      name: `${lambda.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onLambdasChange((current) => [...current, duplicatedLambda])
    setSelectedLambdaId(duplicatedLambda.id)
    toast.success('Lambda duplicated')
  }

  const handleUpdateCode = (code: string) => {
    if (!selectedLambdaId) return

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === selectedLambdaId
          ? { ...lambda, code, updatedAt: Date.now() }
          : lambda
      )
    )
  }

  const handleUpdateConfig = (field: keyof Lambda, value: any) => {
    if (!selectedLambdaId) return

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === selectedLambdaId
          ? { ...lambda, [field]: value, updatedAt: Date.now() }
          : lambda
      )
    )
  }

  const handleAddTrigger = () => {
    if (!selectedLambdaId) return

    const newTrigger: LambdaTrigger = {
      id: `trigger-${Date.now()}`,
      type: newTriggerType,
      config: {},
    }

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === selectedLambdaId
          ? {
              ...lambda,
              triggers: [...lambda.triggers, newTrigger],
              updatedAt: Date.now(),
            }
          : lambda
      )
    )

    setTriggerDialogOpen(false)
    toast.success('Trigger added')
  }

  const handleDeleteTrigger = (triggerId: string) => {
    if (!selectedLambdaId) return

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === selectedLambdaId
          ? {
              ...lambda,
              triggers: lambda.triggers.filter((t) => t.id !== triggerId),
              updatedAt: Date.now(),
            }
          : lambda
      )
    )

    toast.success('Trigger deleted')
  }

  const handleAddEnvironmentVariable = () => {
    if (!selectedLambdaId) return

    const key = prompt('Enter environment variable name:')
    if (!key) return

    const value = prompt('Enter environment variable value:')
    if (value === null) return

    onLambdasChange((current) =>
      current.map((lambda) =>
        lambda.id === selectedLambdaId
          ? {
              ...lambda,
              environment: { ...lambda.environment, [key]: value },
              updatedAt: Date.now(),
            }
          : lambda
      )
    )

    toast.success('Environment variable added')
  }

  const handleDeleteEnvironmentVariable = (key: string) => {
    if (!selectedLambdaId) return

    onLambdasChange((current) =>
      current.map((lambda) => {
        if (lambda.id !== selectedLambdaId) return lambda
        const { [key]: _, ...rest } = lambda.environment
        return { ...lambda, environment: rest, updatedAt: Date.now() }
      })
    )

    toast.success('Environment variable deleted')
  }

  const openEditDialog = (lambda: Lambda) => {
    setEditingLambda(lambda)
    setNewLambdaName(lambda.name)
    setNewLambdaDescription(lambda.description)
    setEditDialogOpen(true)
  }

  const getEditorLanguage = (language: Lambda['language']) => {
    return language === 'typescript' || language === 'javascript' ? 'typescript' : 'python'
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code size={20} weight="duotone" />
            Lambda Functions
          </h2>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {lambdas.map((lambda) => (
              <Card
                key={lambda.id}
                className={`cursor-pointer transition-all ${
                  selectedLambdaId === lambda.id
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedLambdaId(lambda.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm truncate">{lambda.name}</CardTitle>
                      {lambda.description && (
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {lambda.description}
                        </CardDescription>
                      )}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs capitalize">
                          {lambda.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lambda.triggers.length} triggers
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(lambda)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicateLambda(lambda)}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteLambda(lambda.id)}
                      title="Delete"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {lambdas.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Code size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
              <p className="text-sm">No lambdas yet</p>
              <Button size="sm" className="mt-2" onClick={() => setCreateDialogOpen(true)}>
                Create First Lambda
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedLambda ? (
          <>
            <div className="border-b border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{selectedLambda.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedLambda.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled>
                    <Play size={16} className="mr-2" />
                    Test
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize">{selectedLambda.language}</Badge>
                <Badge variant="outline">{selectedLambda.runtime}</Badge>
                <Badge variant="outline">{selectedLambda.timeout}s timeout</Badge>
                <Badge variant="outline">{selectedLambda.memory}MB memory</Badge>
              </div>
            </div>

            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              <div className="border-b border-border bg-card px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="triggers">Triggers</TabsTrigger>
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="code" className="flex-1 m-0">
                <LazyInlineMonacoEditor
                  height="100%"
                  language={getEditorLanguage(selectedLambda.language)}
                  value={selectedLambda.code}
                  onChange={(value) => handleUpdateCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </TabsContent>

              <TabsContent value="config" className="m-0 p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <Label htmlFor="runtime">Runtime</Label>
                      <Select
                        value={selectedLambda.runtime}
                        onValueChange={(value) => handleUpdateConfig('runtime', value)}
                      >
                        <SelectTrigger id="runtime">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nodejs20.x">Node.js 20.x</SelectItem>
                          <SelectItem value="nodejs18.x">Node.js 18.x</SelectItem>
                          <SelectItem value="python3.11">Python 3.11</SelectItem>
                          <SelectItem value="python3.10">Python 3.10</SelectItem>
                          <SelectItem value="python3.9">Python 3.9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="handler">Handler</Label>
                      <Input
                        id="handler"
                        value={selectedLambda.handler}
                        onChange={(e) => handleUpdateConfig('handler', e.target.value)}
                        placeholder="index.handler"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeout">Timeout (seconds)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={selectedLambda.timeout}
                        onChange={(e) => handleUpdateConfig('timeout', parseInt(e.target.value))}
                        min="1"
                        max="900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="memory">Memory (MB)</Label>
                      <Select
                        value={selectedLambda.memory.toString()}
                        onValueChange={(value) => handleUpdateConfig('memory', parseInt(value))}
                      >
                        <SelectTrigger id="memory">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="128">128 MB</SelectItem>
                          <SelectItem value="256">256 MB</SelectItem>
                          <SelectItem value="512">512 MB</SelectItem>
                          <SelectItem value="1024">1024 MB</SelectItem>
                          <SelectItem value="2048">2048 MB</SelectItem>
                          <SelectItem value="4096">4096 MB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="triggers" className="m-0 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Lambda Triggers</h4>
                  <Button size="sm" onClick={() => setTriggerDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Trigger
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100%-3rem)]">
                  <div className="space-y-2">
                    {selectedLambda.triggers.map((trigger) => {
                      const triggerType = TRIGGER_TYPES.find((t) => t.value === trigger.type)
                      const Icon = triggerType?.icon || Lightning

                      return (
                        <Card key={trigger.id}>
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon size={20} weight="duotone" />
                                <CardTitle className="text-sm capitalize">
                                  {trigger.type}
                                </CardTitle>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTrigger(trigger.id)}
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}

                    {selectedLambda.triggers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lightning size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                        <p className="text-sm">No triggers configured</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="environment" className="m-0 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Environment Variables</h4>
                  <Button size="sm" onClick={handleAddEnvironmentVariable}>
                    <Plus size={16} className="mr-2" />
                    Add Variable
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100%-3rem)]">
                  <div className="space-y-2">
                    {Object.entries(selectedLambda.environment).map(([key, value]) => (
                      <Card key={key}>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <code className="text-sm font-semibold">{key}</code>
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {value}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEnvironmentVariable(key)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}

                    {Object.keys(selectedLambda.environment).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                        <p className="text-sm">No environment variables</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Code size={64} className="mx-auto mb-4 opacity-50" weight="duotone" />
              <p>Select a lambda to edit</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Lambda Function</DialogTitle>
            <DialogDescription>
              Create a new serverless lambda function
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lambda-name">Function Name</Label>
              <Input
                id="lambda-name"
                value={newLambdaName}
                onChange={(e) => setNewLambdaName(e.target.value)}
                placeholder="e.g., processUserData"
              />
            </div>
            <div>
              <Label htmlFor="lambda-description">Description</Label>
              <Textarea
                id="lambda-description"
                value={newLambdaDescription}
                onChange={(e) => setNewLambdaDescription(e.target.value)}
                placeholder="Describe what this lambda does"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="lambda-language">Language</Label>
              <Select
                value={newLambdaLanguage}
                onValueChange={(value: Lambda['language']) => setNewLambdaLanguage(value)}
              >
                <SelectTrigger id="lambda-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLambda}>Create Lambda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lambda Function</DialogTitle>
            <DialogDescription>Update the lambda function details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-lambda-name">Function Name</Label>
              <Input
                id="edit-lambda-name"
                value={newLambdaName}
                onChange={(e) => setNewLambdaName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-lambda-description">Description</Label>
              <Textarea
                id="edit-lambda-description"
                value={newLambdaDescription}
                onChange={(e) => setNewLambdaDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLambda}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={triggerDialogOpen} onOpenChange={setTriggerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trigger</DialogTitle>
            <DialogDescription>Configure a trigger for this lambda function</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={newTriggerType}
                onValueChange={(value: LambdaTrigger['type']) => setNewTriggerType(value)}
              >
                <SelectTrigger id="trigger-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTriggerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTrigger}>Add Trigger</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
