import { useEffect, useState } from 'react'
import seedDataConfig from '@/config/seed-data.json'

export function useSeedData() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadSeedData = async () => {
    if (isLoading || isLoaded) return

    setIsLoading(true)
    try {
      const keys = await window.spark.kv.keys()
      
      for (const [key, value] of Object.entries(seedDataConfig)) {
        if (!keys.includes(key)) {
          await window.spark.kv.set(key, value)
        }
      }
      
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to load seed data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSeedData = async () => {
    setIsLoading(true)
    try {
      for (const [key, value] of Object.entries(seedDataConfig)) {
        await window.spark.kv.set(key, value)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to reset seed data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllData = async () => {
    setIsLoading(true)
    try {
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
  }

  return {
    isLoaded,
    isLoading,
    loadSeedData,
    resetSeedData,
    clearAllData,
  }
}
