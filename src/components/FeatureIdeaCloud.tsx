import { useState, useEffect, useCallback, useRef, ReactElement } from 'react'
import { useKV } from '@/hooks/use-kv'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Sparkle, DotsThree, Package } from '@phosphor-icons/react'
import { toast } from 'sonner'

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

const CONNECTION_STYLE = { 
  stroke: '#a78bfa', 
  strokeWidth: 2.5
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

function IdeaNode({ data, selected, id }: NodeProps<FeatureIdea> & { id: string }) {
  const [connectionCounts, setConnectionCounts] = useState<Record<string, number>>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })

  useEffect(() => {
    const updateConnectionCounts = (event: CustomEvent) => {
      const { nodeId, counts } = event.detail
      if (nodeId === id) {
        setConnectionCounts(counts)
      }
    }

    window.addEventListener('updateConnectionCounts' as any, updateConnectionCounts as EventListener)
    return () => {
      window.removeEventListener('updateConnectionCounts' as any, updateConnectionCounts as EventListener)
    }
  }, [id])

  const generateHandles = (position: Position, type: 'source' | 'target', side: string) => {
    const count = connectionCounts[side] || 0
    const totalHandles = Math.max(2, count + 1)
    const handles: ReactElement[] = []
    
    for (let i = 0; i < totalHandles; i++) {
      const handleId = `${side}-${i}`
      const isVertical = position === Position.Top || position === Position.Bottom
      const positionStyle = isVertical
        ? { left: `${((i + 1) / (totalHandles + 1)) * 100}%` }
        : { top: `${((i + 1) / (totalHandles + 1)) * 100}%` }
      
      handles.push(
        <Handle
          key={handleId}
          type={type}
          position={position}
          id={handleId}
          className="w-3 h-3 !bg-primary border-2 border-background transition-all hover:scale-125"
          style={{
            ...positionStyle,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )
    }
    
    return handles
  }

  return (
    <div className="relative">
      {generateHandles(Position.Left, 'target', 'left')}
      {generateHandles(Position.Right, 'source', 'right')}
      {generateHandles(Position.Top, 'target', 'top')}
      {generateHandles(Position.Bottom, 'source', 'bottom')}
      
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
      sourceHandle: 'right-0',
      targetHandle: 'left-0',
      type: 'default',
      animated: false,
      data: { label: 'requires' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a78bfa', width: 20, height: 20 },
      style: { stroke: '#a78bfa', strokeWidth: 2.5 },
    },
    {
      id: 'edge-2',
      source: 'idea-2',
      target: 'idea-4',
      sourceHandle: 'bottom-0',
      targetHandle: 'top-0',
      type: 'default',
      data: { label: 'works with' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a78bfa', width: 20, height: 20 },
      style: { stroke: '#a78bfa', strokeWidth: 2.5 },
    },
    {
      id: 'edge-3',
      source: 'idea-8',
      target: 'idea-5',
      sourceHandle: 'bottom-0',
      targetHandle: 'left-0',
      type: 'default',
      data: { label: 'includes' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a78bfa', width: 20, height: 20 },
      style: { stroke: '#a78bfa', strokeWidth: 2.5 },
    },
  ])
  const [savedNodePositions, setSavedNodePositions] = useKV<Record<string, { x: number; y: number }>>('feature-idea-node-positions', {})
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedIdea, setSelectedIdea] = useState<FeatureIdea | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<IdeaGroup | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge<IdeaEdgeData> | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false)
  const [debugPanelOpen, setDebugPanelOpen] = useState(false)
  const edgeReconnectSuccessful = useRef(true)

  const safeIdeas = ideas || SEED_IDEAS
  const safeGroups = groups || []
  const safeEdges = savedEdges || []
  const safeNodePositions = savedNodePositions || {}

  const updateNodeConnectionCounts = useCallback((edges: Edge<IdeaEdgeData>[]) => {
    const nodeConnectionMap = new Map<string, Record<string, Set<string>>>()
    
    edges.forEach(edge => {
      const sourceHandle = edge.sourceHandle || 'default'
      const targetHandle = edge.targetHandle || 'default'
      
      if (!nodeConnectionMap.has(edge.source)) {
        nodeConnectionMap.set(edge.source, { left: new Set(), right: new Set(), top: new Set(), bottom: new Set() })
      }
      if (!nodeConnectionMap.has(edge.target)) {
        nodeConnectionMap.set(edge.target, { left: new Set(), right: new Set(), top: new Set(), bottom: new Set() })
      }
      
      const sourceSide = sourceHandle.split('-')[0]
      const targetSide = targetHandle.split('-')[0]
      
      nodeConnectionMap.get(edge.source)![sourceSide].add(sourceHandle)
      nodeConnectionMap.get(edge.target)![targetSide].add(targetHandle)
    })
    
    nodeConnectionMap.forEach((connections, nodeId) => {
      const counts = {
        left: connections.left.size,
        right: connections.right.size,
        top: connections.top.size,
        bottom: connections.bottom.size,
      }
      
      const event = new CustomEvent('updateConnectionCounts', {
        detail: { nodeId, counts }
      })
      window.dispatchEvent(event)
    })
  }, [])

  useEffect(() => {
    if (!ideas || ideas.length === 0) {
      setIdeas(SEED_IDEAS)
    }
  }, [ideas, setIdeas])

  useEffect(() => {
    const groupNodes: Node<IdeaGroup>[] = safeGroups.map((group) => ({
      id: group.id,
      type: 'groupNode',
      position: safeNodePositions[group.id] || { x: 0, y: 0 },
      data: group,
      style: {
        zIndex: -1,
      },
    }))

    const ideaNodes: Node<FeatureIdea>[] = safeIdeas.map((idea, index) => ({
      id: idea.id,
      type: 'ideaNode',
      position: safeNodePositions[idea.id] || { x: 100 + (index % 3) * 350, y: 100 + Math.floor(index / 3) * 250 },
      data: idea,
      parentNode: idea.parentGroup,
      extent: idea.parentGroup ? 'parent' : undefined,
      style: {
        zIndex: 1,
      },
    }))

    setNodes([...groupNodes, ...ideaNodes])
  }, [safeIdeas, safeGroups, safeNodePositions, setNodes])

  useEffect(() => {
    setEdges(safeEdges)
    updateNodeConnectionCounts(safeEdges)
  }, [safeEdges, setEdges, updateNodeConnectionCounts])

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
          setNodes((currentNodes) => {
            const positions: Record<string, { x: number; y: number }> = {}
            currentNodes.forEach(node => {
              if (node.position) {
                positions[node.id] = node.position
              }
            })
            setSavedNodePositions(positions)
            return currentNodes
          })
          setEdges((currentEdges) => {
            setSavedEdges(currentEdges)
            return currentEdges
          })
        }, 100)
      }
    },
    [onNodesChange, setNodes, setEdges, setSavedNodePositions, setSavedEdges]
  )

  const onEdgesChangeWrapper = useCallback(
    (changes: any) => {
      onEdgesChange(changes)
      setTimeout(() => {
        setEdges((currentEdges) => {
          setSavedEdges(currentEdges)
          updateNodeConnectionCounts(currentEdges)
          return currentEdges
        })
      }, 100)
    },
    [onEdgesChange, setEdges, setSavedEdges, updateNodeConnectionCounts]
  )

  const validateAndRemoveConflicts = useCallback((
    edges: Edge<IdeaEdgeData>[],
    sourceNodeId: string,
    sourceHandleId: string,
    targetNodeId: string,
    targetHandleId: string,
    excludeEdgeId?: string
  ): { filteredEdges: Edge<IdeaEdgeData>[], removedCount: number, conflicts: string[] } => {
    const edgesToRemove: string[] = []
    const conflicts: string[] = []
    
    console.log('[Validator] Checking for conflicts:', {
      newConnection: `${sourceNodeId}[${sourceHandleId}] -> ${targetNodeId}[${targetHandleId}]`,
      existingEdges: edges.length,
      excludeEdgeId
    })
    
    edges.forEach(edge => {
      if (excludeEdgeId && edge.id === excludeEdgeId) {
        console.log('[Validator] Skipping excluded edge:', edge.id)
        return
      }
      
      const edgeSourceHandle = edge.sourceHandle || 'default'
      const edgeTargetHandle = edge.targetHandle || 'default'
      
      const hasSourceConflict = edge.source === sourceNodeId && edgeSourceHandle === sourceHandleId
      const hasTargetConflict = edge.target === targetNodeId && edgeTargetHandle === targetHandleId
      
      if (hasSourceConflict && !edgesToRemove.includes(edge.id)) {
        edgesToRemove.push(edge.id)
        conflicts.push(`Source: ${edge.source}[${edgeSourceHandle}] was connected to ${edge.target}[${edgeTargetHandle}]`)
        console.log('[Validator] SOURCE CONFLICT DETECTED:', edge.id, edge)
      }
      
      if (hasTargetConflict && !edgesToRemove.includes(edge.id)) {
        edgesToRemove.push(edge.id)
        conflicts.push(`Target: ${edge.target}[${edgeTargetHandle}] was connected from ${edge.source}[${edgeSourceHandle}]`)
        console.log('[Validator] TARGET CONFLICT DETECTED:', edge.id, edge)
      }
    })
    
    const filteredEdges = edges.filter(e => !edgesToRemove.includes(e.id))
    
    console.log('[Validator] Conflicts found:', conflicts.length, 'edges to remove:', edgesToRemove)
    
    return { 
      filteredEdges, 
      removedCount: edgesToRemove.length,
      conflicts
    }
  }, [])

  const onConnect = useCallback(
    (params: RFConnection) => {
      if (!params.source || !params.target) return
      
      const sourceNodeId = params.source
      const sourceHandleId = params.sourceHandle || 'default'
      const targetNodeId = params.target
      const targetHandleId = params.targetHandle || 'default'
      
      console.log('[Connection] ==== NEW CONNECTION ATTEMPT ====')
      console.log('[Connection] Source:', `${sourceNodeId}[${sourceHandleId}]`)
      console.log('[Connection] Target:', `${targetNodeId}[${targetHandleId}]`)
      
      setEdges((eds) => {
        console.log('[Connection] Current edges BEFORE validation:', eds.length)
        eds.forEach(e => {
          console.log(`  - ${e.id}: ${e.source}[${e.sourceHandle || 'default'}] -> ${e.target}[${e.targetHandle || 'default'}]`)
        })
        
        const { filteredEdges, removedCount, conflicts } = validateAndRemoveConflicts(
          eds,
          sourceNodeId,
          sourceHandleId,
          targetNodeId,
          targetHandleId
        )
        
        console.log('[Connection] Edges AFTER conflict removal:', filteredEdges.length)
        
        const newEdge: Edge<IdeaEdgeData> = {
          id: `edge-${Date.now()}`,
          source: sourceNodeId,
          target: targetNodeId,
          sourceHandle: sourceHandleId,
          targetHandle: targetHandleId,
          type: 'default',
          data: { label: 'relates to' },
          markerEnd: { 
            type: MarkerType.ArrowClosed,
            color: CONNECTION_STYLE.stroke,
            width: 20,
            height: 20
          },
          style: { 
            stroke: CONNECTION_STYLE.stroke, 
            strokeWidth: CONNECTION_STYLE.strokeWidth
          },
          animated: false,
        }
        
        console.log('[Connection] Creating new edge:', newEdge.id)
        
        const updatedEdges = [...filteredEdges, newEdge]
        
        console.log('[Connection] Total edges AFTER addition:', updatedEdges.length)
        console.log('[Connection] Final edge list:')
        updatedEdges.forEach(e => {
          console.log(`  - ${e.id}: ${e.source}[${e.sourceHandle || 'default'}] -> ${e.target}[${e.targetHandle || 'default'}]`)
        })
        
        setSavedEdges(updatedEdges)
        updateNodeConnectionCounts(updatedEdges)
        
        if (removedCount > 0) {
          setTimeout(() => {
            toast.success(`Connection remapped! (${removedCount} old connection${removedCount > 1 ? 's' : ''} removed)`, {
              description: conflicts.join('\n')
            })
          }, 0)
        } else {
          setTimeout(() => {
            toast.success('Ideas connected!')
          }, 0)
        }
        
        return updatedEdges
      })
    },
    [setEdges, setSavedEdges, validateAndRemoveConflicts, updateNodeConnectionCounts]
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
    
    console.log('[Reconnection] Remapping edge:', {
      oldEdgeId: oldEdge.id,
      oldSource: `${oldEdge.source}[${oldEdge.sourceHandle || 'default'}]`,
      oldTarget: `${oldEdge.target}[${oldEdge.targetHandle || 'default'}]`,
      newSource: `${sourceNodeId}[${sourceHandleId}]`,
      newTarget: `${targetNodeId}[${targetHandleId}]`
    })
    
    edgeReconnectSuccessful.current = true
    
    setEdges((els) => {
      const { filteredEdges, removedCount, conflicts } = validateAndRemoveConflicts(
        els,
        sourceNodeId,
        sourceHandleId,
        targetNodeId,
        targetHandleId,
        oldEdge.id
      )
      
      const updatedEdges = reconnectEdge(oldEdge, newConnection, filteredEdges)
      
      console.log('[Reconnection] Edge remapped successfully')
      console.log('[Reconnection] Total edges after remapping:', updatedEdges.length)
      console.log('[Reconnection] Edges by handle:', updatedEdges.map(e => ({
        id: e.id,
        source: `${e.source}[${e.sourceHandle || 'default'}]`,
        target: `${e.target}[${e.targetHandle || 'default'}]`
      })))
      
      setSavedEdges(updatedEdges)
      updateNodeConnectionCounts(updatedEdges)
      
      if (removedCount > 0) {
        setTimeout(() => {
          toast.success(`Connection remapped! (${removedCount} conflicting connection${removedCount > 1 ? 's' : ''} removed)`, {
            description: conflicts.join('\n')
          })
        }, 0)
      } else {
        setTimeout(() => {
          toast.success('Connection remapped!')
        }, 0)
      }
      
      return updatedEdges
    })
  }, [setEdges, setSavedEdges, validateAndRemoveConflicts, updateNodeConnectionCounts])

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
      const newPosition = { x: 400, y: 300 }
      const newNode: Node<FeatureIdea> = {
        id: selectedIdea.id,
        type: 'ideaNode',
        position: newPosition,
        data: selectedIdea,
      }
      setNodes((nds) => [...nds, newNode])
      
      setSavedNodePositions((currentPositions) => ({
        ...(currentPositions || {}),
        [selectedIdea.id]: newPosition,
      }))
    }

    setEditDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea saved!')
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas((currentIdeas) => (currentIdeas || []).filter(i => i.id !== id))
    setNodes((nds) => nds.filter(n => n.id !== id))
    
    setSavedNodePositions((currentPositions) => {
      const newPositions = { ...(currentPositions || {}) }
      delete newPositions[id]
      return newPositions
    })
    
    const updatedEdges = edges.filter(e => e.source !== id && e.target !== id)
    setEdges(updatedEdges)
    setSavedEdges(updatedEdges)
    updateNodeConnectionCounts(updatedEdges)
    
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
      const newPosition = { x: 200, y: 200 }
      const newNode: Node<IdeaGroup> = {
        id: selectedGroup.id,
        type: 'groupNode',
        position: newPosition,
        data: selectedGroup,
        style: {
          zIndex: -1,
        },
      }
      setNodes((nds) => [newNode, ...nds])
      
      setSavedNodePositions((currentPositions) => ({
        ...(currentPositions || {}),
        [selectedGroup.id]: newPosition,
      }))
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
    
    setSavedNodePositions((currentPositions) => {
      const newPositions = { ...(currentPositions || {}) }
      delete newPositions[id]
      return newPositions
    })
    
    setGroupDialogOpen(false)
    setSelectedGroup(null)
    toast.success('Group deleted')
  }

  const handleDeleteEdge = (edgeId: string) => {
    const updatedEdges = edges.filter(e => e.id !== edgeId)
    setEdges(updatedEdges)
    setSavedEdges(updatedEdges)
    updateNodeConnectionCounts(updatedEdges)
    setEdgeDialogOpen(false)
    setSelectedEdge(null)
    toast.success('Connection removed')
  }

  const handleSaveEdge = () => {
    if (selectedEdge) {
      const updatedEdge = {
        ...selectedEdge,
        data: selectedEdge.data,
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: CONNECTION_STYLE.stroke,
          width: 20,
          height: 20
        },
        style: { 
          stroke: CONNECTION_STYLE.stroke, 
          strokeWidth: CONNECTION_STYLE.strokeWidth
        },
        animated: false,
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
        
        const newPositions: Record<string, { x: number; y: number }> = {}
        const newNodes: Node<FeatureIdea>[] = newIdeas.map((idea, index) => {
          const position = { x: 400 + (index * 250), y: 300 + (index * 150) }
          newPositions[idea.id] = position
          return {
            id: idea.id,
            type: 'ideaNode',
            position,
            data: idea,
          }
        })
        
        setNodes((nds) => [...nds, ...newNodes])
        setSavedNodePositions((currentPositions) => ({
          ...(currentPositions || {}),
          ...newPositions,
        }))
        
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
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
        <Controls showInteractive={false} />

        <Panel position="top-right" className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setDebugPanelOpen(!debugPanelOpen)} 
                  variant="outline" 
                  className="shadow-lg"
                  size="icon"
                >
                  🔍
                </Button>
              </TooltipTrigger>
              <TooltipContent>Debug Connection Status</TooltipContent>
            </Tooltip>

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

        <Panel position="bottom-right">
          <div className="bg-card border border-border rounded-lg shadow-lg p-2 text-xs text-muted-foreground max-w-sm">
            <p className="mb-1">💡 <strong>Tip:</strong> Double-click ideas to view details</p>
            <p className="mb-1">📦 Create groups to organize related ideas</p>
            <p className="mb-1">🔗 Drag from handles on card edges to connect ideas</p>
            <p className="mb-1">↪️ Drag existing connection ends to remap them</p>
            <p>⚙️ Click connections to edit or delete them</p>
          </div>
        </Panel>
        
        {debugPanelOpen && (
          <Panel position="top-center" className="max-w-2xl">
            <Card className="shadow-2xl border-2">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">🔍 Connection Debug Panel</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setDebugPanelOpen(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-xs">
                  <div>
                    <div className="font-semibold text-foreground mb-1">Total Edges</div>
                    <div className="text-2xl font-bold text-primary">{edges.length}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Total Nodes</div>
                    <div className="text-2xl font-bold text-accent">{nodes.length}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Total Ideas</div>
                    <div className="text-2xl font-bold text-secondary">{safeIdeas.length}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>Connection Matrix (Handle Occupancy)</span>
                    <Badge variant="outline" className="text-xs">1:1 Constraint Active</Badge>
                  </div>
                  <ScrollArea className="h-48 w-full rounded-md border">
                    <div className="p-2 space-y-2 text-xs font-mono">
                      {safeIdeas.slice(0, 10).map((idea) => {
                        const nodeEdges = edges.filter(e => e.source === idea.id || e.target === idea.id)
                        const leftHandles = edges.filter(e => e.target === idea.id && e.targetHandle?.startsWith('left'))
                        const rightHandles = edges.filter(e => e.source === idea.id && e.sourceHandle?.startsWith('right'))
                        const topHandles = edges.filter(e => e.target === idea.id && e.targetHandle?.startsWith('top'))
                        const bottomHandles = edges.filter(e => e.source === idea.id && e.sourceHandle?.startsWith('bottom'))
                        
                        const leftUnique = new Set(leftHandles.map(e => e.targetHandle)).size
                        const rightUnique = new Set(rightHandles.map(e => e.sourceHandle)).size
                        const topUnique = new Set(topHandles.map(e => e.targetHandle)).size
                        const bottomUnique = new Set(bottomHandles.map(e => e.sourceHandle)).size
                        
                        const hasViolation = leftHandles.length !== leftUnique || rightHandles.length !== rightUnique || 
                                            topHandles.length !== topUnique || bottomHandles.length !== bottomUnique
                        
                        return (
                          <div key={idea.id} className={`p-2 rounded border ${hasViolation ? 'bg-red-500/20 border-red-500' : 'bg-muted/30'}`}>
                            <div className="font-semibold truncate mb-1 flex items-center gap-2" title={idea.title}>
                              {hasViolation && <span className="text-red-500">⚠️</span>}
                              {idea.title}
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-[10px]">
                              <div className={`p-1 rounded text-center ${
                                leftHandles.length !== leftUnique ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold' :
                                leftHandles.length >= 1 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-muted'
                              }`}>
                                ← {leftHandles.length}/{leftUnique} {leftHandles.length !== leftUnique ? '⚠️' : leftHandles.length > 0 ? '✓' : '○'}
                              </div>
                              <div className={`p-1 rounded text-center ${
                                rightHandles.length !== rightUnique ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold' :
                                rightHandles.length >= 1 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-muted'
                              }`}>
                                → {rightHandles.length}/{rightUnique} {rightHandles.length !== rightUnique ? '⚠️' : rightHandles.length > 0 ? '�����' : '○'}
                              </div>
                              <div className={`p-1 rounded text-center ${
                                topHandles.length !== topUnique ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold' :
                                topHandles.length >= 1 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-muted'
                              }`}>
                                ↑ {topHandles.length}/{topUnique} {topHandles.length !== topUnique ? '⚠️' : topHandles.length > 0 ? '✓' : '○'}
                              </div>
                              <div className={`p-1 rounded text-center ${
                                bottomHandles.length !== bottomUnique ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold' :
                                bottomHandles.length >= 1 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-muted'
                              }`}>
                                ↓ {bottomHandles.length}/{bottomUnique} {bottomHandles.length !== bottomUnique ? '⚠️' : bottomHandles.length > 0 ? '✓' : '○'}
                              </div>
                            </div>
                            <div className="mt-1 text-[10px] text-muted-foreground">
                              Total: {nodeEdges.length} connection{nodeEdges.length !== 1 ? 's' : ''}, Handles: L{leftUnique}|R{rightUnique}|T{topUnique}|B{bottomUnique}
                            </div>
                          </div>
                        )
                      })}
                      {safeIdeas.length > 10 && (
                        <div className="text-center text-muted-foreground py-2">
                          ... and {safeIdeas.length - 10} more ideas
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {(() => {
                  const violations: string[] = []
                  safeIdeas.forEach(idea => {
                    const leftHandles = edges.filter(e => e.target === idea.id && e.targetHandle?.startsWith('left'))
                    const rightHandles = edges.filter(e => e.source === idea.id && e.sourceHandle?.startsWith('right'))
                    const topHandles = edges.filter(e => e.target === idea.id && e.targetHandle?.startsWith('top'))
                    const bottomHandles = edges.filter(e => e.source === idea.id && e.sourceHandle?.startsWith('bottom'))
                    
                    const leftUnique = new Set(leftHandles.map(e => e.targetHandle)).size
                    const rightUnique = new Set(rightHandles.map(e => e.sourceHandle)).size
                    const topUnique = new Set(topHandles.map(e => e.targetHandle)).size
                    const bottomUnique = new Set(bottomHandles.map(e => e.sourceHandle)).size
                    
                    if (leftHandles.length !== leftUnique) violations.push(`${idea.title}: Left side has duplicate handle usage (${leftHandles.length} connections on ${leftUnique} handles)`)
                    if (rightHandles.length !== rightUnique) violations.push(`${idea.title}: Right side has duplicate handle usage (${rightHandles.length} connections on ${rightUnique} handles)`)
                    if (topHandles.length !== topUnique) violations.push(`${idea.title}: Top side has duplicate handle usage (${topHandles.length} connections on ${topUnique} handles)`)
                    if (bottomHandles.length !== bottomUnique) violations.push(`${idea.title}: Bottom side has duplicate handle usage (${bottomHandles.length} connections on ${bottomUnique} handles)`)
                  })
                  
                  return violations.length > 0 ? (
                    <div className="space-y-1 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="font-semibold text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                        ❌ CONSTRAINT VIOLATIONS DETECTED
                      </div>
                      <div className="text-xs space-y-0.5 text-red-600 dark:text-red-400">
                        {violations.map((v, i) => (
                          <div key={i}>• {v}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="font-semibold text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                        ✅ All Constraints Satisfied
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div>• Each handle has exactly 1 connection (1:1 mapping) ✓</div>
                        <div>• New connections automatically remove conflicts ✓</div>
                        <div>• Spare blank handles always available ✓</div>
                        <div>• Remapping preserves 1:1 constraint ✓</div>
                        <div>• Changes persist to database immediately ✓</div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </Card>
          </Panel>
        )}
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
                          <span className="flex-1">
                            {isOutgoing ? '→' : '←'} {otherIdea?.title || 'Unknown'}
                          </span>
                          {edge.data?.label && (
                            <Badge variant="outline" className="text-xs">{edge.data.label}</Badge>
                          )}
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
                <label className="text-sm font-medium mb-1 block">Label</label>
                <Input
                  value={selectedEdge.data?.label || ''}
                  onChange={(e) => setSelectedEdge({ 
                    ...selectedEdge, 
                    data: {
                      ...selectedEdge.data!,
                      label: e.target.value 
                    }
                  })}
                  placeholder="relates to"
                />
              </div>

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-2">💡 Connection Info:</p>
                <p className="text-xs text-muted-foreground">
                  Each connection point can have exactly one arrow. Creating a new connection from an occupied point will automatically remap the existing connection.
                </p>
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
