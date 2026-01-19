import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface ButtonProps extends ShadcnButtonProps {
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  children,
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      disabled={disabled || loading}
      className={cn(fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      )}
    </ShadcnButton>
  )
}
