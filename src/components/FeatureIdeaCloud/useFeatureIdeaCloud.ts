import { MouseEvent as ReactMouseEvent, useState, useEffect, useCallback, useRef } from 'react'
import { Edge, Node, useNodesState, useEdgesState, Connection as RFConnection, MarkerType, reconnectEdge } from 'reactflow'
import { toast } from 'sonner'
import { useKV } from '@/hooks/use-kv'
import { FeatureIdea, IdeaGroup, IdeaEdgeData } from './types'
import { CATEGORIES, CONNECTION_STYLE, GROUP_COLORS } from './constants'
import { buildSeedEdges, buildSeedIdeas } from './seed-data'
import { dispatchConnectionCountUpdate } from './dispatchConnectionCountUpdate'

type SeedRef = {
  ideas: FeatureIdea[]
  edges: Edge<IdeaEdgeData>[]
}

export type FeatureIdeaCloudState = {
  nodes: Node[]
  edges: Edge<IdeaEdgeData>[]
  ideas: FeatureIdea[] | null
  groups: IdeaGroup[] | null
  safeIdeas: FeatureIdea[]
  safeGroups: IdeaGroup[]
  selectedIdea: FeatureIdea | null
  selectedGroup: IdeaGroup | null
  selectedEdge: Edge<IdeaEdgeData> | null
  editDialogOpen: boolean
  groupDialogOpen: boolean
  viewDialogOpen: boolean
  edgeDialogOpen: boolean
  debugPanelOpen: boolean
  setSelectedIdea: (idea: FeatureIdea | null) => void
  setSelectedGroup: (group: IdeaGroup | null) => void
  setSelectedEdge: (edge: Edge<IdeaEdgeData> | null) => void
  setEditDialogOpen: (open: boolean) => void
  setGroupDialogOpen: (open: boolean) => void
  setViewDialogOpen: (open: boolean) => void
  setEdgeDialogOpen: (open: boolean) => void
  setDebugPanelOpen: (open: boolean) => void
  onNodesChangeWrapper: (changes: any) => void
  onEdgesChangeWrapper: (changes: any) => void
  onConnect: (params: RFConnection) => void
  onEdgeClick: (event: ReactMouseEvent, edge: Edge<IdeaEdgeData>) => void
  onNodeDoubleClick: (event: ReactMouseEvent, node: Node<FeatureIdea>) => void
  onReconnectStart: () => void
  onReconnect: (oldEdge: Edge, newConnection: RFConnection) => void
  onReconnectEnd: (_: MouseEvent | TouchEvent, edge: Edge) => void
  handleAddIdea: () => void
  handleAddGroup: () => void
  handleSaveIdea: () => void
  handleDeleteIdea: (id: string) => void
  handleSaveGroup: () => void
  handleDeleteGroup: (id: string) => void
  handleDeleteEdge: (edgeId: string) => void
  handleSaveEdge: () => void
  handleGenerateIdeas: () => Promise<void>
}

