import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
  className?: string
}

export function Accordion({ items, type = 'single', defaultOpen = [], className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(id) ? [] : [id])
    } else {
      setOpenItems(
        openItems.includes(id)
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)

        return (
          <div key={item.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between p-4 bg-card text-card-foreground font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span>{item.title}</span>
              <CaretDown
                className={cn(
                  'w-5 h-5 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="p-4 bg-card border-t border-border animate-in slide-in-from-top-2">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
