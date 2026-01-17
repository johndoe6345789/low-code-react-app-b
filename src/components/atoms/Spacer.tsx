import { cn } from '@/lib/utils'

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  axis?: 'horizontal' | 'vertical' | 'both'
  className?: string
}

const sizeClasses = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  '2xl': 24,
}

export function Spacer({ size = 'md', axis = 'vertical', className }: SpacerProps) {
  const spacing = sizeClasses[size]

  return (
    <div
      className={cn(className)}
      style={{
        width: axis === 'horizontal' || axis === 'both' ? `${spacing * 4}px` : undefined,
        height: axis === 'vertical' || axis === 'both' ? `${spacing * 4}px` : undefined,
      }}
      aria-hidden="true"
    />
  )
}
