import { Button, Flex } from '@/components/atoms'
import { Info, Sparkle } from '@phosphor-icons/react'

interface EditorActionsProps {
  onExplain: () => void
  onImprove: () => void
}

export function EditorActions({ onExplain, onImprove }: EditorActionsProps) {
  return (
    <Flex gap="sm">
      <Button
        size="sm"
        variant="ghost"
        onClick={onExplain}
        className="h-7 text-xs"
        leftIcon={<Info size={14} />}
      >
        Explain
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onImprove}
        className="h-7 text-xs"
        leftIcon={<Sparkle size={14} weight="duotone" />}
      >
        Improve
      </Button>
    </Flex>
  )
}
