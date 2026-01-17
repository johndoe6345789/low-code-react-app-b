import { CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href || item.onClick ? (
              <button
                onClick={item.onClick}
                className={cn(
                  'text-sm transition-colors',
                  isLast
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </button>
            ) : (
              <span
                className={cn(
                  'text-sm',
                  isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && <CaretRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        )
      })}
    </nav>
  )
}