export const useFeatureIdeaCloud = (): FeatureIdeaCloudState => {
  const seedRef = useRef<SeedRef | null>(null)
  if (!seedRef.current) {
    seedRef.current = { ideas: buildSeedIdeas(), edges: buildSeedEdges() }
  }
  const seedIdeas = seedRef.current.ideas
  const seedEdges = seedRef.current.edges

  const [ideas, setIdeas] = useKV<FeatureIdea[]>('feature-ideas', seedIdeas)
  const [groups, setGroups] = useKV<IdeaGroup[]>('feature-idea-groups', [])
  const [savedEdges, setSavedEdges] = useKV<Edge<IdeaEdgeData>[]>('feature-idea-edges', seedEdges)
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

  const safeIdeas = ideas || seedIdeas
  const safeGroups = groups || []
  const safeEdges = savedEdges || []
  const safeNodePositions = savedNodePositions || {}

  const updateNodeConnectionCounts = useCallback((edgeList: Edge<IdeaEdgeData>[]) => {
    const nodeConnectionMap = new Map<string, Record<string, Set<string>>>()

    edgeList.forEach((edge) => {
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

      dispatchConnectionCountUpdate(nodeId, counts)
    })
  }, [])

  useEffect(() => {
    if (!ideas || ideas.length === 0) {
      setIdeas(seedIdeas)
    }
  }, [ideas, seedIdeas, setIdeas])

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
            currentNodes.forEach((node) => {
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

  const validateAndRemoveConflicts = useCallback(
    (
      edgeList: Edge<IdeaEdgeData>[],
      sourceNodeId: string,
      sourceHandleId: string,
      targetNodeId: string,
      targetHandleId: string,
      excludeEdgeId?: string
    ): { filteredEdges: Edge<IdeaEdgeData>[]; removedCount: number; conflicts: string[] } => {
      const edgesToRemove: string[] = []
      const conflicts: string[] = []

      console.log('[Validator] Checking for conflicts:', {
        newConnection: `${sourceNodeId}[${sourceHandleId}] -> ${targetNodeId}[${targetHandleId}]`,
        existingEdges: edgeList.length,
        excludeEdgeId,
      })

      edgeList.forEach((edge) => {
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

      const filteredEdges = edgeList.filter((edge) => !edgesToRemove.includes(edge.id))

      console.log('[Validator] Conflicts found:', conflicts.length, 'edges to remove:', edgesToRemove)

      return {
        filteredEdges,
        removedCount: edgesToRemove.length,
        conflicts,
      }
    },
    []
  )

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
        eds.forEach((edge) => {
          console.log(`  - ${edge.id}: ${edge.source}[${edge.sourceHandle || 'default'}] -> ${edge.target}[${edge.targetHandle || 'default'}]`)
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
            height: 20,
          },
          style: {
            stroke: CONNECTION_STYLE.stroke,
            strokeWidth: CONNECTION_STYLE.strokeWidth,
          },
          animated: false,
        }

        console.log('[Connection] Creating new edge:', newEdge.id)

        const updatedEdges = [...filteredEdges, newEdge]

        console.log('[Connection] Total edges AFTER addition:', updatedEdges.length)
        console.log('[Connection] Final edge list:')
        updatedEdges.forEach((edge) => {
          console.log(`  - ${edge.id}: ${edge.source}[${edge.sourceHandle || 'default'}] -> ${edge.target}[${edge.targetHandle || 'default'}]`)
        })

        setSavedEdges(updatedEdges)
        updateNodeConnectionCounts(updatedEdges)

        if (removedCount > 0) {
          setTimeout(() => {
            toast.success(`Connection remapped! (${removedCount} old connection${removedCount > 1 ? 's' : ''} removed)`, {
              description: conflicts.join('\n'),
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

  const onEdgeClick = useCallback((event: ReactMouseEvent, edge: Edge<IdeaEdgeData>) => {
    setSelectedEdge(edge)
    setEdgeDialogOpen(true)
  }, [])

  const onNodeDoubleClick = useCallback((event: ReactMouseEvent, node: Node<FeatureIdea>) => {
    setSelectedIdea(node.data)
    setViewDialogOpen(true)
  }, [])

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: RFConnection) => {
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
        newTarget: `${targetNodeId}[${targetHandleId}]`,
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
        console.log('[Reconnection] Edges by handle:', updatedEdges.map((edge) => ({
          id: edge.id,
          source: `${edge.source}[${edge.sourceHandle || 'default'}]`,
          target: `${edge.target}[${edge.targetHandle || 'default'}]`,
        })))

        setSavedEdges(updatedEdges)
        updateNodeConnectionCounts(updatedEdges)

        if (removedCount > 0) {
          setTimeout(() => {
            toast.success(
              `Connection remapped! (${removedCount} conflicting connection${removedCount > 1 ? 's' : ''} removed)`,
              {
                description: conflicts.join('\n'),
              }
            )
          }, 0)
        } else {
          setTimeout(() => {
            toast.success('Connection remapped!')
          }, 0)
        }

        return updatedEdges
      })
    },
    [setEdges, setSavedEdges, validateAndRemoveConflicts, updateNodeConnectionCounts]
  )

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => {
          const updatedEdges = eds.filter((current) => current.id !== edge.id)
          setSavedEdges(updatedEdges)
          return updatedEdges
        })
      }
      edgeReconnectSuccessful.current = true
    },
    [setEdges, setSavedEdges]
  )

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
      const existing = (currentIdeas || []).find((idea) => idea.id === selectedIdea.id)
      if (existing) {
        return (currentIdeas || []).map((idea) => (idea.id === selectedIdea.id ? selectedIdea : idea))
      }
      return [...(currentIdeas || []), selectedIdea]
    })

    if (!(ideas || []).find((idea) => idea.id === selectedIdea.id)) {
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
    setIdeas((currentIdeas) => (currentIdeas || []).filter((idea) => idea.id !== id))
    setNodes((nds) => nds.filter((node) => node.id !== id))

    setSavedNodePositions((currentPositions) => {
      const newPositions = { ...(currentPositions || {}) }
      delete newPositions[id]
      return newPositions
    })

    const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id)
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
      const existing = (currentGroups || []).find((group) => group.id === selectedGroup.id)
      if (existing) {
        return (currentGroups || []).map((group) => (group.id === selectedGroup.id ? selectedGroup : group))
      }
      return [...(currentGroups || []), selectedGroup]
    })

    if (!(groups || []).find((group) => group.id === selectedGroup.id)) {
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
      (currentIdeas || []).map((idea) => (idea.parentGroup === id ? { ...idea, parentGroup: undefined } : idea))
    )

    setGroups((currentGroups) => (currentGroups || []).filter((group) => group.id !== id))
    setNodes((nds) => nds.filter((node) => node.id !== id))

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
    const updatedEdges = edges.filter((edge) => edge.id !== edgeId)
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
          height: 20,
        },
        style: {
          stroke: CONNECTION_STYLE.stroke,
          strokeWidth: CONNECTION_STYLE.strokeWidth,
        },
        animated: false,
      }

      const updatedEdges = edges.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge))
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
          const position = { x: 400 + index * 250, y: 300 + index * 150 }
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

  return {
    nodes,
    edges,
    ideas,
    groups,
    safeIdeas,
    safeGroups,
    selectedIdea,
    selectedGroup,
    selectedEdge,
    editDialogOpen,
    groupDialogOpen,
    viewDialogOpen,
    edgeDialogOpen,
    debugPanelOpen,
    setSelectedIdea,
    setSelectedGroup,
    setSelectedEdge,
    setEditDialogOpen,
    setGroupDialogOpen,
    setViewDialogOpen,
    setEdgeDialogOpen,
    setDebugPanelOpen,
    onNodesChangeWrapper,
    onEdgesChangeWrapper,
    onConnect,
    onEdgeClick,
    onNodeDoubleClick,
    onReconnectStart,
    onReconnect,
    onReconnectEnd,
    handleAddIdea,
    handleAddGroup,
    handleSaveIdea,
    handleDeleteIdea,
    handleSaveGroup,
    handleDeleteGroup,
    handleDeleteEdge,
    handleSaveEdge,
    handleGenerateIdeas,
  }
}
