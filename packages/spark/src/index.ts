/**
 * @github/spark - Main Entry Point
 * 
 * This is the main entry point for the Spark package.
 * It re-exports all core functionality.
 */

export { sparkRuntime } from './spark-runtime'
export { useKV } from './hooks/index'
export { default as sparkPlugin } from './spark-vite-plugin.mjs'
export { default as createIconImportProxy } from './vitePhosphorIconProxyPlugin.mjs'
