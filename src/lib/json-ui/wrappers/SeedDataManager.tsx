import { JSONUIRenderer } from '@/lib/json-ui'
import type { UIComponent } from '@/lib/json-ui/types'
import seedDataManagerDefinition from './definitions/seed-data-manager.json'

interface SeedDataManagerCopy {
  title: string
  description: string
  statusLoaded: string
  buttons: {
    load: string
    reset: string
    clear: string
    loadingLoad: string
    loadingReset: string
    loadingClear: string
  }
  help: {
    load: string
    reset: string
    clear: string
  }
}

const defaultCopy: SeedDataManagerCopy = {
  title: 'Seed Data Management',
  description: 'Load, reset, or clear application seed data from the database',
  statusLoaded: 'Seed data is loaded and available',
  buttons: {
    load: 'Load Seed Data',
    reset: 'Reset to Defaults',
    clear: 'Clear All Data',
    loadingLoad: 'Loading...',
    loadingReset: 'Resetting...',
    loadingClear: 'Clearing...',
  },
  help: {
    load: 'Populates database with initial data if not already loaded',
    reset: 'Overwrites all data with fresh seed data',
    clear: 'Removes all data from the database (destructive action)',
  },
}

export interface SeedDataManagerProps {
  isLoaded?: boolean
  isLoading?: boolean
  onLoadSeedData?: () => void
  onResetSeedData?: () => void
  onClearAllData?: () => void
  copy?: Partial<SeedDataManagerCopy>
}

const seedDataManagerComponent = seedDataManagerDefinition as UIComponent

export function SeedDataManager({
  isLoaded = false,
  isLoading = false,
  onLoadSeedData,
  onResetSeedData,
  onClearAllData,
  copy,
}: SeedDataManagerProps) {
  const resolvedCopy: SeedDataManagerCopy = {
    ...defaultCopy,
    ...copy,
    buttons: {
      ...defaultCopy.buttons,
      ...copy?.buttons,
    },
    help: {
      ...defaultCopy.help,
      ...copy?.help,
    },
  }

  const loadDisabled = !onLoadSeedData || isLoading || isLoaded
  const resetDisabled = !onResetSeedData || isLoading
  const clearDisabled = !onClearAllData || isLoading

  return (
    <JSONUIRenderer
      component={seedDataManagerComponent}
      dataMap={{
        title: resolvedCopy.title,
        description: resolvedCopy.description,
        statusLoaded: resolvedCopy.statusLoaded,
        onLoadSeedData,
        onResetSeedData,
        onClearAllData,
        isLoaded,
        loadDisabled,
        resetDisabled,
        clearDisabled,
        loadButtonText: isLoading
          ? resolvedCopy.buttons.loadingLoad
          : resolvedCopy.buttons.load,
        resetButtonText: isLoading
          ? resolvedCopy.buttons.loadingReset
          : resolvedCopy.buttons.reset,
        clearButtonText: isLoading
          ? resolvedCopy.buttons.loadingClear
          : resolvedCopy.buttons.clear,
        helpLoad: `Load Seed Data: ${resolvedCopy.help.load}`,
        helpReset: `Reset to Defaults: ${resolvedCopy.help.reset}`,
        helpClear: `Clear All Data: ${resolvedCopy.help.clear}`,
      }}
    />
  )
}
