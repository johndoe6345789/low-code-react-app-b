import { useState, useCallback, useRef, useEffect } from 'react'
import { Workflow, WorkflowNode, WorkflowConnection } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  FlowArrow,
  Play,
  Pause,
  Sparkle,
  Code,
  Database,
  Plugs,
  GitBranch,
  Lightning,
  Copy,
  Pencil,
  Link,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import Editor from '@monaco-editor/react'

interface WorkflowDesignerProps {
  workflows: Workflow[]
  onWorkflowsChange: (updater: (workflows: Workflow[]) => Workflow[]) => void
}

const NODE_TYPES = [
  { value: 'trigger', label: 'Trigger', icon: Lightning, color: 'text-yellow-500' },
  { value: 'action', label: 'Action', icon: Play, color: 'text-blue-500' },
  { value: 'condition', label: 'Condition', icon: GitBranch, color: 'text-purple-500' },
  { value: 'transform', label: 'Transform', icon: Code, color: 'text-green-500' },
  { value: 'lambda', label: 'Lambda', icon: Code, color: 'text-orange-500' },
  { value: 'api', label: 'API', icon: Plugs, color: 'text-cyan-500' },
  { value: 'database', label: 'Database', icon: Database, color: 'text-pink-500' },
]

export function WorkflowDesigner({ workflows, onWorkflowsChange }: WorkflowDesignerProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    workflows[0]?.id || null
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createNodeDialogOpen, setCreateNodeDialogOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')
  const [newNodeType, setNewNodeType] = useState<WorkflowNode['type']>('action')
  const [newNodeName, setNewNodeName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId)
  const selectedNode = selectedWorkflow?.nodes.find((n) => n.id === selectedNodeId)

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error('Please enter a workflow name')
      return
    }

    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: newWorkflowName,
      description: newWorkflowDescription,
      nodes: [],
      connections: [],
      isActive: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onWorkflowsChange((current) => [...current, newWorkflow])
    setSelectedWorkflowId(newWorkflow.id)
    setNewWorkflowName('')
    setNewWorkflowDescription('')
    setCreateDialogOpen(false)
    toast.success('Workflow created')
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      onWorkflowsChange((current) => current.filter((w) => w.id !== workflowId))
      if (selectedWorkflowId === workflowId) {
        setSelectedWorkflowId(workflows.find((w) => w.id !== workflowId)?.id || null)
      }
      toast.success('Workflow deleted')
    }
  }

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const duplicatedWorkflow: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      nodes: workflow.nodes.map((node) => ({ ...node, id: `node-${Date.now()}-${node.id}` })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onWorkflowsChange((current) => [...current, duplicatedWorkflow])
    setSelectedWorkflowId(duplicatedWorkflow.id)
    toast.success('Workflow duplicated')
  }

  const handleToggleActive = (workflowId: string) => {
    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === workflowId ? { ...w, isActive: !w.isActive, updatedAt: Date.now() } : w
      )
    )
    toast.success(selectedWorkflow?.isActive ? 'Workflow deactivated' : 'Workflow activated')
  }

  const handleAddNode = () => {
    if (!selectedWorkflowId || !newNodeName.trim()) {
      toast.error('Please enter a node name')
      return
    }

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      name: newNodeName,
      position: { x: 100, y: 100 },
      data: {},
      config: {},
    }

    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === selectedWorkflowId
          ? { ...w, nodes: [...w.nodes, newNode], updatedAt: Date.now() }
          : w
      )
    )

    setNewNodeName('')
    setCreateNodeDialogOpen(false)
    toast.success('Node added')
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedWorkflowId) return

    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === selectedWorkflowId
          ? {
              ...w,
              nodes: w.nodes.filter((n) => n.id !== nodeId),
              connections: w.connections.filter(
                (c) => c.source !== nodeId && c.target !== nodeId
              ),
              updatedAt: Date.now(),
            }
          : w
      )
    )

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
    toast.success('Node deleted')
  }

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (!selectedWorkflow) return
    const node = selectedWorkflow.nodes.find((n) => n.id === nodeId)
    if (!node) return

    setSelectedNodeId(nodeId)
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedNodeId || !selectedWorkflowId) return

      onWorkflowsChange((current) =>
        current.map((w) =>
          w.id === selectedWorkflowId
            ? {
                ...w,
                nodes: w.nodes.map((n) =>
                  n.id === selectedNodeId
                    ? {
                        ...n,
                        position: {
                          x: e.clientX - dragOffset.x,
                          y: e.clientY - dragOffset.y,
                        },
                      }
                    : n
                ),
              }
            : w
        )
      )
    },
    [isDragging, selectedNodeId, selectedWorkflowId, dragOffset, onWorkflowsChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleStartConnection = (nodeId: string) => {
    setConnectingFrom(nodeId)
  }

  const handleEndConnection = (targetNodeId: string) => {
    if (!connectingFrom || !selectedWorkflowId || connectingFrom === targetNodeId) {
      setConnectingFrom(null)
      return
    }

    const newConnection: WorkflowConnection = {
      id: `conn-${Date.now()}`,
      source: connectingFrom,
      target: targetNodeId,
    }

    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === selectedWorkflowId
          ? { ...w, connections: [...w.connections, newConnection], updatedAt: Date.now() }
          : w
      )
    )

    setConnectingFrom(null)
    toast.success('Nodes connected')
  }

  const handleDeleteConnection = (connectionId: string) => {
    if (!selectedWorkflowId) return

    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === selectedWorkflowId
          ? {
              ...w,
              connections: w.connections.filter((c) => c.id !== connectionId),
              updatedAt: Date.now(),
            }
          : w
      )
    )
    toast.success('Connection deleted')
  }

  const handleUpdateNodeConfig = (field: string, value: any) => {
    if (!selectedNodeId || !selectedWorkflowId) return

    onWorkflowsChange((current) =>
      current.map((w) =>
        w.id === selectedWorkflowId
          ? {
              ...w,
              nodes: w.nodes.map((n) =>
                n.id === selectedNodeId
                  ? { ...n, config: { ...n.config, [field]: value } }
                  : n
              ),
              updatedAt: Date.now(),
            }
          : w
      )
    )
  }

  const getNodeIcon = (type: WorkflowNode['type']) => {
    const nodeType = NODE_TYPES.find((t) => t.value === type)
    return nodeType?.icon || Code
  }

  const getNodeColor = (type: WorkflowNode['type']) => {
    const nodeType = NODE_TYPES.find((t) => t.value === type)
    return nodeType?.color || 'text-gray-500'
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FlowArrow size={20} weight="duotone" />
            Workflows
          </h2>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className={`cursor-pointer transition-all ${
                  selectedWorkflowId === workflow.id
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedWorkflowId(workflow.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm truncate">{workflow.name}</CardTitle>
                        <Badge
                          variant={workflow.isActive ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {workflow.description && (
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {workflow.description}
                        </CardDescription>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {workflow.nodes.length} nodes
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {workflow.connections.length} connections
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(workflow.id)}
                      title={workflow.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {workflow.isActive ? <Pause size={14} /> : <Play size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicateWorkflow(workflow)}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
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

        {workflows.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FlowArrow size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
              <p className="text-sm">No workflows yet</p>
              <Button size="sm" className="mt-2" onClick={() => setCreateDialogOpen(true)}>
                Create First Workflow
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {selectedWorkflow ? (
            <>
              <div className="border-b border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedWorkflow.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkflow.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCreateNodeDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Node
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedWorkflow.isActive ? 'default' : 'outline'}
                    onClick={() => handleToggleActive(selectedWorkflow.id)}
                  >
                    {selectedWorkflow.isActive ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div
                ref={canvasRef}
                className="flex-1 bg-muted/20 relative overflow-auto"
                style={{
                  backgroundImage: `radial-gradient(circle, var(--color-border) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              >
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                  {selectedWorkflow.connections.map((conn) => {
                    const sourceNode = selectedWorkflow.nodes.find((n) => n.id === conn.source)
                    const targetNode = selectedWorkflow.nodes.find((n) => n.id === conn.target)
                    if (!sourceNode || !targetNode) return null

                    const x1 = sourceNode.position.x + 120
                    const y1 = sourceNode.position.y + 40
                    const x2 = targetNode.position.x
                    const y2 = targetNode.position.y + 40

                    return (
                      <g key={conn.id}>
                        <path
                          d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          fill="none"
                          markerEnd="url(#arrowhead)"
                        />
                        <circle
                          cx={(x1 + x2) / 2}
                          cy={(y1 + y2) / 2}
                          r="8"
                          fill="hsl(var(--destructive))"
                          className="cursor-pointer pointer-events-auto"
                          onClick={() => handleDeleteConnection(conn.id)}
                        >
                          <title>Click to delete connection</title>
                        </circle>
                      </g>
                    )
                  })}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                    </marker>
                  </defs>
                </svg>

                {selectedWorkflow.nodes.map((node) => {
                  const Icon = getNodeIcon(node.type)
                  const color = getNodeColor(node.type)

                  return (
                    <Card
                      key={node.id}
                      className={`absolute w-60 cursor-move ${
                        selectedNodeId === node.id ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon size={20} className={color} weight="duotone" />
                          <CardTitle className="text-sm truncate flex-1">{node.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNode(node.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Trash size={12} />
                          </Button>
                        </div>
                        <CardDescription className="text-xs capitalize">
                          {node.type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartConnection(node.id)
                          }}
                          className="flex-1"
                          disabled={connectingFrom !== null}
                        >
                          <Link size={14} className="mr-1" />
                          Connect
                        </Button>
                        {connectingFrom && connectingFrom !== node.id && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEndConnection(node.id)
                            }}
                            className="flex-1"
                          >
                            <Link size={14} className="mr-1" />
                            Link Here
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {selectedWorkflow.nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FlowArrow size={64} className="mx-auto mb-4 opacity-50" weight="duotone" />
                      <p>No nodes yet</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => setCreateNodeDialogOpen(true)}
                      >
                        Add First Node
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FlowArrow size={64} className="mx-auto mb-4 opacity-50" weight="duotone" />
                <p>Select a workflow to edit</p>
              </div>
            </div>
          )}
        </div>

        {selectedNode && selectedWorkflow && (
          <div className="w-96 border-l border-border bg-card p-4 overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Node Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedNode.name}</p>
              </div>

              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div>
                    <Label>Node Type</Label>
                    <Input value={selectedNode.type} disabled className="capitalize" />
                  </div>
                  <div>
                    <Label>Node Name</Label>
                    <Input
                      value={selectedNode.name}
                      onChange={(e) => {
                        onWorkflowsChange((current) =>
                          current.map((w) =>
                            w.id === selectedWorkflowId
                              ? {
                                  ...w,
                                  nodes: w.nodes.map((n) =>
                                    n.id === selectedNode.id ? { ...n, name: e.target.value } : n
                                  ),
                                }
                              : w
                          )
                        )
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="config" className="space-y-4">
                  {selectedNode.type === 'lambda' && (
                    <div>
                      <Label>Lambda Code</Label>
                      <div className="border border-border rounded-md overflow-hidden mt-2">
                        <Editor
                          height="300px"
                          defaultLanguage="javascript"
                          value={selectedNode.config?.lambdaCode || '// Write your lambda code here\n'}
                          onChange={(value) => handleUpdateNodeConfig('lambdaCode', value || '')}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.type === 'api' && (
                    <>
                      <div>
                        <Label>HTTP Method</Label>
                        <Select
                          value={selectedNode.config?.httpMethod || 'GET'}
                          onValueChange={(value) => handleUpdateNodeConfig('httpMethod', value)}
                        >
                          <SelectTrigger>
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
                        <Label>API Endpoint</Label>
                        <Input
                          value={selectedNode.config?.apiEndpoint || ''}
                          onChange={(e) => handleUpdateNodeConfig('apiEndpoint', e.target.value)}
                          placeholder="https://api.example.com/endpoint"
                        />
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'condition' && (
                    <div>
                      <Label>Condition Expression</Label>
                      <Textarea
                        value={selectedNode.config?.condition || ''}
                        onChange={(e) => handleUpdateNodeConfig('condition', e.target.value)}
                        placeholder="e.g., data.status === 'active'"
                        rows={4}
                      />
                    </div>
                  )}

                  {selectedNode.type === 'transform' && (
                    <div>
                      <Label>Transform Script</Label>
                      <div className="border border-border rounded-md overflow-hidden mt-2">
                        <Editor
                          height="300px"
                          defaultLanguage="javascript"
                          value={
                            selectedNode.config?.transformScript ||
                            '// Transform the data\nreturn data;'
                          }
                          onChange={(value) =>
                            handleUpdateNodeConfig('transformScript', value || '')
                          }
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.type === 'database' && (
                    <div>
                      <Label>Database Query</Label>
                      <Textarea
                        value={selectedNode.config?.databaseQuery || ''}
                        onChange={(e) => handleUpdateNodeConfig('databaseQuery', e.target.value)}
                        placeholder="SELECT * FROM users WHERE id = $1"
                        rows={4}
                      />
                    </div>
                  )}

                  {selectedNode.type === 'trigger' && (
                    <>
                      <div>
                        <Label>Trigger Type</Label>
                        <Select
                          value={selectedNode.config?.triggerType || 'manual'}
                          onValueChange={(value) => handleUpdateNodeConfig('triggerType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="schedule">Schedule</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedNode.config?.triggerType === 'schedule' && (
                        <div>
                          <Label>Schedule Expression (Cron)</Label>
                          <Input
                            value={selectedNode.config?.scheduleExpression || ''}
                            onChange={(e) =>
                              handleUpdateNodeConfig('scheduleExpression', e.target.value)
                            }
                            placeholder="0 0 * * *"
                          />
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
            <DialogDescription>Create a new workflow to automate your processes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="e.g., User Registration Flow"
              />
            </div>
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
                placeholder="Describe what this workflow does"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createNodeDialogOpen} onOpenChange={setCreateNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
            <DialogDescription>Add a new node to your workflow</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-type">Node Type</Label>
              <Select
                value={newNodeType}
                onValueChange={(value: WorkflowNode['type']) => setNewNodeType(value)}
              >
                <SelectTrigger id="node-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NODE_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={type.color} />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="node-name">Node Name</Label>
              <Input
                id="node-name"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="e.g., Send Welcome Email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateNodeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNode}>Add Node</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
