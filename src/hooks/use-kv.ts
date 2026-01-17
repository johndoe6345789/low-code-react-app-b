import { useState, useEffect, useCallback } from 'react'

export function useKV<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValueInternal] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.spark?.kv) {
        const sparkValue = window.spark.kv.get(key)
        if (sparkValue !== undefined) {
          return sparkValue as T
        }
      }

      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from storage:', error)
      return defaultValue
    }
  })

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setValueInternal((prevValue) => {
          const valueToStore =
            typeof newValue === 'function'
              ? (newValue as (prev: T) => T)(prevValue)
              : newValue

          localStorage.setItem(key, JSON.stringify(valueToStore))

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
