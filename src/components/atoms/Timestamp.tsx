import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface TimestampProps {
  date: Date | number | string
  relative?: boolean
  formatString?: string
  className?: string
}

export function Timestamp({ 
  date, 
  relative = false, 
  formatString = 'MMM d, yyyy h:mm a',
  className 
}: TimestampProps) {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  const displayText = relative 
    ? formatDistanceToNow(dateObj, { addSuffix: true })
    : format(dateObj, formatString)

  return (
    <time 
      dateTime={dateObj.toISOString()} 
      className={cn('text-sm text-muted-foreground', className)}
    >
      {displayText}
    </time>
  )
}
