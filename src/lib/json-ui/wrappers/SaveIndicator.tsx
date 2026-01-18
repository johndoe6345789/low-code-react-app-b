import { JSONUIRenderer } from '@/lib/json-ui'
import type { UIComponent } from '@/lib/json-ui/types'
import saveIndicatorDefinition from './definitions/save-indicator.json'

export interface SaveIndicatorProps {
  status?: 'saved' | 'synced'
  label?: string
  showLabel?: boolean
  animate?: boolean
  className?: string
}

const saveIndicatorComponent = saveIndicatorDefinition as UIComponent

export function SaveIndicator({
  status = 'saved',
  label,
  showLabel = true,
  animate,
  className,
}: SaveIndicatorProps) {
  if (!status) {
    return null
  }

  const resolvedLabel = label ?? (status === 'saved' ? 'Saved' : 'Synced')
  const shouldAnimate = animate ?? status === 'saved'

  return (
    <JSONUIRenderer
      component={saveIndicatorComponent}
      dataMap={{
        status,
        label: resolvedLabel,
        showLabel,
        animate: shouldAnimate,
        className,
      }}
    />
  )
}
