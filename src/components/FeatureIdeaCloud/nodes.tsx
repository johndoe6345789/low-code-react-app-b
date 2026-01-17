import { useState, useEffect, ReactElement } from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DotsThree } from '@phosphor-icons/react'
import { FeatureIdea, IdeaGroup } from './types'
import { PRIORITY_COLORS, STATUS_COLORS, GROUP_COLORS } from './constants'

export function GroupNode({ data, selected }: NodeProps<IdeaGroup>) {
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

export function IdeaNode({ data, selected, id }: NodeProps<FeatureIdea> & { id: string }) {
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

export const nodeTypes = {
  ideaNode: IdeaNode,
  groupNode: GroupNode,
}
