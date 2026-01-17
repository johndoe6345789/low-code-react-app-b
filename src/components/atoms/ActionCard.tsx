import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { CaretRight } from '@phosphor-icons/react'

interface ActionCardProps {
  icon?: React.ReactNode
  title: string
  description?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function ActionCard({ icon, title, description, onClick, className, disabled }: ActionCardProps) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm mb-1">{title}</div>
            {description && (
              <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>
            )}
          </div>
          <CaretRight size={16} className="flex-shrink-0 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
