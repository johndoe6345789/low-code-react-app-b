import { cn } from '@/lib/utils'

interface DotProps {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
}

const variantClasses = {
  default: 'bg-muted-foreground',
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-destructive',
}

const sizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export function Dot({ 
  variant = 'default', 
  size = 'sm', 
  pulse = false,
  className 
}: DotProps) {
  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          'inline-block rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      />
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex rounded-full opacity-75 animate-ping',
            variantClasses[variant],
            sizeClasses[size]
          )}
        />
      )}
    </span>
  )
}
