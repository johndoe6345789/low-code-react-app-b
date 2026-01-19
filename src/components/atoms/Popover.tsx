import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Popover({ trigger, content, placement = 'bottom', className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const placementStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            'absolute z-50 w-64 p-4 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
            placementStyles[placement],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
