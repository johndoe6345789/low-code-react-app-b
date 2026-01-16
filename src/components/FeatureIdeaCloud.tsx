import { useState, useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection as RFConnection,
  MarkerType,
  ConnectionMode,
  Panel,
  NodeProps,
  Handle,
  Position,
  reconnectEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash, Sparkle, DotsThree, Package } from '@phosphor-icons/react'
import { toast } from 'sonner'

type ConnectionType = 'dependency' | 'association' | 'inheritance' | 'composition' | 'aggregation'

interface FeatureIdea {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planned' | 'in-progress' | 'completed'
  createdAt: number
  parentGroup?: string
}

interface IdeaGroup {
  id: string
  label: string
  color: string
  createdAt: number
}

interface IdeaEdgeData {
  type: ConnectionType
  label?: string
}

const SEED_IDEAS: FeatureIdea[] = [
  {
    id: 'idea-1',
    title: 'AI Code Assistant',
    description: 'Integrate an AI assistant that can suggest code improvements and answer questions',
    category: 'AI/ML',
    priority: 'high',
    status: 'completed',
    createdAt: Date.now() - 10000000,
  },
  {
    id: 'idea-2',
    title: 'Real-time Collaboration',
    description: 'Allow multiple developers to work on the same project simultaneously',
    category: 'Collaboration',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 9000000,
  },
  {
    id: 'idea-3',
    title: 'Component Marketplace',
    description: 'A marketplace where users can share and download pre-built components',
    category: 'Community',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 8000000,
  },
  {
    id: 'idea-4',
    title: 'Visual Git Integration',
    description: 'Git operations through a visual interface with branch visualization',
    category: 'DevOps',
    priority: 'high',
    status: 'planned',
    createdAt: Date.now() - 7000000,
  },
  {
    id: 'idea-5',
    title: 'API Mock Server',
    description: 'Built-in mock server for testing API integrations',
    category: 'Testing',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 6000000,
  },
  {
    id: 'idea-6',
    title: 'Performance Profiler',
    description: 'Analyze and optimize application performance with visual metrics',
    category: 'Performance',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 5000000,
  },
  {
    id: 'idea-7',
    title: 'Theme Presets',
    description: 'Pre-designed theme templates for quick project setup',
    category: 'Design',
    priority: 'low',
    status: 'completed',
    createdAt: Date.now() - 4000000,
  },
  {
    id: 'idea-8',
    title: 'Database Schema Migrations',
    description: 'Visual tool for creating and managing database migrations',
    category: 'Database',
    priority: 'high',
    status: 'in-progress',
    createdAt: Date.now() - 3000000,
  },
  {
    id: 'idea-9',
    title: 'Mobile App Preview',
    description: 'Live preview on actual mobile devices or simulators',
    category: 'Mobile',
    priority: 'medium',
    status: 'planned',
    createdAt: Date.now() - 2000000,
  },
  {
    id: 'idea-10',
    title: 'Accessibility Checker',
    description: 'Automated accessibility testing and suggestions',
    category: 'Accessibility',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 1000000,
  },
]

const CATEGORIES = ['AI/ML', 'Collaboration', 'Community', 'DevOps', 'Testing', 'Performance', 'Design', 'Database', 'Mobile', 'Accessibility', 'Productivity', 'Security', 'Analytics', 'Other']
const PRIORITIES = ['low', 'medium', 'high'] as const
const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const
const CONNECTION_TYPES = ['dependency', 'association', 'inheritance', 'composition', 'aggregation'] as const

const CONNECTION_STYLES = {
  dependency: { stroke: '#70c0ff', strokeDasharray: '8,4', strokeWidth: 2.5, markerEnd: MarkerType.ArrowClosed },
  association: { stroke: '#a78bfa', strokeDasharray: '', strokeWidth: 2.5, markerEnd: MarkerType.Arrow },
  inheritance: { stroke: '#60d399', strokeDasharray: '', strokeWidth: 2.5, markerEnd: MarkerType.ArrowClosed },
  composition: { stroke: '#f87171', strokeDasharray: '', strokeWidth: 2.5, markerEnd: MarkerType.ArrowClosed },
  aggregation: { stroke: '#facc15', strokeDasharray: '', strokeWidth: 2.5, markerEnd: MarkerType.Arrow },
}

