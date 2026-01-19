import { Star } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showValue?: boolean
  className?: string
}

export function Rating({ 
  value, 
  onChange, 
  max = 5, 
  size = 'md', 
  readonly = false,
  showValue = false,
  className 
}: RatingProps) {
  const sizeStyles = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  const iconSize = sizeStyles[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= value
          const isHalfFilled = starValue - 0.5 === value

          return (
            <button
              key={index}
              type="button"
              onClick={() => !readonly && onChange?.(starValue)}
              disabled={readonly}
              className={cn(
                'transition-colors',
                !readonly && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
              aria-label={`Rate ${starValue} out of ${max}`}
            >
              <Star
                size={iconSize}
                weight={isFilled ? 'fill' : 'regular'}
                className={cn(
                  'transition-colors',
                  isFilled ? 'text-accent fill-accent' : 'text-muted'
                )}
              />
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  )
}
