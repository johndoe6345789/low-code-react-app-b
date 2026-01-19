import { Calendar as ShadcnCalendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: 'single' | 'multiple' | 'range'
  disabled?: Date | ((date: Date) => boolean)
  className?: string
}

export function Calendar({
  selected,
  onSelect,
  mode = 'single',
  disabled,
  className,
}: CalendarProps) {
  return (
    <ShadcnCalendar
      mode={mode as any}
      selected={selected}
      onSelect={onSelect as any}
      disabled={disabled}
      className={cn('rounded-md border', className)}
    />
  )
}
