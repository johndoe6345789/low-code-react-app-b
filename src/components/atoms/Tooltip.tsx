import { ReactNode } from 'react'
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
  className?: string
}

export function Tooltip({ 
  content, 
  children, 
  side = 'top',
  delayDuration = 200,
  className 
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {content}
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}
