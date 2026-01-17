import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  onClick?: () => void
}

export function Card({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  hover = false,
  className,
  onClick 
}: CardProps) {
  const variantStyles = {
    default: 'bg-card border border-border',
    bordered: 'bg-background border-2 border-border',
    elevated: 'bg-card shadow-lg border border-border',
    flat: 'bg-muted',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg transition-all',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:shadow-md hover:scale-[1.01] cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
