import { LoadingSpinner } from '@/components/atoms'

interface LoadingFallbackProps {
  message?: string
}

export function LoadingFallback({ message = 'Loading...' }: LoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
