import { NodeProps } from 'reactflow'
import { Button } from '@/components/ui/button'
import { DotsThree } from '@phosphor-icons/react'
import { IdeaGroup } from './types'
import { GROUP_COLORS } from './constants'
import { dispatchEditGroup } from './dispatchEditGroup'

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
          dispatchEditGroup(data)
        }}
      >
        <DotsThree size={16} />
      </Button>
    </div>
  )
}
