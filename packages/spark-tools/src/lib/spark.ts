/**
 * Spark Initialization Module
 * 
 * This module initializes the Spark runtime and makes it available globally
 * via window.spark. It should be imported early in the application lifecycle.
 */

import { sparkRuntime } from './spark-runtime'

// Declare global window.spark
declare global {
  interface Window {
    spark: typeof sparkRuntime
  }
}

// Initialize window.spark
if (typeof window !== 'undefined') {
  window.spark = sparkRuntime
}

export default sparkRuntime
