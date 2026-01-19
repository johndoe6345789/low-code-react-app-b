import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  glowColor?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  onClick?: () => void
}

export function GlowCard({
  children,
  glowColor = 'primary',
  intensity = 'medium',
  className,
  onClick,
}: GlowCardProps) {
  const glowClasses = {
    primary: {
      low: 'shadow-primary/10',
      medium: 'shadow-primary/20 hover:shadow-primary/30',
      high: 'shadow-primary/30 hover:shadow-primary/50',
    },
    accent: {
      low: 'shadow-accent/10',
      medium: 'shadow-accent/20 hover:shadow-accent/30',
      high: 'shadow-accent/30 hover:shadow-accent/50',
    },
    success: {
      low: 'shadow-green-500/10',
      medium: 'shadow-green-500/20 hover:shadow-green-500/30',
      high: 'shadow-green-500/30 hover:shadow-green-500/50',
    },
    warning: {
      low: 'shadow-yellow-500/10',
      medium: 'shadow-yellow-500/20 hover:shadow-yellow-500/30',
      high: 'shadow-yellow-500/30 hover:shadow-yellow-500/50',
    },
    error: {
      low: 'shadow-red-500/10',
      medium: 'shadow-red-500/20 hover:shadow-red-500/30',
      high: 'shadow-red-500/30 hover:shadow-red-500/50',
    },
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'transition-all duration-300',
        'shadow-lg',
        glowClasses[glowColor][intensity],
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </Card>
  )
}
