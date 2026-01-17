import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface QuickActionButtonProps {
  icon: ReactNode
  label: string
  description?: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'accent' | 'muted'
  disabled?: boolean
  className?: string
}

export function QuickActionButton({
  icon,
  label,
  description,
  onClick,
  variant = 'default',
  disabled,
  className,
}: QuickActionButtonProps) {
  const variantClasses = {
    default: 'hover:bg-muted/50 hover:border-border',
    primary: 'hover:bg-primary/10 hover:border-primary/50',
    accent: 'hover:bg-accent/10 hover:border-accent/50',
    muted: 'bg-muted hover:bg-muted/70',
  }

  const iconColorClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
  }

  return (
    <Card
      onClick={disabled ? undefined : onClick}
      className={cn(
        'p-6 cursor-pointer transition-all duration-200',
        'flex flex-col items-center justify-center gap-3 text-center',
        'hover:scale-105 active:scale-95',
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      <div className={cn('text-4xl', iconColorClasses[variant])}>
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{label}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  )
}
