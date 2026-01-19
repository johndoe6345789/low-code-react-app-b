/**
 * Pure JSON components - no TypeScript wrappers needed
 * Interfaces are defined in src/lib/json-ui/interfaces/
 * JSON definitions are in src/components/json-definitions/
 */
import { createJsonComponent } from './create-json-component'
import { createJsonComponentWithHooks } from './create-json-component-with-hooks'
import type {
  LoadingFallbackProps,
  NavigationItemProps,
  PageHeaderContentProps,
  SaveIndicatorProps,
  LazyBarChartProps,
  LazyLineChartProps,
  LazyD3BarChartProps,
  SeedDataManagerProps,
  StorageSettingsProps,
  GitHubBuildStatusProps,
  ComponentBindingDialogProps,
  DataSourceEditorDialogProps,
  ComponentTreeProps,
} from './interfaces'

// Import JSON definitions
import loadingFallbackDef from '@/components/json-definitions/loading-fallback.json'
import navigationItemDef from '@/components/json-definitions/navigation-item.json'
import pageHeaderContentDef from '@/components/json-definitions/page-header-content.json'
import componentBindingDialogDef from '@/components/json-definitions/component-binding-dialog.json'
import dataSourceEditorDialogDef from '@/components/json-definitions/data-source-editor-dialog.json'
import githubBuildStatusDef from '@/components/json-definitions/github-build-status.json'
import saveIndicatorDef from '@/components/json-definitions/save-indicator.json'
import componentTreeDef from '@/components/json-definitions/component-tree.json'
import seedDataManagerDef from '@/components/json-definitions/seed-data-manager.json'
import lazyD3BarChartDef from '@/components/json-definitions/lazy-d3-bar-chart.json'
import storageSettingsDef from '@/components/json-definitions/storage-settings.json'

// Create pure JSON components (no hooks)
export const LoadingFallback = createJsonComponent<LoadingFallbackProps>(loadingFallbackDef)
export const NavigationItem = createJsonComponent<NavigationItemProps>(navigationItemDef)
export const PageHeaderContent = createJsonComponent<PageHeaderContentProps>(pageHeaderContentDef)
export const ComponentBindingDialog = createJsonComponent<ComponentBindingDialogProps>(componentBindingDialogDef)
export const DataSourceEditorDialog = createJsonComponent<DataSourceEditorDialogProps>(dataSourceEditorDialogDef)
export const GitHubBuildStatus = createJsonComponent<GitHubBuildStatusProps>(githubBuildStatusDef)
export const SeedDataManager = createJsonComponent<SeedDataManagerProps>(seedDataManagerDef)

// Create JSON components with hooks
export const SaveIndicator = createJsonComponentWithHooks<SaveIndicatorProps>(saveIndicatorDef, {
  hooks: {
    hookData: {
      hookName: 'useSaveIndicator',
      args: (props) => [props.lastSaved ?? null]
    }
  }
})

export const ComponentTree = createJsonComponentWithHooks<ComponentTreeProps>(componentTreeDef, {
  hooks: {
    treeData: {
      hookName: 'useComponentTree',
      args: (props) => [props.components || [], props.selectedId || null]
    }
  }
})

export const LazyD3BarChart = createJsonComponentWithHooks<LazyD3BarChartProps>(lazyD3BarChartDef, {
  hooks: {
    chartData: {
      hookName: 'useD3BarChart',
      args: (props) => [props.data, props.width, props.height]
    }
  }
})

export const StorageSettings = createJsonComponentWithHooks<StorageSettingsProps>(storageSettingsDef, {
  hooks: {
    backendInfo: {
      hookName: 'useStorageBackendInfo',
      args: (props) => [props.backend || null]
    }
  }
})

// All components converted to pure JSON! 🎉
