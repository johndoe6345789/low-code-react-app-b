import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  onConfirm: () => void | Promise<void>
  confirmText?: string
  isLoading?: boolean
}

export function ConfirmButton({
  onConfirm,
  confirmText = 'Are you sure?',
  isLoading,
  children,
  className,
  ...props
}: ConfirmButtonProps) {
  const handleClick = async () => {
    if (window.confirm(confirmText)) {
      await onConfirm()
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}
