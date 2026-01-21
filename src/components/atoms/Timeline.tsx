import { cn } from '@/lib/utils'

interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  icon?: React.ReactNode
  status?: 'completed' | 'current' | 'pending'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const status = item.status || 'pending'

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                  status === 'completed' && 'bg-primary border-primary text-primary-foreground',
                  status === 'current' && 'bg-accent border-accent text-accent-foreground',
                  status === 'pending' && 'bg-background border-muted text-muted-foreground'
                )}
              >
                {item.icon || (
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      status === 'completed' && 'bg-primary-foreground',
                      status === 'current' && 'bg-accent-foreground',
                      status === 'pending' && 'bg-muted'
                    )}
                  />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[40px] transition-colors',
                    status === 'completed' ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4
                    className={cn(
                      'font-medium',
                      status === 'pending' && 'text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.timestamp && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
