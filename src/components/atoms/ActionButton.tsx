import { Button } from '@/components/ui/button'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ActionButtonProps {
  icon?: React.ReactNode
  label?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, label, variant = 'default', size = 'default', onClick, disabled, loading, className }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(className)}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
        {label && <span className={icon ? 'ml-2' : ''}>{label}</span>}
      </Button>
    )
  }
)

ActionButton.displayName = 'ActionButton'
