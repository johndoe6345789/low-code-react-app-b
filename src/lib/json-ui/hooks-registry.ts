/**
 * Hook Registry for JSON Components
 * Allows JSON components to use custom React hooks
 */
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
import { useAppLayout } from '@/hooks/use-app-layout'
import { useAppRouterLayout } from '@/hooks/use-app-router-layout'
import { useNavigationMenu } from '@/hooks/use-navigation-menu'
import { useDataSourceManagerState } from '@/hooks/use-data-source-manager-state'

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
  useAppLayout,
  useAppRouterLayout,
  useNavigationMenu,
  useDataSourceManagerState,
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
