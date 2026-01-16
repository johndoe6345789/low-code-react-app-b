import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { StatusIcon } from '@/components/atoms'

interface SaveIndicatorProps {
  lastSaved: number | null
}

export function SaveIndicator({ lastSaved }: SaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const distance = formatDistanceToNow(lastSaved, { addSuffix: true })
      setTimeAgo(distance)
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000)

    return () => clearInterval(interval)
  }, [lastSaved])

  if (!lastSaved) return null

  const isRecent = Date.now() - lastSaved < 3000

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <StatusIcon type={isRecent ? 'saved' : 'synced'} animate={isRecent} />
      <span className="hidden sm:inline">{isRecent ? 'Saved' : timeAgo}</span>
    </div>
  )
}
