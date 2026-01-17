import { useCallback, useState } from 'react'
import seedDataConfig from '@/config/seed-data.json'

export function useSeedData() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadSeedData = useCallback(async () => {
    if (isLoading || isLoaded) return

    setIsLoading(true)
    try {
      if (!window.spark?.kv) {
        console.warn('Spark KV not available, skipping seed data')
        return
      }

      const keys = await window.spark.kv.keys()
      
      for (const [key, value] of Object.entries(seedDataConfig)) {
        if (!keys.includes(key)) {
          await window.spark.kv.set(key, value)
        }
      }
      
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to load seed data:', error)
      setIsLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isLoaded])

  const resetSeedData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (!window.spark?.kv) {
        console.warn('Spark KV not available')
        return
      }

      for (const [key, value] of Object.entries(seedDataConfig)) {
        await window.spark.kv.set(key, value)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to reset seed data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearAllData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (!window.spark?.kv) {
        console.warn('Spark KV not available')
        return
      }

      const keys = await window.spark.kv.keys()
      for (const key of keys) {
        await window.spark.kv.delete(key)
      }
      setIsLoaded(false)
    } catch (error) {
      console.error('Failed to clear data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoaded,
    isLoading,
    loadSeedData,
    resetSeedData,
    clearAllData,
  }
}
