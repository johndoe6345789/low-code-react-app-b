import { LoadingSpinner } from '@/components/atoms'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
