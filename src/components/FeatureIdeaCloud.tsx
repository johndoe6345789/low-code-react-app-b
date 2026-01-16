import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash, Sparkle, MagnifyingGlassMinus, MagnifyingGlassPlus, ArrowsOut, Hand, Link as LinkIcon, Selection, DotsThree, X } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type ConnectionType = 'dependency' | 'association' | 'inheritance' | 'composition' | 'aggregation'

interface Connection {
  id: string
  fromId: string
  toId: string
  type: ConnectionType
  label?: string
}

interface FeatureIdea {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planned' | 'in-progress' | 'completed'
  createdAt: number
  x: number
  y: number
  connectedTo?: string[]
  connections?: Connection[]
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
    x: 100,
    y: 150,
  },
  {
    id: 'idea-2',
    title: 'Real-time Collaboration',
    description: 'Allow multiple developers to work on the same project simultaneously',
    category: 'Collaboration',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 9000000,
    x: 600,
    y: 250,
  },
  {
    id: 'idea-3',
    title: 'Component Marketplace',
    description: 'A marketplace where users can share and download pre-built components',
    category: 'Community',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 8000000,
    x: 250,
    y: 550,
  },
  {
    id: 'idea-4',
    title: 'Visual Git Integration',
    description: 'Git operations through a visual interface with branch visualization',
    category: 'DevOps',
    priority: 'high',
    status: 'planned',
    createdAt: Date.now() - 7000000,
    x: 700,
    y: 600,
  },
  {
    id: 'idea-5',
    title: 'API Mock Server',
    description: 'Built-in mock server for testing API integrations',
    category: 'Testing',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 6000000,
    x: 150,
    y: 800,
  },
  {
    id: 'idea-6',
    title: 'Performance Profiler',
    description: 'Analyze and optimize application performance with visual metrics',
    category: 'Performance',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 5000000,
    x: 800,
    y: 350,
  },
  {
    id: 'idea-7',
    title: 'Theme Presets',
    description: 'Pre-designed theme templates for quick project setup',
    category: 'Design',
    priority: 'low',
    status: 'completed',
    createdAt: Date.now() - 4000000,
    x: 450,
    y: 100,
  },
  {
    id: 'idea-8',
    title: 'Database Schema Migrations',
    description: 'Visual tool for creating and managing database migrations',
    category: 'Database',
    priority: 'high',
    status: 'in-progress',
    createdAt: Date.now() - 3000000,
    x: 300,
    y: 400,
  },
  {
    id: 'idea-9',
    title: 'Mobile App Preview',
    description: 'Live preview on actual mobile devices or simulators',
    category: 'Mobile',
    priority: 'medium',
    status: 'planned',
    createdAt: Date.now() - 2000000,
    x: 550,
    y: 750,
  },
  {
    id: 'idea-10',
    title: 'Accessibility Checker',
    description: 'Automated accessibility testing and suggestions',
    category: 'Accessibility',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 1000000,
    x: 850,
    y: 500,
  },
]

const SEED_CONNECTIONS: Connection[] = [
  { id: 'conn-1', fromId: 'idea-1', toId: 'idea-8', type: 'dependency', label: 'requires' },
  { id: 'conn-2', fromId: 'idea-2', toId: 'idea-4', type: 'association', label: 'works with' },
  { id: 'conn-3', fromId: 'idea-8', toId: 'idea-5', type: 'composition', label: 'includes' },
]

const CATEGORIES = ['AI/ML', 'Collaboration', 'Community', 'DevOps', 'Testing', 'Performance', 'Design', 'Database', 'Mobile', 'Accessibility', 'Productivity', 'Security', 'Analytics', 'Other']
const PRIORITIES = ['low', 'medium', 'high'] as const
const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const
const CONNECTION_TYPES = ['dependency', 'association', 'inheritance', 'composition', 'aggregation'] as const

