import { cn } from '@/lib/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  decorative?: boolean
}

export function Divider({ 
  orientation = 'horizontal', 
  className,
  decorative = true 
}: DividerProps) {
  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full',
        className
      )}
    />
  )
}
