import type { StorageBackendKey } from '@/components/storage/storageSettingsConfig'
import type { UIComponent } from '@/types/json-ui'

export type SaveIndicatorStatus = 'saved' | 'synced'

export interface SaveIndicatorProps {
  lastSaved?: number | null
  status?: SaveIndicatorStatus
  label?: string
  showLabel?: boolean
  animate?: boolean
  className?: string
}

export interface LazyBarChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  width?: number | string
  height?: number
  color?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  className?: string
}

export interface LazyLineChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  width?: number | string
  height?: number
  color?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  className?: string
}

export interface LazyD3BarChartProps {
  data: Array<{ label: string; value: number }>
  width?: number
  height?: number
  color?: string
  className?: string
}

export interface SeedDataManagerProps {
  isLoaded?: boolean
  isLoading?: boolean
  title?: string
  description?: string
  loadLabel?: string
  loadingLabel?: string
  resetLabel?: string
  resettingLabel?: string
  clearLabel?: string
  clearingLabel?: string
  onLoadSeedData?: () => void
  onResetSeedData?: () => void
  onClearAllData?: () => void
  helperText?: {
    load?: string
    reset?: string
    clear?: string
  }
}

export interface StorageSettingsProps {
  backend?: StorageBackendKey | null
  isLoading?: boolean
  flaskUrl?: string
  isSwitching?: boolean
  onFlaskUrlChange?: (value: string) => void
  onSwitchToFlask?: () => void
  onSwitchToIndexedDB?: () => void
  onSwitchToSQLite?: () => void
  isExporting?: boolean
  isImporting?: boolean
  onExport?: () => void
  onImport?: () => void
}

export interface GitHubBuildStatusWorkflowItem {
  id: string
  name: string
  status?: string
  conclusion?: string | null
  branch?: string
  updatedAt?: string
  event?: string
  url?: string
}

export interface GitHubBuildStatusProps {
  title?: string
  description?: string
  workflows?: GitHubBuildStatusWorkflowItem[]
  isLoading?: boolean
  errorMessage?: string
  emptyMessage?: string
  footerLinkLabel?: string
  footerLinkUrl?: string
  className?: string
}

export interface ComponentBindingField {
  id: string
  label: string
  value?: string
  placeholder?: string
}

export interface ComponentBindingDialogProps {
  open?: boolean
  title?: string
  description?: string
  componentType?: string
  componentId?: string
  bindings?: ComponentBindingField[]
  onBindingChange?: (id: string, value: string) => void
  onSave?: () => void
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void
  className?: string
}

export interface DataSourceField {
  id: string
  label: string
  value?: string
  placeholder?: string
  helperText?: string
}

export interface DataSourceEditorDialogProps {
  open?: boolean
  title?: string
  description?: string
  fields?: DataSourceField[]
  onFieldChange?: (id: string, value: string) => void
  onSave?: () => void
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void
  className?: string
}

export interface ComponentTreeProps {
  components?: UIComponent[]
  selectedId?: string | null
  emptyMessage?: string
  onSelect?: (id: string) => void
  className?: string
}
