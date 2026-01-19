import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

interface ScrollAreaProps {
  children: ReactNode
  className?: string
  maxHeight?: string | number
}

export function ScrollArea({ children, className, maxHeight }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root 
      className={cn('relative overflow-hidden', className)}
      style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className="flex touch-none select-none transition-colors p-0.5 bg-transparent hover:bg-muted"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 bg-border rounded-full relative" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar
        className="flex touch-none select-none transition-colors p-0.5 bg-transparent hover:bg-muted"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 bg-border rounded-full relative" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
