import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export function Tag({ 
  children, 
  variant = 'default', 
  size = 'md', 
  removable = false, 
  onRemove,
  className 
}: TagProps) {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}
