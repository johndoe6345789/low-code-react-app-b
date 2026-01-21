import { Button } from '@/components/ui/button'
import { forwardRef } from 'react'

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  title?: string
  className?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, onClick, disabled, variant = 'ghost', size = 'icon', title, className }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={className}
      >
        {icon}
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'
