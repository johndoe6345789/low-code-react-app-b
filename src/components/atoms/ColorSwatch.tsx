import { Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  color: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function ColorSwatch({ 
  color, 
  selected = false, 
  onClick, 
  size = 'md', 
  label,
  className 
}: ColorSwatchProps) {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'rounded border-2 transition-all flex items-center justify-center',
          sizeStyles[size],
          selected ? 'border-primary ring-2 ring-ring ring-offset-2' : 'border-border hover:border-ring',
          onClick && 'cursor-pointer'
        )}
        style={{ backgroundColor: color }}
        aria-label={label || `Color ${color}`}
      >
        {selected && <Check className="text-white drop-shadow-lg" weight="bold" />}
      </button>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}
