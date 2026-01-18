import { ComponentDefinition } from '@/lib/component-definitions-utils'
import { Card } from '@/components/ui/card'
import * as Icons from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ComponentPaletteItemProps {
  component: ComponentDefinition
  onDragStart: (component: ComponentDefinition, e: React.DragEvent) => void
  className?: string
}

export function ComponentPaletteItem({ component, onDragStart, className }: ComponentPaletteItemProps) {
  const IconComponent = (Icons as any)[component.icon] || Icons.Cube
  
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(component, e)}
      className={cn(
        'p-3 cursor-move hover:bg-accent/50 hover:border-accent transition-all',
        'flex flex-col items-center gap-2 text-center',
        'hover:scale-105 active:scale-95',
        className
      )}
    >
      <IconComponent className="w-6 h-6 text-primary" weight="duotone" />
      <span className="text-xs font-medium text-foreground">{component.label}</span>
      <span className="text-[10px] text-muted-foreground">{component.type}</span>
    </Card>
  )
}
