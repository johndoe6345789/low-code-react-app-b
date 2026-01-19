import {
  HoverCard as ShadcnHoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HoverCardProps {
  trigger: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function HoverCard({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
  className,
}: HoverCardProps) {
  return (
    <ShadcnHoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent side={side} align={align} className={cn(className)}>
        {children}
      </HoverCardContent>
    </ShadcnHoverCard>
  )
}
