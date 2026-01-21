import { CaretDown } from '@phosphor-icons/react'
import { CollapsibleTrigger } from '@/components/ui/collapsible'

interface NavigationGroupHeaderProps {
  label: string
  count: number
  isExpanded: boolean
}

export function NavigationGroupHeader({
  label,
  count,
  isExpanded,
}: NavigationGroupHeaderProps) {
  return (
    <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors group">
      <CaretDown
        size={16}
        weight="bold"
        className={`text-muted-foreground transition-transform ${
          isExpanded ? 'rotate-0' : '-rotate-90'
        }`}
      />
      <h3 className="flex-1 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </h3>
      <span className="text-xs text-muted-foreground">{count}</span>
    </CollapsibleTrigger>
  )
}
