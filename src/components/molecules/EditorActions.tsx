import { Button } from '@/components/ui/button'
import { Info, Sparkle } from '@phosphor-icons/react'

interface EditorActionsProps {
  onExplain: () => void
  onImprove: () => void
}

export function EditorActions({ onExplain, onImprove }: EditorActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={onExplain}
        className="h-7 text-xs"
      >
        <Info size={14} className="mr-1" />
        Explain
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onImprove}
        className="h-7 text-xs"
      >
        <Sparkle size={14} className="mr-1" weight="duotone" />
        Improve
      </Button>
    </div>
  )
}
