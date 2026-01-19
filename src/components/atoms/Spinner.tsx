import { CircleNotch } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <CircleNotch 
      size={size} 
      weight="bold"
      className={cn('animate-spin text-primary', className)}
    />
  )
}
