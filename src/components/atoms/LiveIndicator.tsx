import { cn } from '@/lib/utils'

interface LiveIndicatorProps {
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LiveIndicator({
  label = 'LIVE',
  showLabel = true,
  size = 'md',
  className,
}: LiveIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs gap-1.5',
    md: 'text-sm gap-2',
    lg: 'text-base gap-2.5',
  }

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }

  return (
    <div className={cn('inline-flex items-center font-medium', sizeClasses[size], className)}>
      <span className="relative flex">
        <span
          className={cn(
            'absolute inline-flex rounded-full bg-red-500 opacity-75 animate-ping',
            dotSizeClasses[size]
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full bg-red-500',
            dotSizeClasses[size]
          )}
        />
      </span>
      {showLabel && (
        <span className="text-red-500 font-bold tracking-wider">{label}</span>
      )}
    </div>
  )
}
