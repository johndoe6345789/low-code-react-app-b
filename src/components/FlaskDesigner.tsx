import { useState } from 'react'
import { FlaskBlueprint, FlaskEndpoint, FlaskParam, FlaskConfig } from '@/types/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash, Flask, Pencil } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface FlaskDesignerProps {
  config: FlaskConfig
  onConfigChange: (config: FlaskConfig | ((current: FlaskConfig) => FlaskConfig)) => void
}

export function FlaskDesigner({ config, onConfigChange }: FlaskDesignerProps) {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(
    config.blueprints[0]?.id || null
  )
  const [blueprintDialogOpen, setBlueprintDialogOpen] = useState(false)
  const [endpointDialogOpen, setEndpointDialogOpen] = useState(false)
  const [editingBlueprint, setEditingBlueprint] = useState<FlaskBlueprint | null>(null)
  const [editingEndpoint, setEditingEndpoint] = useState<FlaskEndpoint | null>(null)

  const selectedBlueprint = config.blueprints.find((b) => b.id === selectedBlueprintId)

  const handleAddBlueprint = () => {
    setEditingBlueprint({
      id: `blueprint-${Date.now()}`,
      name: '',
      urlPrefix: '/',
      endpoints: [],
      description: '',
    })
    setBlueprintDialogOpen(true)
  }

  const handleEditBlueprint = (blueprint: FlaskBlueprint) => {
    setEditingBlueprint({ ...blueprint })
    setBlueprintDialogOpen(true)
  }

  const handleSaveBlueprint = () => {
    if (!editingBlueprint) return

    onConfigChange((current) => {
      const existingIndex = current.blueprints.findIndex((b) => b.id === editingBlueprint.id)
      if (existingIndex >= 0) {
        const updated = [...current.blueprints]
        updated[existingIndex] = editingBlueprint
        return { ...current, blueprints: updated }
      } else {
        return { ...current, blueprints: [...current.blueprints, editingBlueprint] }
      }
    })

    setSelectedBlueprintId(editingBlueprint.id)
    setBlueprintDialogOpen(false)
    setEditingBlueprint(null)
  }

  const handleDeleteBlueprint = (blueprintId: string) => {
    onConfigChange((current) => ({
      ...current,
      blueprints: current.blueprints.filter((b) => b.id !== blueprintId),
    }))
    if (selectedBlueprintId === blueprintId) {
      setSelectedBlueprintId(null)
    }
  }

  const handleAddEndpoint = () => {
    setEditingEndpoint({
      id: `endpoint-${Date.now()}`,
      path: '/',
      method: 'GET',
      name: '',
      description: '',
      queryParams: [],
      pathParams: [],
      authentication: false,
      corsEnabled: true,
    })
    setEndpointDialogOpen(true)
  }

  const handleEditEndpoint = (endpoint: FlaskEndpoint) => {
    setEditingEndpoint({ ...endpoint })
    setEndpointDialogOpen(true)
  }

  const handleSaveEndpoint = () => {
    if (!editingEndpoint || !selectedBlueprintId) return

    onConfigChange((current) => {
      const blueprints = [...current.blueprints]
      const blueprintIndex = blueprints.findIndex((b) => b.id === selectedBlueprintId)
      if (blueprintIndex >= 0) {
        const blueprint = { ...blueprints[blueprintIndex] }
        const endpointIndex = blueprint.endpoints.findIndex((e) => e.id === editingEndpoint.id)
        
        if (endpointIndex >= 0) {
          blueprint.endpoints[endpointIndex] = editingEndpoint
        } else {
          blueprint.endpoints.push(editingEndpoint)
        }
        
        blueprints[blueprintIndex] = blueprint
      }
      return { ...current, blueprints }
    })

    setEndpointDialogOpen(false)
    setEditingEndpoint(null)
  }

  const handleDeleteEndpoint = (endpointId: string) => {
    if (!selectedBlueprintId) return

    onConfigChange((current) => {
      const blueprints = [...current.blueprints]
      const blueprintIndex = blueprints.findIndex((b) => b.id === selectedBlueprintId)
      if (blueprintIndex >= 0) {
        blueprints[blueprintIndex] = {
          ...blueprints[blueprintIndex],
          endpoints: blueprints[blueprintIndex].endpoints.filter((e) => e.id !== endpointId),
        }
      }
      return { ...current, blueprints }
    })
  }

  const addQueryParam = () => {
    if (!editingEndpoint) return
    setEditingEndpoint({
      ...editingEndpoint,
      queryParams: [
        ...(editingEndpoint.queryParams || []),
        { id: `param-${Date.now()}`, name: '', type: 'string', required: false },
      ],
    })
  }

  const removeQueryParam = (paramId: string) => {
    if (!editingEndpoint) return
    setEditingEndpoint({
      ...editingEndpoint,
      queryParams: editingEndpoint.queryParams?.filter((p) => p.id !== paramId) || [],
    })
  }

  const updateQueryParam = (paramId: string, updates: Partial<FlaskParam>) => {
    if (!editingEndpoint) return
    setEditingEndpoint({
      ...editingEndpoint,
      queryParams:
        editingEndpoint.queryParams?.map((p) => (p.id === paramId ? { ...p, ...updates } : p)) || [],
    })
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
      case 'POST':
        return 'bg-green-500/10 text-green-500 border-green-500/30'
      case 'PUT':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
      case 'DELETE':
        return 'bg-red-500/10 text-red-500 border-red-500/30'
      case 'PATCH':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Flask size={24} weight="duotone" className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Flask Backend Designer</h2>
              <p className="text-sm text-muted-foreground">
                Design REST API endpoints and blueprints
              </p>
            </div>
          </div>
          <Button onClick={handleAddBlueprint}>
            <Plus size={16} className="mr-2" />
            New Blueprint
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Blueprints</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {config.blueprints.map((blueprint) => (
                <div
                  key={blueprint.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBlueprintId === blueprint.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted border border-transparent'
                  }`}
                  onClick={() => setSelectedBlueprintId(blueprint.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{blueprint.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {blueprint.urlPrefix}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {blueprint.endpoints.length} endpoints
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditBlueprint(blueprint)
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBlueprint(blueprint.id)
                        }}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedBlueprint ? (
            <>
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedBlueprint.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedBlueprint.description || 'No description'}
                    </p>
                  </div>
                  <Button onClick={handleAddEndpoint}>
                    <Plus size={16} className="mr-2" />
                    New Endpoint
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4 max-w-4xl">
                  {selectedBlueprint.endpoints.map((endpoint) => (
                    <Card key={endpoint.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getMethodColor(endpoint.method)}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">
                                {selectedBlueprint.urlPrefix}
                                {endpoint.path}
                              </code>
                            </div>
                            <CardTitle className="text-base">{endpoint.name}</CardTitle>
                            <CardDescription>{endpoint.description}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditEndpoint(endpoint)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeleteEndpoint(endpoint.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          {endpoint.authentication && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">🔒 Authentication Required</Badge>
                            </div>
                          )}
                          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                            <div>
                              <p className="font-semibold mb-1">Query Parameters:</p>
                              <div className="space-y-1">
                                {endpoint.queryParams.map((param) => (
                                  <div key={param.id} className="flex items-center gap-2 text-xs">
                                    <code className="text-primary">{param.name}</code>
                                    <Badge variant="secondary" className="text-xs">
                                      {param.type}
                                    </Badge>
                                    {param.required && (
                                      <Badge variant="outline" className="text-xs">
                                        required
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {selectedBlueprint.endpoints.length === 0 && (
                    <Card className="p-12 text-center">
                      <p className="text-muted-foreground">No endpoints yet</p>
                      <Button variant="link" onClick={handleAddEndpoint} className="mt-2">
                        Create your first endpoint
                      </Button>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Flask size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a blueprint or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={blueprintDialogOpen} onOpenChange={setBlueprintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBlueprint?.name ? 'Edit Blueprint' : 'New Blueprint'}
            </DialogTitle>
            <DialogDescription>Configure your Flask blueprint</DialogDescription>
          </DialogHeader>
          {editingBlueprint && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="blueprint-name">Blueprint Name</Label>
                <Input
                  id="blueprint-name"
                  value={editingBlueprint.name}
                  onChange={(e) =>
                    setEditingBlueprint({ ...editingBlueprint, name: e.target.value })
                  }
                  placeholder="e.g., users, auth, products"
                />
              </div>
              <div>
                <Label htmlFor="blueprint-prefix">URL Prefix</Label>
                <Input
                  id="blueprint-prefix"
                  value={editingBlueprint.urlPrefix}
                  onChange={(e) =>
                    setEditingBlueprint({ ...editingBlueprint, urlPrefix: e.target.value })
                  }
                  placeholder="/api/v1"
                />
              </div>
              <div>
                <Label htmlFor="blueprint-description">Description</Label>
                <Textarea
                  id="blueprint-description"
                  value={editingBlueprint.description}
                  onChange={(e) =>
                    setEditingBlueprint({ ...editingBlueprint, description: e.target.value })
                  }
                  placeholder="What does this blueprint handle?"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlueprintDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBlueprint}>Save Blueprint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={endpointDialogOpen} onOpenChange={setEndpointDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingEndpoint?.name ? 'Edit Endpoint' : 'New Endpoint'}
            </DialogTitle>
            <DialogDescription>Configure your API endpoint</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {editingEndpoint && (
              <div className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="params">Parameters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="endpoint-name">Endpoint Name</Label>
                      <Input
                        id="endpoint-name"
                        value={editingEndpoint.name}
                        onChange={(e) =>
                          setEditingEndpoint({ ...editingEndpoint, name: e.target.value })
                        }
                        placeholder="e.g., Get User List"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="endpoint-method">Method</Label>
                        <Select
                          value={editingEndpoint.method}
                          onValueChange={(value: any) =>
                            setEditingEndpoint({ ...editingEndpoint, method: value })
                          }
                        >
                          <SelectTrigger id="endpoint-method">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="endpoint-path">Path</Label>
                        <Input
                          id="endpoint-path"
                          value={editingEndpoint.path}
                          onChange={(e) =>
                            setEditingEndpoint({ ...editingEndpoint, path: e.target.value })
                          }
                          placeholder="/users"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="endpoint-description">Description</Label>
                      <Textarea
                        id="endpoint-description"
                        value={editingEndpoint.description}
                        onChange={(e) =>
                          setEditingEndpoint({ ...editingEndpoint, description: e.target.value })
                        }
                        placeholder="What does this endpoint do?"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="endpoint-auth">Require Authentication</Label>
                        <Switch
                          id="endpoint-auth"
                          checked={editingEndpoint.authentication}
                          onCheckedChange={(checked) =>
                            setEditingEndpoint({ ...editingEndpoint, authentication: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="endpoint-cors">Enable CORS</Label>
                        <Switch
                          id="endpoint-cors"
                          checked={editingEndpoint.corsEnabled}
                          onCheckedChange={(checked) =>
                            setEditingEndpoint({ ...editingEndpoint, corsEnabled: checked })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="params" className="space-y-4 mt-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>Query Parameters</Label>
                        <Button size="sm" variant="outline" onClick={addQueryParam}>
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editingEndpoint.queryParams?.map((param) => (
                          <Card key={param.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Parameter name"
                                  value={param.name}
                                  onChange={(e) =>
                                    updateQueryParam(param.id, { name: e.target.value })
                                  }
                                  className="flex-1"
                                />
                                <Select
                                  value={param.type}
                                  onValueChange={(value: any) =>
                                    updateQueryParam(param.id, { type: value })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="string">string</SelectItem>
                                    <SelectItem value="number">number</SelectItem>
                                    <SelectItem value="boolean">boolean</SelectItem>
                                    <SelectItem value="array">array</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeQueryParam(param.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={param.required}
                                  onCheckedChange={(checked) =>
                                    updateQueryParam(param.id, { required: checked })
                                  }
                                />
                                <Label className="text-xs">Required</Label>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {(!editingEndpoint.queryParams ||
                          editingEndpoint.queryParams.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No query parameters defined
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEndpointDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEndpoint}>Save Endpoint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