const CONNECTION_STYLES = {
  dependency: { stroke: 'hsl(var(--accent))', strokeDasharray: '8,4', arrowType: 'open' },
  association: { stroke: 'hsl(var(--primary))', strokeDasharray: '', arrowType: 'line' },
  inheritance: { stroke: 'hsl(var(--chart-2))', strokeDasharray: '', arrowType: 'hollow' },
  composition: { stroke: 'hsl(var(--destructive))', strokeDasharray: '', arrowType: 'diamond-filled' },
  aggregation: { stroke: 'hsl(var(--chart-4))', strokeDasharray: '', arrowType: 'diamond-hollow' },
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

export function FeatureIdeaCloud() {
  const [ideas, setIdeas] = useKV<FeatureIdea[]>('feature-ideas', SEED_IDEAS)
  const [connections, setConnections] = useKV<Connection[]>('feature-connections', SEED_CONNECTIONS)
  const [selectedIdea, setSelectedIdea] = useState<FeatureIdea | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [draggedIdea, setDraggedIdea] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState<'select' | 'pan' | 'connect'>('select')
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [connectionType, setConnectionType] = useState<ConnectionType>('association')
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [draggingConnection, setDraggingConnection] = useState<{ fromId: string, x: number, y: number } | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const safeIdeas = ideas || SEED_IDEAS
  const safeConnections = connections || SEED_CONNECTIONS

  useEffect(() => {
    if (!ideas || ideas.length === 0) {
      setIdeas(SEED_IDEAS)
    }
    if (!connections || connections.length === 0) {
      setConnections(SEED_CONNECTIONS)
    }
  }, [ideas, setIdeas, connections, setConnections])

  const handleAddIdea = () => {
    const canvasCenterX = (window.innerWidth / 2 - pan.x) / zoom
    const canvasCenterY = (window.innerHeight / 2 - pan.y) / zoom
    
    const newIdea: FeatureIdea = {
      id: `idea-${Date.now()}`,
      title: '',
      description: '',
      category: 'Other',
      priority: 'medium',
      status: 'idea',
      createdAt: Date.now(),
      x: canvasCenterX,
      y: canvasCenterY,
    }
    setSelectedIdea(newIdea)
    setEditDialogOpen(true)
  }

  const handleEditIdea = (idea: FeatureIdea) => {
    setSelectedIdea(idea)
    setEditDialogOpen(true)
  }

  const handleIdeaClick = (idea: FeatureIdea, e: React.MouseEvent) => {
    if (tool === 'connect') {
      e.stopPropagation()
      if (!connectingFrom) {
        setConnectingFrom(idea.id)
        toast.info(`Click another idea to connect (${CONNECTION_LABELS[connectionType]})`)
      } else if (connectingFrom !== idea.id) {
        const existingConnection = safeConnections.find(
          c => c.fromId === connectingFrom && c.toId === idea.id
        )
        
        if (existingConnection) {
          toast.error('Connection already exists')
        } else {
          const newConnection: Connection = {
            id: `conn-${Date.now()}`,
            fromId: connectingFrom,
            toId: idea.id,
            type: connectionType,
            label: CONNECTION_LABELS[connectionType],
          }
          setConnections((current) => [...(current || []), newConnection])
          toast.success('Ideas connected!')
        }
        setConnectingFrom(null)
      }
      return
    }
  }

  const handleIdeaDoubleClick = (idea: FeatureIdea, e: React.MouseEvent) => {
    if (tool === 'select') {
      e.stopPropagation()
      setSelectedIdea(idea)
      setViewDialogOpen(true)
    }
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

    setEditDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea saved!')
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas((currentIdeas) => (currentIdeas || []).filter(i => i.id !== id))
    setConnections((currentConnections) => 
      (currentConnections || []).filter(c => c.fromId !== id && c.toId !== id)
    )
    setEditDialogOpen(false)
    setViewDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea deleted')
  }

  const handleDeleteConnection = (connectionId: string) => {
    setConnections((current) => (current || []).filter(c => c.id !== connectionId))
    setConnectionDialogOpen(false)
    setSelectedConnection(null)
    toast.success('Connection removed')
  }

  const handleConnectionClick = (connection: Connection, e: React.MouseEvent) => {
    if (tool === 'select') {
      e.stopPropagation()
      setSelectedConnection(connection)
      setConnectionDialogOpen(true)
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
        const newIdeas: FeatureIdea[] = result.ideas.map((idea: any, index: number) => ({
          id: `idea-ai-${Date.now()}-${index}`,
          title: idea.title,
          description: idea.description,
          category: idea.category || 'Other',
          priority: idea.priority || 'medium',
          status: 'idea' as const,
          createdAt: Date.now(),
          x: 400 + (index * 250),
          y: 300 + (index * 150),
        }))
        
        setIdeas((currentIdeas) => [...(currentIdeas || []), ...newIdeas])
        toast.success(`Generated ${newIdeas.length} new ideas!`)
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error)
      toast.error('Failed to generate ideas')
    }
  }

  const handleZoomIn = () => {
    setZoom(z => Math.min(z * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(z => Math.max(z / 1.2, 0.25))
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    } else if (draggedIdea) {
      const canvasX = (e.clientX - pan.x) / zoom
      const canvasY = (e.clientY - pan.y) / zoom
      
      setIdeas((currentIdeas) =>
        (currentIdeas || []).map(idea =>
          idea.id === draggedIdea
            ? { ...idea, x: canvasX - dragOffset.x, y: canvasY - dragOffset.y }
            : idea
        )
      )
    } else if (draggingConnection) {
      setDraggingConnection({
        ...draggingConnection,
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (draggingConnection) {
      setDraggingConnection(null)
    }
    setIsPanning(false)
    setDraggedIdea(null)
  }

  const handleIdeaMouseDown = (idea: FeatureIdea, e: React.MouseEvent) => {
    if (tool === 'select') {
      e.stopPropagation()
      const canvasX = (e.clientX - pan.x) / zoom
      const canvasY = (e.clientY - pan.y) / zoom
      setDraggedIdea(idea.id)
      setDragOffset({
        x: canvasX - idea.x,
        y: canvasY - idea.y,
      })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.25, Math.min(3, zoom * delta))
    
    const mouseX = e.clientX
    const mouseY = e.clientY
    
    const zoomPointX = (mouseX - pan.x) / zoom
    const zoomPointY = (mouseY - pan.y) / zoom
    
    const newPanX = mouseX - zoomPointX * newZoom
    const newPanY = mouseY - zoomPointY * newZoom
    
    setZoom(newZoom)
    setPan({ x: newPanX, y: newPanY })
  }

  const handleConnectionNodeMouseDown = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const idea = safeIdeas.find(i => i.id === ideaId)
    if (idea) {
      setDraggingConnection({
        fromId: ideaId,
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleConnectionNodeMouseUp = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (draggingConnection && draggingConnection.fromId !== ideaId) {
      const existingConnection = safeConnections.find(
        c => c.fromId === draggingConnection.fromId && c.toId === ideaId
      )
      
      if (existingConnection) {
        toast.error('Connection already exists')
      } else {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromId: draggingConnection.fromId,
          toId: ideaId,
          type: connectionType,
          label: CONNECTION_LABELS[connectionType],
        }
        setConnections((current) => [...(current || []), newConnection])
        toast.success('Ideas connected!')
      }
    }
    setDraggingConnection(null)
  }

  const renderArrowhead = (connection: Connection, x: number, y: number, angle: number) => {
    const style = CONNECTION_STYLES[connection.type]
    const size = 12
    
    if (style.arrowType === 'open') {
      const points = [
        [x, y],
        [x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6)],
        [x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6)]
      ]
      return (
        <polyline
          points={points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke={style.stroke}
          strokeWidth={2}
        />
      )
    } else if (style.arrowType === 'line') {
      return (
        <line
          x1={x}
          y1={y}
          x2={x - size * Math.cos(angle)}
          y2={y - size * Math.sin(angle)}
          stroke={style.stroke}
          strokeWidth={2}
        />
      )
    } else if (style.arrowType === 'hollow') {
      const points = [
        [x, y],
        [x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6)],
        [x - size * 0.7 * Math.cos(angle), y - size * 0.7 * Math.sin(angle)],
        [x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6)]
      ]
      return (
        <polygon
          points={points.map(p => p.join(',')).join(' ')}
          fill="hsl(var(--background))"
          stroke={style.stroke}
          strokeWidth={2}
        />
      )
    } else if (style.arrowType === 'diamond-filled') {
      const points = [
        [x, y],
        [x - size * 0.6 * Math.cos(angle - Math.PI / 3), y - size * 0.6 * Math.sin(angle - Math.PI / 3)],
        [x - size * Math.cos(angle), y - size * Math.sin(angle)],
        [x - size * 0.6 * Math.cos(angle + Math.PI / 3), y - size * 0.6 * Math.sin(angle + Math.PI / 3)]
      ]
      return (
        <polygon
          points={points.map(p => p.join(',')).join(' ')}
          fill={style.stroke}
          stroke={style.stroke}
          strokeWidth={2}
        />
      )
    } else if (style.arrowType === 'diamond-hollow') {
      const points = [
        [x, y],
        [x - size * 0.6 * Math.cos(angle - Math.PI / 3), y - size * 0.6 * Math.sin(angle - Math.PI / 3)],
        [x - size * Math.cos(angle), y - size * Math.sin(angle)],
        [x - size * 0.6 * Math.cos(angle + Math.PI / 3), y - size * 0.6 * Math.sin(angle + Math.PI / 3)]
      ]
      return (
        <polygon
          points={points.map(p => p.join(',')).join(' ')}
          fill="hsl(var(--background))"
          stroke={style.stroke}
          strokeWidth={2}
        />
      )
    }
    return null
  }

  const renderConnections = () => {
    const elements: React.ReactNode[] = []
    
    safeConnections.forEach((connection) => {
      const fromIdea = safeIdeas.find(i => i.id === connection.fromId)
      const toIdea = safeIdeas.find(i => i.id === connection.toId)
      
      if (fromIdea && toIdea) {
        const fromX = fromIdea.x * zoom + pan.x + 240
        const fromY = fromIdea.y * zoom + pan.y + 80
        const toX = toIdea.x * zoom + pan.x
        const toY = toIdea.y * zoom + pan.y + 80
        
        const dx = toX - fromX
        const dy = toY - fromY
        const angle = Math.atan2(dy, dx)
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        const arrowSize = 12
        const endX = toX - arrowSize * Math.cos(angle)
        const endY = toY - arrowSize * Math.sin(angle)
        
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2
        
        const style = CONNECTION_STYLES[connection.type]
        const isHovered = hoveredConnection === connection.id
        
        elements.push(
          <g key={connection.id}>
            <line
              x1={fromX}
              y1={fromY}
              x2={endX}
              y2={endY}
              stroke={style.stroke}
              strokeWidth={isHovered ? 3 : 2}
              strokeDasharray={style.strokeDasharray}
              opacity={isHovered ? 0.9 : 0.6}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredConnection(connection.id)}
              onMouseLeave={() => setHoveredConnection(null)}
              onClick={(e) => handleConnectionClick(connection, e as any)}
            />
            
            <line
              x1={fromX}
              y1={fromY}
              x2={endX}
              y2={endY}
              stroke="transparent"
              strokeWidth={12}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredConnection(connection.id)}
              onMouseLeave={() => setHoveredConnection(null)}
              onClick={(e) => handleConnectionClick(connection, e as any)}
            />
            
            {renderArrowhead(connection, toX, toY, angle)}
            
            {(isHovered || connection.label) && (
              <g>
                <rect
                  x={midX - 40}
                  y={midY - 12}
                  width={80}
                  height={24}
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  rx={4}
                  opacity={0.95}
                />
                <text
                  x={midX}
                  y={midY + 5}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="11"
                  fontWeight="500"
                >
                  {connection.label || CONNECTION_LABELS[connection.type]}
                </text>
              </g>
            )}
          </g>
        )
      }
    })
    
    if (draggingConnection) {
      const fromIdea = safeIdeas.find(i => i.id === draggingConnection.fromId)
      if (fromIdea) {
        const fromX = fromIdea.x * zoom + pan.x + 240
        const fromY = fromIdea.y * zoom + pan.y + 80
        const toX = draggingConnection.x
        const toY = draggingConnection.y
        
        const style = CONNECTION_STYLES[connectionType]
        
        elements.push(
          <g key="dragging-connection">
            <line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={style.stroke}
              strokeWidth={2}
              strokeDasharray={style.strokeDasharray}
              opacity={0.6}
              style={{ pointerEvents: 'none' }}
            />
            <circle
              cx={toX}
              cy={toY}
              r={6}
              fill={style.stroke}
              opacity={0.8}
            />
          </g>
        )
      }
    }
    
    return elements
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={tool === 'select' ? 'default' : 'outline'}
                onClick={() => {
                  setTool('select')
                  setConnectingFrom(null)
                }}
                className="shadow-lg"
              >
                <Selection size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select & Drag</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={tool === 'pan' ? 'default' : 'outline'}
                onClick={() => {
                  setTool('pan')
                  setConnectingFrom(null)
                }}
                className="shadow-lg"
              >
                <Hand size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pan Canvas</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={tool === 'connect' ? 'default' : 'outline'}
                onClick={() => {
                  setTool('connect')
                  setConnectingFrom(null)
                }}
                className="shadow-lg"
              >
                <LinkIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Connect Ideas</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 px-3 bg-card border border-border rounded-md shadow-lg">
          <span className="text-xs font-medium text-muted-foreground">Type:</span>
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

        <div className="w-px bg-border mx-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={handleZoomIn} className="shadow-lg">
                <MagnifyingGlassPlus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={handleZoomOut} className="shadow-lg">
                <MagnifyingGlassMinus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={handleResetView} className="shadow-lg">
                <ArrowsOut size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 px-3 bg-card border border-border rounded-md shadow-lg">
          <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
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
              <Button onClick={handleAddIdea} className="shadow-lg">
                <Plus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Idea</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2 text-foreground">Connection Types:</p>
        <div className="space-y-1.5">
          {CONNECTION_TYPES.map(type => {
            const style = CONNECTION_STYLES[type]
            return (
              <div key={type} className="flex items-center gap-2">
                <svg width="40" height="12" className="shrink-0">
                  <line
                    x1="0"
                    y1="6"
                    x2="40"
                    y2="6"
                    stroke={style.stroke}
                    strokeWidth={2}
                    strokeDasharray={style.strokeDasharray}
                  />
                </svg>
                <span className="text-muted-foreground capitalize">{type}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-card border border-border rounded-lg shadow-lg p-2 text-xs text-muted-foreground max-w-sm">
        <p className="mb-1">💡 <strong>Tip:</strong> Double-click ideas to view details</p>
        <p className="mb-1">🔗 Drag connection nodes on card sides to connect ideas</p>
        <p>⚙️ Change connection type in toolbar before connecting</p>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: tool === 'pan' ? 'grab' : tool === 'connect' ? 'crosshair' : isPanning ? 'grabbing' : 'default',
        }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {renderConnections()}
        </svg>

        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {safeIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              className={`absolute ${tool === 'select' ? 'cursor-move' : tool === 'connect' ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                left: idea.x,
                top: idea.y,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onMouseDown={(e) => handleIdeaMouseDown(idea, e)}
              onClick={(e) => handleIdeaClick(idea, e)}
              onDoubleClick={(e) => handleIdeaDoubleClick(idea, e)}
            >
              <div className="relative">
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-6 h-6 rounded-full bg-primary border-2 border-background shadow-lg cursor-crosshair hover:scale-125 transition-transform opacity-0 hover:opacity-100"
                  style={{
                    opacity: hoveredNode === `${idea.id}-left` || draggingConnection ? 1 : 0.3,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    handleConnectionNodeMouseDown(idea.id, e)
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation()
                    handleConnectionNodeMouseUp(idea.id, e)
                  }}
                  onMouseEnter={() => setHoveredNode(`${idea.id}-left`)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background" />
                  </div>
                </div>

                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-6 h-6 rounded-full bg-primary border-2 border-background shadow-lg cursor-crosshair hover:scale-125 transition-transform opacity-0 hover:opacity-100"
                  style={{
                    opacity: hoveredNode === `${idea.id}-right` || draggingConnection ? 1 : 0.3,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    handleConnectionNodeMouseDown(idea.id, e)
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation()
                    handleConnectionNodeMouseUp(idea.id, e)
                  }}
                  onMouseEnter={() => setHoveredNode(`${idea.id}-right`)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background" />
                  </div>
                </div>

                <Card className={`p-4 shadow-xl hover:shadow-2xl transition-all border-2 ${PRIORITY_COLORS[idea.priority]} w-[240px] ${connectingFrom === idea.id ? 'ring-4 ring-primary' : ''}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1">{idea.title}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditIdea(idea)
                        }}
                      >
                        <DotsThree size={16} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {idea.category}
                      </Badge>
                      <Badge className={`text-xs ${STATUS_COLORS[idea.status]}`}>
                        {idea.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {safeIdeas.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">No ideas yet</p>
              <Button onClick={handleAddIdea} variant="outline">
                <Plus size={16} className="mr-2" />
                Add Your First Idea
              </Button>
            </div>
          </div>
        )}
      </div>

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

              <div>
                <label className="text-xs font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Connections</label>
                <div className="space-y-2">
                  {safeConnections
                    .filter(c => c.fromId === selectedIdea.id || c.toId === selectedIdea.id)
                    .map(conn => {
                      const otherIdea = safeIdeas.find(i => 
                        i.id === (conn.fromId === selectedIdea.id ? conn.toId : conn.fromId)
                      )
                      const isOutgoing = conn.fromId === selectedIdea.id
                      return (
                        <div key={conn.id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                          <Badge variant="outline" className="text-xs">{conn.type}</Badge>
                          <span className="flex-1">
                            {isOutgoing ? '→' : '←'} {otherIdea?.title || 'Unknown'}
                          </span>
                        </div>
                      )
                    })}
                  {safeConnections.filter(c => c.fromId === selectedIdea.id || c.toId === selectedIdea.id).length === 0 && (
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
              handleEditIdea(selectedIdea!)
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>
              Manage the relationship between ideas
            </DialogDescription>
          </DialogHeader>

          {selectedConnection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <p className="text-sm font-medium">
                    {safeIdeas.find(i => i.id === selectedConnection.fromId)?.title}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <p className="text-sm font-medium">
                    {safeIdeas.find(i => i.id === selectedConnection.toId)?.title}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  value={selectedConnection.type}
                  onChange={(e) => setSelectedConnection({ 
                    ...selectedConnection, 
                    type: e.target.value as ConnectionType,
                    label: CONNECTION_LABELS[e.target.value as ConnectionType]
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
                  value={selectedConnection.label || ''}
                  onChange={(e) => setSelectedConnection({ 
                    ...selectedConnection, 
                    label: e.target.value 
                  })}
                  placeholder={CONNECTION_LABELS[selectedConnection.type]}
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
                onClick={() => selectedConnection && handleDeleteConnection(selectedConnection.id)}
              >
                <Trash size={16} className="mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setConnectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedConnection) {
                    setConnections((current) =>
                      (current || []).map(c =>
                        c.id === selectedConnection.id ? selectedConnection : c
                      )
                    )
                    setConnectionDialogOpen(false)
                    toast.success('Connection updated!')
                  }
                }}>
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
