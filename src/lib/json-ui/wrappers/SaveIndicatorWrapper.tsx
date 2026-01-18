import { StatusIcon } from '@/components/atoms'
import { useSaveIndicator } from '@/hooks/use-save-indicator'
import { cn } from '@/lib/utils'
import type { SaveIndicatorWrapperProps } from './interfaces'

export function SaveIndicatorWrapper({
  lastSaved,
  status = 'saved',
  label,
  showLabel = true,
  animate,
  className,
}: SaveIndicatorWrapperProps) {
  const { timeAgo, isRecent } = useSaveIndicator(lastSaved ?? null)

  if (lastSaved) {
    const resolvedStatus = isRecent ? 'saved' : 'synced'
    const resolvedLabel = label ?? (isRecent ? 'Saved' : timeAgo)
    const shouldAnimate = animate ?? isRecent

    return (
      <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <StatusIcon type={resolvedStatus} animate={shouldAnimate} />
        {showLabel && <span className="hidden sm:inline">{resolvedLabel}</span>}
      </div>
    )
  }

  const resolvedLabel = label ?? (status === 'saved' ? 'Saved' : 'Synced')
  const shouldAnimate = animate ?? status === 'saved'

  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <StatusIcon type={status} animate={shouldAnimate} />
      {showLabel && <span className="hidden sm:inline">{resolvedLabel}</span>}
    </div>
  )
}
