import { StatusIcon } from '@/components/atoms'
import { useSaveIndicator } from '@/hooks/use-save-indicator'

interface SaveIndicatorProps {
  lastSaved: number | null
}

export function SaveIndicator({ lastSaved }: SaveIndicatorProps) {
  if (!lastSaved) return null

  const { timeAgo, isRecent } = useSaveIndicator(lastSaved)

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <StatusIcon type={isRecent ? 'saved' : 'synced'} animate={isRecent} />
      <span className="hidden sm:inline">{isRecent ? 'Saved' : timeAgo}</span>
    </div>
  )
}
