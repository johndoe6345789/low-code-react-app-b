import { ReactElement } from 'react'
import { Handle, Position } from 'reactflow'

interface GenerateHandlesProps {
  position: Position
  type: 'source' | 'target'
  side: string
  count: number
}

export function generateHandles({ position, type, side, count }: GenerateHandlesProps): ReactElement[] {
  const totalHandles = Math.max(2, count + 1)
  const handles: ReactElement[] = []
  
  for (let i = 0; i < totalHandles; i++) {
    const handleId = `${side}-${i}`
    const isVertical = position === Position.Top || position === Position.Bottom
    const leftPercent = ((i + 1) / (totalHandles + 1)) * 100
    const topPercent = ((i + 1) / (totalHandles + 1)) * 100
    const positionStyle = isVertical
      ? { left: `${leftPercent}%` }
      : { top: `${topPercent}%` }
    
    const element = (
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
    handles.push(element)
  }
  
  return handles
}

export function dispatchConnectionCountUpdate(nodeId: string, counts: Record<string, number>) {
  const event = new CustomEvent('updateConnectionCounts', {
    detail: { nodeId, counts }
  })
  window.dispatchEvent(event)
}

export function dispatchEditIdea(idea: any) {
  const event = new CustomEvent('editIdea', { detail: idea })
  window.dispatchEvent(event)
}

export function dispatchEditGroup(group: any) {
  const event = new CustomEvent('editGroup', { detail: group })
  window.dispatchEvent(event)
}
