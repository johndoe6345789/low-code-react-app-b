import { useState, useRef, useEffect } from 'react'
import { CaretRight, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  selected?: boolean
  divider?: boolean
  danger?: boolean
  shortcut?: string
  onClick?: () => void
}

interface MenuProps {
  trigger: React.ReactNode
  items: MenuItem[]
  className?: string
}

export function Menu({ trigger, items, className }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden',
            'animate-in fade-in-0 zoom-in-95',
            className
          )}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 h-px bg-border" />
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    item.danger && 'text-destructive hover:bg-destructive hover:text-destructive-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                    )}
                    {item.selected && <Check className="w-4 h-4" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
