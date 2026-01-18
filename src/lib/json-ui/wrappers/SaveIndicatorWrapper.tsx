import { StatusIcon } from '@/components/atoms'
import { cn } from '@/lib/utils'
import type { SaveIndicatorWrapperProps } from './interfaces'

export function SaveIndicatorWrapper({
  status = 'saved',
  label,
  showLabel = true,
  animate,
  className,
}: SaveIndicatorWrapperProps) {
  const resolvedLabel = label ?? (status === 'saved' ? 'Saved' : 'Synced')
  const shouldAnimate = animate ?? status === 'saved'

  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <StatusIcon type={status} animate={shouldAnimate} />
      {showLabel && <span className="hidden sm:inline">{resolvedLabel}</span>}
    </div>
  )
}