const CONNECTION_LABELS = {
  dependency: 'depends on',
  association: 'relates to',
  inheritance: 'extends',
  composition: 'contains',
  aggregation: 'has',
}

const STATUS_COLORS = {
  idea: 'bg-muted text-muted-foreground',
  planned: 'bg-accent text-accent-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
  completed: 'bg-green-600 text-white',
}

const PRIORITY_COLORS = {
  low: 'border-blue-400/60 bg-blue-50/80 dark:bg-blue-950/40',
  medium: 'border-amber-400/60 bg-amber-50/80 dark:bg-amber-950/40',
  high: 'border-red-400/60 bg-red-50/80 dark:bg-red-950/40',
}

const GROUP_COLORS = [
  { name: 'Blue', value: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Purple', value: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)' },
  { name: 'Green', value: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Red', value: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.3)' },
  { name: 'Orange', value: '#f97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.3)' },
  { name: 'Pink', value: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.3)' },
  { name: 'Cyan', value: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.3)' },
  { name: 'Amber', value: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.3)' },
]

function GroupNode({ data, selected }: NodeProps<IdeaGroup>) {
  const colorScheme = GROUP_COLORS.find(c => c.value === data.color) || GROUP_COLORS[0]
  
  return (
    <div 
      className="rounded-2xl backdrop-blur-sm transition-all"
      style={{
        width: 450,
        height: 350,
        backgroundColor: colorScheme.bg,
        border: `3px dashed ${colorScheme.border}`,
        boxShadow: selected ? `0 0 0 2px ${colorScheme.value}` : 'none',
      }}
    >
      <div 
        className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md"
        style={{
          backgroundColor: colorScheme.value,
          color: 'white',
        }}
      >
        {data.label}
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md bg-background hover:bg-destructive hover:text-destructive-foreground"
        onClick={(e) => {
          e.stopPropagation()
          const event = new CustomEvent('editGroup', { detail: data })
          window.dispatchEvent(event)
        }}
      >
        <DotsThree size={16} />
      </Button>
    </div>
  )
}

