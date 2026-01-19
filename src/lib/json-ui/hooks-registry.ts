/**
 * Hook Registry for JSON Components
 * Allows JSON components to use custom React hooks
 */
import { useSaveIndicator } from '@/hooks/use-save-indicator'
import { useComponentTree } from '@/hooks/use-component-tree'
import { useStorageBackendInfo } from '@/hooks/use-storage-backend-info'
import { useD3BarChart } from '@/hooks/use-d3-bar-chart'

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
