import { cn } from '@/lib/utils'

export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <div className={cn(
        'border-primary border-t-transparent rounded-full animate-spin',
        sizeClasses[size]
      )} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )
}