function IdeaNode({ data, selected }: NodeProps<FeatureIdea>) {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      
      <Card className={`p-4 shadow-xl hover:shadow-2xl transition-all border-2 ${PRIORITY_COLORS[data.priority]} w-[240px] ${selected ? 'ring-2 ring-primary' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{data.title}</h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                const event = new CustomEvent('editIdea', { detail: data })
                window.dispatchEvent(event)
              }}
            >
              <DotsThree size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {data.category}
            </Badge>
            <Badge className={`text-xs ${STATUS_COLORS[data.status]}`}>
              {data.status}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

const nodeTypes = {
  ideaNode: IdeaNode,
  groupNode: GroupNode,
}

export function FeatureIdeaCloud() {
  const [ideas, setIdeas] = useKV<FeatureIdea[]>('feature-ideas', SEED_IDEAS)
  const [groups, setGroups] = useKV<IdeaGroup[]>('feature-idea-groups', [])
  const [savedEdges, setSavedEdges] = useKV<Edge<IdeaEdgeData>[]>('feature-idea-edges', [
    {
      id: 'edge-1',
      source: 'idea-1',
      target: 'idea-8',
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'default',
      animated: true,
      data: { type: 'dependency', label: 'requires' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#70c0ff', width: 20, height: 20 },
      style: { stroke: '#70c0ff', strokeDasharray: '8,4', strokeWidth: 2.5 },
    },
    {
      id: 'edge-2',
      source: 'idea-2',
      target: 'idea-4',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'default',
      data: { type: 'association', label: 'works with' },
      markerEnd: { type: MarkerType.Arrow, color: '#a78bfa', width: 20, height: 20 },
      style: { stroke: '#a78bfa', strokeWidth: 2.5 },
    },
    {
      id: 'edge-3',
      source: 'idea-8',
      target: 'idea-5',
      sourceHandle: 'bottom',
      targetHandle: 'left',
      type: 'default',
      data: { type: 'composition', label: 'includes' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f87171', width: 20, height: 20 },
      style: { stroke: '#f87171', strokeWidth: 2.5 },
    },
  ])
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedIdea, setSelectedIdea] = useState<FeatureIdea | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<IdeaGroup | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge<IdeaEdgeData> | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false)
  const [connectionType, setConnectionType] = useState<ConnectionType>('association')
  const edgeReconnectSuccessful = useRef(true)

  const safeIdeas = ideas || SEED_IDEAS
  const safeGroups = groups || []
  const safeEdges = savedEdges || []

  useEffect(() => {
    if (!ideas || ideas.length === 0) {
      setIdeas(SEED_IDEAS)
    }
  }, [ideas, setIdeas])

  useEffect(() => {
    const groupNodes: Node<IdeaGroup>[] = safeGroups.map((group) => ({
      id: group.id,
      type: 'groupNode',
      position: { x: 0, y: 0 },
      data: group,
      style: {
        zIndex: -1,
      },
    }))

    const ideaNodes: Node<FeatureIdea>[] = safeIdeas.map((idea, index) => ({
      id: idea.id,
      type: 'ideaNode',
      position: { x: 100 + (index % 3) * 350, y: 100 + Math.floor(index / 3) * 250 },
      data: idea,
      parentNode: idea.parentGroup,
      extent: idea.parentGroup ? 'parent' : undefined,
      style: {
        zIndex: 1,
      },
    }))

    setNodes([...groupNodes, ...ideaNodes])
  }, [safeIdeas, safeGroups, setNodes])

  useEffect(() => {
    setEdges(safeEdges)
  }, [safeEdges, setEdges])

  useEffect(() => {
    const handleEditIdea = (e: Event) => {
      const customEvent = e as CustomEvent<FeatureIdea>
      setSelectedIdea(customEvent.detail)
      setEditDialogOpen(true)
    }

    const handleEditGroup = (e: Event) => {
      const customEvent = e as CustomEvent<IdeaGroup>
      setSelectedGroup(customEvent.detail)
      setGroupDialogOpen(true)
    }

    window.addEventListener('editIdea', handleEditIdea)
    window.addEventListener('editGroup', handleEditGroup)
    return () => {
      window.removeEventListener('editIdea', handleEditIdea)
      window.removeEventListener('editGroup', handleEditGroup)
    }
  }, [])

  const onNodesChangeWrapper = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      const moveChange = changes.find((c: any) => c.type === 'position' && c.dragging === false)
      if (moveChange) {
        setTimeout(() => {
          setEdges((currentEdges) => {
            setSavedEdges(currentEdges)
            return currentEdges
          })
        }, 100)
      }
    },
    [onNodesChange, setEdges, setSavedEdges]
  )

  const onEdgesChangeWrapper = useCallback(
    (changes: any) => {
      onEdgesChange(changes)
      setTimeout(() => {
        setEdges((currentEdges) => {
          setSavedEdges(currentEdges)
          return currentEdges
        })
      }, 100)
    },
    [onEdgesChange, setEdges, setSavedEdges]
  )

  const onConnect = useCallback(
    (params: RFConnection) => {
      if (!params.source || !params.target) return
      
      const sourceNodeId = params.source
      const sourceHandleId = params.sourceHandle || 'default'
      const targetNodeId = params.target
      const targetHandleId = params.targetHandle || 'default'
      
      const edgesToRemove: string[] = []
      
      edges.forEach(edge => {
        const edgeSourceHandle = edge.sourceHandle || 'default'
        const edgeTargetHandle = edge.targetHandle || 'default'
        
        if (edge.source === sourceNodeId && edgeSourceHandle === sourceHandleId) {
          edgesToRemove.push(edge.id)
        }
        
        if (edge.target === sourceNodeId && edgeTargetHandle === sourceHandleId) {
          edgesToRemove.push(edge.id)
        }
        
        if (edge.source === targetNodeId && edgeSourceHandle === targetHandleId) {
          edgesToRemove.push(edge.id)
        }
        
        if (edge.target === targetNodeId && edgeTargetHandle === targetHandleId) {
          edgesToRemove.push(edge.id)
        }
      })
      
      setEdges((eds) => {
        const filteredEdges = eds.filter(e => !edgesToRemove.includes(e.id))
        
        const style = CONNECTION_STYLES[connectionType]
        const newEdge: Edge<IdeaEdgeData> = {
          id: `edge-${Date.now()}`,
          source: sourceNodeId,
          target: targetNodeId,
          ...(params.sourceHandle && { sourceHandle: params.sourceHandle }),
          ...(params.targetHandle && { targetHandle: params.targetHandle }),
          type: 'default',
          data: { type: connectionType, label: CONNECTION_LABELS[connectionType] },
          markerEnd: { 
            type: style.markerEnd, 
            color: style.stroke,
            width: 20,
            height: 20
          },
          style: { 
            stroke: style.stroke, 
            strokeDasharray: style.strokeDasharray,
            strokeWidth: style.strokeWidth
          },
          animated: connectionType === 'dependency',
        }
        
        const updatedEdges = addEdge(newEdge, filteredEdges)
        setSavedEdges(updatedEdges)
        return updatedEdges
      })
      
      if (edgesToRemove.length > 0) {
        toast.success(`Connection ${edgesToRemove.length > 0 ? 'remapped' : 'created'}! (${edgesToRemove.length} old connection${edgesToRemove.length > 1 ? 's' : ''} removed)`)
      } else {
        toast.success('Ideas connected!')
      }
    },
    [connectionType, edges, setEdges, setSavedEdges]
  )

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<IdeaEdgeData>) => {
    setSelectedEdge(edge)
    setEdgeDialogOpen(true)
  }, [])

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<FeatureIdea>) => {
    setSelectedIdea(node.data)
    setViewDialogOpen(true)
  }, [])

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const onReconnect = useCallback((oldEdge: Edge, newConnection: RFConnection) => {
    if (!newConnection.source || !newConnection.target) return
    
    const sourceNodeId = newConnection.source
    const sourceHandleId = newConnection.sourceHandle || 'default'
    const targetNodeId = newConnection.target
    const targetHandleId = newConnection.targetHandle || 'default'
    
    const edgesToRemove: string[] = []
    
    edges.forEach(edge => {
      if (edge.id === oldEdge.id) return
      
      const edgeSourceHandle = edge.sourceHandle || 'default'
      const edgeTargetHandle = edge.targetHandle || 'default'
      
      if (edge.source === sourceNodeId && edgeSourceHandle === sourceHandleId) {
        edgesToRemove.push(edge.id)
      }
      
      if (edge.target === sourceNodeId && edgeTargetHandle === sourceHandleId) {
        edgesToRemove.push(edge.id)
      }
      
      if (edge.source === targetNodeId && edgeSourceHandle === targetHandleId) {
        edgesToRemove.push(edge.id)
      }
      
      if (edge.target === targetNodeId && edgeTargetHandle === targetHandleId) {
        edgesToRemove.push(edge.id)
      }
    })
    
    edgeReconnectSuccessful.current = true
    
    setEdges((els) => {
      const filteredEdges = els.filter(e => !edgesToRemove.includes(e.id))
      const updatedEdges = reconnectEdge(oldEdge, newConnection, filteredEdges)
      setSavedEdges(updatedEdges)
      return updatedEdges
    })
    
    if (edgesToRemove.length > 0) {
      toast.success(`Connection remapped! (${edgesToRemove.length} conflicting connection${edgesToRemove.length > 1 ? 's' : ''} removed)`)
    } else {
      toast.success('Connection remapped!')
    }
  }, [edges, setEdges, setSavedEdges])

  const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => {
        const updatedEdges = eds.filter((e) => e.id !== edge.id)
        setSavedEdges(updatedEdges)
        return updatedEdges
      })
    }
    edgeReconnectSuccessful.current = true
  }, [setEdges, setSavedEdges])

  const handleAddIdea = () => {
    const newIdea: FeatureIdea = {
      id: `idea-${Date.now()}`,
      title: '',
      description: '',
      category: 'Other',
      priority: 'medium',
      status: 'idea',
      createdAt: Date.now(),
    }
    setSelectedIdea(newIdea)
    setEditDialogOpen(true)
  }

  const handleAddGroup = () => {
    const newGroup: IdeaGroup = {
      id: `group-${Date.now()}`,
      label: '',
      color: GROUP_COLORS[0].value,
      createdAt: Date.now(),
    }
    setSelectedGroup(newGroup)
    setGroupDialogOpen(true)
  }

  const handleSaveIdea = () => {
    if (!selectedIdea || !selectedIdea.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIdeas((currentIdeas) => {
      const existing = (currentIdeas || []).find(i => i.id === selectedIdea.id)
      if (existing) {
        return (currentIdeas || []).map(i => i.id === selectedIdea.id ? selectedIdea : i)
      } else {
        return [...(currentIdeas || []), selectedIdea]
      }
    })

    if (!(ideas || []).find(i => i.id === selectedIdea.id)) {
      const newNode: Node<FeatureIdea> = {
        id: selectedIdea.id,
        type: 'ideaNode',
        position: { x: 400, y: 300 },
        data: selectedIdea,
      }
      setNodes((nds) => [...nds, newNode])
    }

    setEditDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea saved!')
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas((currentIdeas) => (currentIdeas || []).filter(i => i.id !== id))
    setNodes((nds) => nds.filter(n => n.id !== id))
    
    const updatedEdges = edges.filter(e => e.source !== id && e.target !== id)
    setEdges(updatedEdges)
    setSavedEdges(updatedEdges)
    
    setEditDialogOpen(false)
    setViewDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea deleted')
  }

  const handleSaveGroup = () => {
    if (!selectedGroup || !selectedGroup.label.trim()) {
      toast.error('Please enter a group name')
      return
    }

    setGroups((currentGroups) => {
      const existing = (currentGroups || []).find(g => g.id === selectedGroup.id)
      if (existing) {
        return (currentGroups || []).map(g => g.id === selectedGroup.id ? selectedGroup : g)
      } else {
        return [...(currentGroups || []), selectedGroup]
      }
    })

    if (!(groups || []).find(g => g.id === selectedGroup.id)) {
      const newNode: Node<IdeaGroup> = {
        id: selectedGroup.id,
        type: 'groupNode',
        position: { x: 200, y: 200 },
        data: selectedGroup,
        style: {
          zIndex: -1,
        },
      }
      setNodes((nds) => [newNode, ...nds])
    }

    setGroupDialogOpen(false)
    setSelectedGroup(null)
    toast.success('Group saved!')
  }

  const handleDeleteGroup = (id: string) => {
    setIdeas((currentIdeas) =>
      (currentIdeas || []).map(idea =>
        idea.parentGroup === id ? { ...idea, parentGroup: undefined } : idea
      )
    )
    
    setGroups((currentGroups) => (currentGroups || []).filter(g => g.id !== id))
    setNodes((nds) => nds.filter(n => n.id !== id))
    
    setGroupDialogOpen(false)
    setSelectedGroup(null)
    toast.success('Group deleted')
  }

  const handleDeleteEdge = (edgeId: string) => {
    const updatedEdges = edges.filter(e => e.id !== edgeId)
    setEdges(updatedEdges)
    setSavedEdges(updatedEdges)
    setEdgeDialogOpen(false)
    setSelectedEdge(null)
    toast.success('Connection removed')
  }

  const handleSaveEdge = () => {
    if (selectedEdge) {
      const style = CONNECTION_STYLES[selectedEdge.data!.type]
      const updatedEdge = {
        ...selectedEdge,
        data: selectedEdge.data,
        markerEnd: { 
          type: style.markerEnd, 
          color: style.stroke,
          width: 20,
          height: 20
        },
        style: { 
          stroke: style.stroke, 
          strokeDasharray: style.strokeDasharray,
          strokeWidth: style.strokeWidth
        },
        animated: selectedEdge.data!.type === 'dependency',
      }
      
      const updatedEdges = edges.map(e => e.id === selectedEdge.id ? updatedEdge : e)
      setEdges(updatedEdges)
      setSavedEdges(updatedEdges)
      setEdgeDialogOpen(false)
      toast.success('Connection updated!')
    }
  }

  const handleGenerateIdeas = async () => {
    toast.info('Generating ideas with AI...')
    
    try {
      const categoryList = CATEGORIES.join('|')
      const promptText = `Generate 3 innovative feature ideas for a low-code application builder. Each idea should be practical and valuable. Return as JSON with this structure:
{
  "ideas": [
    {
      "title": "Feature Name",
      "description": "Brief description",
      "category": "${categoryList}",
      "priority": "low|medium|high"
    }
  ]
}`
      
      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const result = JSON.parse(response)
      
      if (result.ideas && Array.isArray(result.ideas)) {
        const newIdeas: FeatureIdea[] = result.ideas.map((idea: any) => ({
          id: `idea-ai-${Date.now()}-${Math.random()}`,
          title: idea.title,
          description: idea.description,
          category: idea.category || 'Other',
          priority: idea.priority || 'medium',
          status: 'idea' as const,
          createdAt: Date.now(),
        }))
        
        setIdeas((currentIdeas) => [...(currentIdeas || []), ...newIdeas])
        
        const newNodes: Node<FeatureIdea>[] = newIdeas.map((idea, index) => ({
          id: idea.id,
          type: 'ideaNode',
          position: { x: 400 + (index * 250), y: 300 + (index * 150) },
          data: idea,
        }))
        
        setNodes((nds) => [...nds, ...newNodes])
        toast.success(`Generated ${newIdeas.length} new ideas!`)
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error)
      toast.error('Failed to generate ideas')
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChangeWrapper}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onEdgeClick={onEdgeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        reconnectRadius={20}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
        <Controls showInteractive={false} />
        
        <Panel position="top-left" className="flex gap-2 items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md shadow-lg">
            <span className="text-xs font-medium text-muted-foreground">Connection Type:</span>
            <select
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
              className="text-sm bg-transparent border-none outline-none pr-1 font-medium"
              style={{ cursor: 'pointer' }}
            >
              {CONNECTION_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </Panel>

        <Panel position="top-right" className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleGenerateIdeas} variant="outline" className="shadow-lg">
                  <Sparkle size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Generate Ideas</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddGroup} variant="outline" className="shadow-lg">
                  <Package size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Group</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddIdea} className="shadow-lg">
                  <Plus size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Idea</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Panel>

        <Panel position="bottom-left">
          <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
            <p className="font-semibold mb-2 text-foreground">Connection Types:</p>
            <div className="space-y-1.5">
              {CONNECTION_TYPES.map(type => {
                const style = CONNECTION_STYLES[type]
                return (
                  <div key={type} className="flex items-center gap-2">
                    <svg width="50" height="12" className="shrink-0">
                      <defs>
                        <marker
                          id={`arrow-${type}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="8"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill={style.stroke} />
                        </marker>
                      </defs>
                      <line
                        x1="2"
                        y1="6"
                        x2="48"
                        y2="6"
                        stroke={style.stroke}
                        strokeWidth={2.5}
                        strokeDasharray={style.strokeDasharray}
                        markerEnd={`url(#arrow-${type})`}
                      />
                    </svg>
                    <span className="text-muted-foreground capitalize">{type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Panel>

        <Panel position="bottom-right">
          <div className="bg-card border border-border rounded-lg shadow-lg p-2 text-xs text-muted-foreground max-w-sm">
            <p className="mb-1">💡 <strong>Tip:</strong> Double-click ideas to view details</p>
            <p className="mb-1">📦 Create groups to organize related ideas</p>
            <p className="mb-1">🔗 Drag from handles on card edges to connect ideas</p>
            <p className="mb-1">↪️ Drag existing connection ends to remap them</p>
            <p>⚙️ Click connections to edit or delete them</p>
          </div>
        </Panel>
      </ReactFlow>

      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGroup?.label ? 'Edit Group' : 'New Group'}
            </DialogTitle>
            <DialogDescription>
              Create a container to organize related ideas
            </DialogDescription>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Group Name</label>
                <Input
                  value={selectedGroup.label}
                  onChange={(e) => setSelectedGroup({ ...selectedGroup, label: e.target.value })}
                  placeholder="e.g., Authentication Features"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {GROUP_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedGroup({ ...selectedGroup, color: color.value })}
                      className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedGroup.color === color.value
                          ? 'border-foreground ring-2 ring-primary'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">💡 Tips:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Groups provide visual organization for related ideas</li>
                  <li>• Drag ideas into groups or assign them in the idea editor</li>
                  <li>• Ideas stay within their group boundaries when moved</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {selectedGroup && groups?.find(g => g.id === selectedGroup.id) && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteGroup(selectedGroup.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveGroup}>
                  Save Group
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedIdea?.title ? 'Edit Idea' : 'New Idea'}
            </DialogTitle>
            <DialogDescription>
              Create or modify a feature idea for your app
            </DialogDescription>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={selectedIdea.title}
                  onChange={(e) => setSelectedIdea({ ...selectedIdea, title: e.target.value })}
                  placeholder="Feature name..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={selectedIdea.description}
                  onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
                  placeholder="Describe the feature..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select
                    value={selectedIdea.category}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, category: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <select
                    value={selectedIdea.priority}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, priority: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select
                    value={selectedIdea.status}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, status: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Group</label>
                <select
                  value={selectedIdea.parentGroup || ''}
                  onChange={(e) => setSelectedIdea({ ...selectedIdea, parentGroup: e.target.value || undefined })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">No group</option>
                  {safeGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {selectedIdea && ideas?.find(i => i.id === selectedIdea.id) && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteIdea(selectedIdea.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveIdea}>
                  Save Idea
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedIdea?.title}</DialogTitle>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedIdea.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <p className="text-sm font-medium">{selectedIdea.category}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <p className="text-sm font-medium capitalize">{selectedIdea.priority}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Badge className={`${STATUS_COLORS[selectedIdea.status]} mt-1`}>
                  {selectedIdea.status}
                </Badge>
              </div>

              {selectedIdea.parentGroup && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Group</label>
                  <p className="text-sm font-medium">
                    {safeGroups.find(g => g.id === selectedIdea.parentGroup)?.label || 'Unknown'}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Connections</label>
                <div className="space-y-2">
                  {edges
                    .filter(e => e.source === selectedIdea.id || e.target === selectedIdea.id)
                    .map(edge => {
                      const otherIdeaId = edge.source === selectedIdea.id ? edge.target : edge.source
                      const otherIdea = safeIdeas.find(i => i.id === otherIdeaId)
                      const isOutgoing = edge.source === selectedIdea.id
                      return (
                        <div key={edge.id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                          <Badge variant="outline" className="text-xs">{edge.data?.type || 'unknown'}</Badge>
                          <span className="flex-1">
                            {isOutgoing ? '→' : '←'} {otherIdea?.title || 'Unknown'}
                          </span>
                        </div>
                      )
                    })}
                  {edges.filter(e => e.source === selectedIdea.id || e.target === selectedIdea.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No connections</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false)
              setEditDialogOpen(true)
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={edgeDialogOpen} onOpenChange={setEdgeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>
              Manage the relationship between ideas
            </DialogDescription>
          </DialogHeader>

          {selectedEdge && selectedEdge.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <p className="text-sm font-medium">
                    {safeIdeas.find(i => i.id === selectedEdge.source)?.title}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <p className="text-sm font-medium">
                    {safeIdeas.find(i => i.id === selectedEdge.target)?.title}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  value={selectedEdge.data.type}
                  onChange={(e) => setSelectedEdge({ 
                    ...selectedEdge, 
                    data: {
                      ...selectedEdge.data!,
                      type: e.target.value as ConnectionType,
                      label: CONNECTION_LABELS[e.target.value as ConnectionType]
                    }
                  })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {CONNECTION_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Label</label>
                <Input
                  value={selectedEdge.data.label || ''}
                  onChange={(e) => setSelectedEdge({ 
                    ...selectedEdge, 
                    data: {
                      ...selectedEdge.data!,
                      label: e.target.value 
                    }
                  })}
                  placeholder={CONNECTION_LABELS[selectedEdge.data.type]}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-2">Connection Type Guide:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li><strong>Dependency:</strong> One feature needs another to function</li>
                  <li><strong>Association:</strong> Features work together or are related</li>
                  <li><strong>Inheritance:</strong> One feature extends another</li>
                  <li><strong>Composition:</strong> One feature contains another as essential part</li>
                  <li><strong>Aggregation:</strong> One feature has another as optional part</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="destructive"
                onClick={() => selectedEdge && handleDeleteEdge(selectedEdge.id)}
              >
                <Trash size={16} className="mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEdgeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdge}>
                  Save
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
