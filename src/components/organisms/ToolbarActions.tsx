import { ToolbarButton } from '@/components/molecules'
import { ErrorBadge } from '@/components/atoms'
import {
  MagnifyingGlass,
  Keyboard,
  Sparkle,
  Download,
  Wrench,
  Eye,
} from '@phosphor-icons/react'

interface ToolbarActionsProps {
  onSearch: () => void
  onShowShortcuts: () => void
  onGenerateAI: () => void
  onExport: () => void
  onPreview?: () => void
  onShowErrors?: () => void
  errorCount?: number
  showErrorButton?: boolean
}

export function ToolbarActions({
  onSearch,
  onShowShortcuts,
  onGenerateAI,
  onExport,
  onPreview,
  onShowErrors,
  errorCount = 0,
  showErrorButton = false,
}: ToolbarActionsProps) {
  return (
    <div className="flex gap-1 sm:gap-2 shrink-0">
      <ToolbarButton
        icon={<MagnifyingGlass size={18} />}
        label="Search (Ctrl+K)"
        onClick={onSearch}
      />

      {showErrorButton && errorCount > 0 && onShowErrors && (
        <div className="relative">
          <ToolbarButton
            icon={<Wrench size={18} />}
            label={`${errorCount} ${errorCount === 1 ? 'Error' : 'Errors'}`}
            onClick={onShowErrors}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          />
          <ErrorBadge count={errorCount} size="sm" />
        </div>
      )}

      {onPreview && (
        <ToolbarButton
          icon={<Eye size={18} />}
          label="Preview (Ctrl+P)"
          onClick={onPreview}
          variant="outline"
        />
      )}

      <ToolbarButton
        icon={<Keyboard size={18} />}
        label="Keyboard Shortcuts (Ctrl+/)"
        onClick={onShowShortcuts}
        variant="ghost"
        className="hidden sm:flex"
      />

      <ToolbarButton
        icon={<Sparkle size={18} weight="duotone" />}
        label="AI Generate (Ctrl+Shift+G)"
        onClick={onGenerateAI}
      />

      <ToolbarButton
        icon={<Download size={18} />}
        label="Export Project (Ctrl+E)"
        onClick={onExport}
        variant="default"
      />
    </div>
  )
}
