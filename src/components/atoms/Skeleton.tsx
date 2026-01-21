import { cn } from '@/lib/utils'

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string | number
  height?: string | number
  className?: string
}

const variantClasses = {
  text: 'rounded h-4',
  rectangular: 'rounded-none',
  circular: 'rounded-full',
  rounded: 'rounded-lg',
}

export function Skeleton({ 
  variant = 'rectangular', 
  width,
  height,
  className 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted animate-pulse',
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}
