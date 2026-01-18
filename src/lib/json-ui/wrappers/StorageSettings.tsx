import type { ChangeEvent } from 'react'
import { JSONUIRenderer } from '@/lib/json-ui'
import type { UIComponent } from '@/lib/json-ui/types'
import {
  storageSettingsCopy,
  getBackendCopy,
  type StorageBackendKey,
} from '@/components/storage/storageSettingsConfig'
import storageSettingsDefinition from './definitions/storage-settings.json'

const defaultCopy = storageSettingsCopy.molecule

type StorageSettingsCopy = typeof defaultCopy

export interface StorageSettingsProps {
  backend: StorageBackendKey | null
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
  copy?: Partial<StorageSettingsCopy>
}

const storageSettingsComponent = storageSettingsDefinition as UIComponent

export function StorageSettings({
  backend,
  isLoading = false,
  flaskUrl = defaultCopy.flaskUrlPlaceholder,
  isSwitching = false,
  onFlaskUrlChange,
  onSwitchToFlask,
  onSwitchToIndexedDB,
  onSwitchToSQLite,
  isExporting = false,
  isImporting = false,
  onExport,
  onImport,
  copy,
}: StorageSettingsProps) {
  const resolvedCopy: StorageSettingsCopy = {
    ...defaultCopy,
    ...copy,
    buttons: {
      ...defaultCopy.buttons,
      ...copy?.buttons,
    },
    backendDetails: {
      ...defaultCopy.backendDetails,
      ...copy?.backendDetails,
    },
  }

  const backendCopy = getBackendCopy(backend)

  const handleFlaskUrlChange = onFlaskUrlChange
    ? (event: ChangeEvent<HTMLInputElement>) => onFlaskUrlChange(event.target.value)
    : undefined

  return (
    <JSONUIRenderer
      component={storageSettingsComponent}
      dataMap={{
        title: resolvedCopy.title,
        description: resolvedCopy.description,
        currentBackendLabel: resolvedCopy.currentBackendLabel,
        backendBadge: backendCopy.moleculeLabel,
        flaskUrlLabel: resolvedCopy.flaskUrlLabel,
        flaskUrlPlaceholder: resolvedCopy.flaskUrlPlaceholder,
        flaskHelp: resolvedCopy.flaskHelp,
        flaskDetails: resolvedCopy.backendDetails.flask,
        indexedDbDetails: resolvedCopy.backendDetails.indexeddb,
        sqliteDetails: resolvedCopy.backendDetails.sqlite,
        flaskUrl,
        onFlaskUrlChange: handleFlaskUrlChange,
        flaskUrlDisabled: isSwitching || isLoading,
        onSwitchToFlask,
        flaskButtonDisabled: !onSwitchToFlask || isSwitching || isLoading || backend === 'flask',
        flaskButtonVariant: backend === 'flask' ? 'secondary' : 'default',
        flaskButtonLabel:
          backend === 'flask'
            ? resolvedCopy.buttons.flaskActive
            : resolvedCopy.buttons.flaskUse,
        onSwitchToIndexedDB,
        indexedDbDisabled: !onSwitchToIndexedDB || isSwitching || isLoading || backend === 'indexeddb',
        indexedDbVariant: backend === 'indexeddb' ? 'secondary' : 'outline',
        indexedDbLabel:
          backend === 'indexeddb'
            ? resolvedCopy.buttons.indexeddbActive
            : resolvedCopy.buttons.indexeddbUse,
        onSwitchToSQLite,
        sqliteDisabled: !onSwitchToSQLite || isSwitching || isLoading || backend === 'sqlite',
        sqliteVariant: backend === 'sqlite' ? 'secondary' : 'outline',
        sqliteLabel:
          backend === 'sqlite'
            ? resolvedCopy.buttons.sqliteActive
            : resolvedCopy.buttons.sqliteUse,
        dataTitle: resolvedCopy.dataTitle,
        dataDescription: resolvedCopy.dataDescription,
        dataHelp: resolvedCopy.dataHelp,
        onExport,
        exportDisabled: !onExport || isExporting,
        exportLabel: resolvedCopy.buttons.export,
        onImport,
        importDisabled: !onImport || isImporting,
        importLabel: resolvedCopy.buttons.import,
      }}
    />
  )
}
