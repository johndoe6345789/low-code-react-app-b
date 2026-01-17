import { Check, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  indeterminate?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Checkbox({ 
  checked, 
  onChange, 
  label, 
  indeterminate = false,
  disabled = false, 
  size = 'md',
  className 
}: CheckboxProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  }

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'flex items-center justify-center rounded border-2 transition-colors',
          sizeStyles[size],
          checked || indeterminate
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-background border-input hover:border-ring'
        )}
      >
        {indeterminate ? (
          <Minus size={iconSize[size]} weight="bold" />
        ) : checked ? (
          <Check size={iconSize[size]} weight="bold" />
        ) : null}
      </button>
      {label && <span className="text-sm font-medium select-none">{label}</span>}
    </label>
  )
}
