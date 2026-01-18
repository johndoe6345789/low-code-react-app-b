import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
  className?: string
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  className,
}: DrawerProps) {
  if (!isOpen) return null

  const positionStyles = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  }

  const sizeStyles = {
    sm: position === 'left' || position === 'right' ? 'w-64' : 'h-64',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[600px]' : 'h-[600px]',
  }

  const slideAnimation = {
    left: 'animate-in slide-in-from-left',
    right: 'animate-in slide-in-from-right',
    top: 'animate-in slide-in-from-top',
    bottom: 'animate-in slide-in-from-bottom',
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed z-50 bg-card border border-border shadow-lg',
          positionStyles[position],
          sizeStyles[size],
          slideAnimation[position],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-md hover:bg-accent transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </>
  )
}
