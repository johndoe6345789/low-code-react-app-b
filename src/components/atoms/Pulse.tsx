import { cn } from '@/lib/utils'

interface PulseProps {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  speed?: 'slow' | 'normal' | 'fast'
  className?: string
}

export function Pulse({
  variant = 'primary',
  size = 'md',
  speed = 'normal',
  className,
}: PulseProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const variantClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  const speedClasses = {
    slow: 'animate-pulse [animation-duration:3s]',
    normal: 'animate-pulse',
    fast: 'animate-pulse [animation-duration:0.5s]',
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'inline-flex rounded-full opacity-75',
          sizeClasses[size],
          variantClasses[variant],
          speedClasses[speed]
        )}
      />
      <span
        className={cn(
          'absolute inline-flex rounded-full opacity-75',
          sizeClasses[size],
          variantClasses[variant],
          speedClasses[speed]
        )}
      />
    </div>
  )
}
