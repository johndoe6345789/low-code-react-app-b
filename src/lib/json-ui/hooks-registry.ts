/**
 * Hook Registry for JSON Components
 * Allows JSON components to use custom React hooks
 */
import { useProjectExport } from '@/hooks/use-project-export'
import { useRoutePreload } from '@/hooks/use-route-preload'
import { useDynamicText } from '@/hooks/use-dynamic-text'
import { useProjectState } from '@/hooks/use-project-state'
import { useConflictResolutionPage } from '@/hooks/use-conflict-resolution-page'
import { useReduxComponentTrees } from '@/hooks/use-redux-component-trees'
import { usePersistenceDashboard } from '@/hooks/use-persistence-dashboard'
import { useActiveSelection } from '@/hooks/use-active-selection'
import { useDialogState } from '@/hooks/use-dialog-state'
import { useComponentTreeBuilder } from '@/hooks/use-component-tree-builder'
import { usePWA } from '@/hooks/use-pwa'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useProjectManager } from '@/hooks/use-project-manager'
import { useSchemaLoader } from '@/hooks/use-schema-loader'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAppBootstrap } from '@/hooks/use-app-bootstrap'
import { useUnifiedStorage } from '@/hooks/use-unified-storage'
import { useKV } from '@/hooks/use-kv'
import { useReduxFiles } from '@/hooks/use-redux-files'
import { useStaticSourceFields } from '@/hooks/use-static-source-fields'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useComponentBindingDialog } from '@/hooks/use-component-binding-dialog'
import { useProjectManagerDialogs } from '@/hooks/use-project-manager-dialogs'
import { useThemeConfig } from '@/hooks/use-theme-config'
import { useConflictResolution } from '@/hooks/use-conflict-resolution'
import { useLastSaved } from '@/hooks/use-last-saved'
import { useComponentTreeExpansion } from '@/hooks/use-component-tree-expansion'
import { useTabNavigation } from '@/hooks/use-tab-navigation'
import { useTemplateExplorerActions } from '@/hooks/use-template-explorer-actions'
import { useReduxSync } from '@/hooks/use-redux-sync'
import { useNavigationHistory } from '@/hooks/use-navigation-history'
import { useComponentTreeLoader } from '@/hooks/use-component-tree-loader'
import { useAIOperations } from '@/hooks/use-ai-operations'
import { useGithubBuildStatus } from '@/hooks/use-github-build-status'
import { useDataSourceEditor } from '@/hooks/use-data-source-editor'
import { useFileFilters } from '@/hooks/use-file-filters'
import { useIndexedDB } from '@/hooks/use-indexed-db'
import { useProjectLoader } from '@/hooks/use-project-loader'
import { useRouterNavigation } from '@/hooks/use-router-navigation'
import { useStorage } from '@/hooks/use-storage'
import { useComponentTreeNodes } from '@/hooks/use-component-tree-nodes'
import { useAutoRepair } from '@/hooks/use-auto-repair'
import { useCodeExplanation } from '@/hooks/use-code-explanation'
import { useDataSourceManager } from '@/hooks/use-data-source-manager'
import { usePersistence } from '@/hooks/use-persistence'
import { useSaveIndicator } from '@/hooks/use-save-indicator'
import { useComponentTree } from '@/hooks/use-component-tree'
import { useStorageBackendInfo } from '@/hooks/use-storage-backend-info'
import { useD3BarChart } from '@/hooks/use-d3-bar-chart'
import { useFocusState } from '@/hooks/use-focus-state'
import { useCopyState } from '@/hooks/use-copy-state'
import { usePasswordVisibility } from '@/hooks/use-password-visibility'
import { useImageState } from '@/hooks/use-image-state'
import { usePopoverState } from '@/hooks/use-popover-state'
import { useMenuState } from '@/hooks/use-menu-state'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useAccordion } from '@/hooks/use-accordion'
import { useBindingEditor } from '@/hooks/use-binding-editor'
import { useNavigationMenu } from '@/hooks/use-navigation-menu'

export interface HookRegistry {
  [key: string]: (...args: any[]) => any
}

/**
 * Registry of all custom hooks available to JSON components
 */
export const hooksRegistry: HookRegistry = {
  useSaveIndicator,
  useComponentTree,
  useStorageBackendInfo,
  useD3BarChart,
  useFocusState,
  useCopyState,
  usePasswordVisibility,
  useImageState,
  usePopoverState,
  useMenuState,
  useFileUpload,
  useAccordion,
  useBindingEditor,
  useNavigationMenu,
  useProjectExport,
  useRoutePreload,
  useDynamicText,
  useProjectState,
  useConflictResolutionPage,
  useReduxComponentTrees,
  usePersistenceDashboard,
  useActiveSelection,
  useDialogState,
  useComponentTreeBuilder,
  usePWA,
  useFileOperations,
  useProjectManager,
  useSchemaLoader,
  useIsMobile,
  useAppBootstrap,
  useUnifiedStorage,
  useKV,
  useReduxFiles,
  useStaticSourceFields,
  useKeyboardShortcuts,
  useComponentBindingDialog,
  useProjectManagerDialogs,
  useThemeConfig,
  useConflictResolution,
  useLastSaved,
  useComponentTreeExpansion,
  useTabNavigation,
  useTemplateExplorerActions,
  useReduxSync,
  useNavigationHistory,
  useComponentTreeLoader,
  useAIOperations,
  useGithubBuildStatus,
  useDataSourceEditor,
  useFileFilters,
  useIndexedDB,
  useProjectLoader,
  useRouterNavigation,
  useStorage,
  useComponentTreeNodes,
  useAutoRepair,
  useCodeExplanation,
  useDataSourceManager,
  usePersistence,
  // Add more hooks here as needed
}

/**
 * Get a hook from the registry by name
 */
export function getHook(hookName: string) {
  return hooksRegistry[hookName]
}

/**
 * Register a new hook
 */
export function registerHook(name: string, hook: (...args: any[]) => any) {
  hooksRegistry[name] = hook
}
