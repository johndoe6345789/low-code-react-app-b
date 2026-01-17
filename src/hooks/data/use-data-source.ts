import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export type DataSourceType = 'kv' | 'static' | 'computed'

export interface DataSourceConfig<T = any> {
  id: string
  type: DataSourceType
  key?: string
  defaultValue?: T
  compute?: (allData: Record<string, any>) => T
  dependencies?: string[]
}

export function useKVDataSource<T>(key: string, defaultValue: T) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)
  
  return {
    data: value,
    setData: setValue,
    deleteData: deleteValue,
    isLoading: false,
    error: null,
  }
}

export function useComputedDataSource<T>(
  compute: (allData: Record<string, any>) => T,
  allData: Record<string, any>,
  dependencies: string[],
  defaultValue?: T
) {
  const [computed, setComputed] = useState<T>(defaultValue as T)

  useEffect(() => {
    try {
      const newValue = compute(allData)
      setComputed(newValue)
    } catch (error) {
      console.error('Error computing data source:', error)
    }
  }, dependencies.map(dep => allData[dep]))

  return {
    data: computed,
    setData: () => {},
    deleteData: () => {},
    isLoading: false,
    error: null,
  }
}

export function useStaticDataSource<T>(value: T) {
  return {
    data: value,
    setData: () => {},
    deleteData: () => {},
    isLoading: false,
    error: null,
  }
}

export function useMultipleDataSources(
  configs: DataSourceConfig[],
  onUpdate?: (data: Record<string, any>) => void
) {
  const [allData, setAllData] = useState<Record<string, any>>({})
  
  const updateData = useCallback((id: string, value: any) => {
    setAllData(prev => {
      const next = { ...prev, [id]: value }
      onUpdate?.(next)
      return next
    })
  }, [onUpdate])

  return {
    allData,
    updateData,
  }
}
