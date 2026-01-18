import { useState, useEffect } from 'react'
import { NodeProps, Position } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DotsThree } from '@phosphor-icons/react'
import { FeatureIdea } from './types'
import { PRIORITY_COLORS, STATUS_COLORS } from './constants'
import { generateHandles } from './generateHandles'
import { dispatchEditIdea } from './dispatchEditIdea'

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

  return (
    <div className="relative">
      {generateHandles({ position: Position.Left, type: 'target', side: 'left', count: connectionCounts.left })}
      {generateHandles({ position: Position.Right, type: 'source', side: 'right', count: connectionCounts.right })}
      {generateHandles({ position: Position.Top, type: 'target', side: 'top', count: connectionCounts.top })}
      {generateHandles({ position: Position.Bottom, type: 'source', side: 'bottom', count: connectionCounts.bottom })}

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
                dispatchEditIdea(data)
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
