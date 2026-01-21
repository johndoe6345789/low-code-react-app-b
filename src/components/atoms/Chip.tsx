import { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ChipProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'accent' | 'muted'
  size?: 'sm' | 'md'
  onRemove?: () => void
  className?: string
}

const variantClasses = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  muted: 'bg-muted text-muted-foreground',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Chip({ 
  children, 
  variant = 'default', 
  size = 'md',
  onRemove,
  className 
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
          aria-label="Remove"
        >
          <X size={size === 'sm' ? 12 : 14} weight="bold" />
        </button>
      )}
    </span>
  )
}
