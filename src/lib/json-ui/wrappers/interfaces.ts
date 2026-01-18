import type { StorageBackendKey } from '@/components/storage/storageSettingsConfig'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbWrapperProps {
  items?: BreadcrumbItem[]
  className?: string
}

export type SaveIndicatorStatus = 'saved' | 'synced'

export interface SaveIndicatorWrapperProps {
  status?: SaveIndicatorStatus
  label?: string
  showLabel?: boolean
  animate?: boolean
  className?: string
}

export interface LazyBarChartWrapperProps {
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

export interface LazyLineChartWrapperProps {
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

export interface LazyD3BarChartWrapperProps {
  data: Array<{ label: string; value: number }>
  width?: number
  height?: number
  color?: string
  className?: string
}

export interface SeedDataManagerWrapperProps {
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

export interface StorageSettingsWrapperProps {
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
