import { cn } from '@/lib/utils'
import { Sparkle as SparkleIcon } from '@phosphor-icons/react'

interface SparkleProps {
  variant?: 'default' | 'primary' | 'accent' | 'gold'
  size?: number
  animate?: boolean
  className?: string
}

export function Sparkle({
  variant = 'default',
  size = 16,
  animate = true,
  className,
}: SparkleProps) {
  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
    gold: 'text-yellow-500',
  }

  return (
    <SparkleIcon
      size={size}
      weight="fill"
      className={cn(
        variantClasses[variant],
        animate && 'animate-pulse',
        className
      )}
    />
  )
}
