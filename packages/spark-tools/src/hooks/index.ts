import { useState, useEffect, useCallback } from 'react'

/**
 * useKV Hook - Persistent key-value storage with localStorage and window.spark.kv integration
 * 
 * This hook provides persistent state management that syncs with localStorage
 * and integrates with the Spark KV storage system if available.
 * 
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue, deleteValue]
 */
export function useKV<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state from localStorage or default value
  const [value, setValueInternal] = useState<T>(() => {
    try {
      // Try to get from window.spark.kv first
      if (typeof window !== 'undefined' && window.spark?.kv) {
        const sparkValue = window.spark.kv.get(key)
        if (sparkValue !== undefined) {
          return sparkValue as T
        }
      }

      // Fallback to localStorage
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from storage:', error)
      return defaultValue
    }
  })

  // Set value and sync to storage
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setValueInternal((prevValue) => {
          const valueToStore =
            typeof newValue === 'function'
              ? (newValue as (prev: T) => T)(prevValue)
              : newValue

          // Store in localStorage
          localStorage.setItem(key, JSON.stringify(valueToStore))

          // Store in window.spark.kv if available
          if (typeof window !== 'undefined' && window.spark?.kv) {
            window.spark.kv.set(key, valueToStore)
          }

          return valueToStore
        })
      } catch (error) {
        console.error('Error writing to storage:', error)
      }
    },
    [key]
  )

  // Delete value from storage
  const deleteValue = useCallback(() => {
    try {
      localStorage.removeItem(key)
      if (typeof window !== 'undefined' && window.spark?.kv) {
        window.spark.kv.delete(key)
      }
      setValueInternal(defaultValue)
    } catch (error) {
      console.error('Error deleting from storage:', error)
    }
  }, [key, defaultValue])

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValueInternal(JSON.parse(e.newValue))
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [value, setValue, deleteValue]
}
