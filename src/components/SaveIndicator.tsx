import { useEffect, useState } from 'react'
import { CheckCircle, CloudCheck } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

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
      {isRecent ? (
        <>
          <CheckCircle size={14} weight="fill" className="text-accent animate-in zoom-in duration-200" />
          <span className="hidden sm:inline">Saved</span>
        </>
      ) : (
        <>
          <CloudCheck size={14} weight="duotone" />
          <span className="hidden sm:inline">{timeAgo}</span>
        </>
      )}
    </div>
  )
}
