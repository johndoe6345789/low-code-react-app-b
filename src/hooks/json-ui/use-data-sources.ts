/// <reference path="../../global.d.ts" />

import { useState, useEffect, useCallback } from 'react'
import { DataSource } from '@/types/json-ui'

export function useDataSources(dataSources: DataSource[]) {
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const initialData: Record<string, any> = {}

      for (const ds of dataSources) {
        if (ds.type === 'kv' && ds.key) {
          try {
            const value = await window.spark.kv.get(ds.key)
            initialData[ds.id] = value !== undefined ? value : ds.defaultValue
          } catch {
            initialData[ds.id] = ds.defaultValue
          }
        } else if (ds.type === 'static') {
          initialData[ds.id] = ds.defaultValue
        }
      }

      setData(initialData)
      setLoading(false)
    }

    loadData()
  }, [dataSources])

  const updateDataSource = useCallback(async (id: string, value: any) => {
    setData((prev) => ({ ...prev, [id]: value }))

    const kvSource = dataSources.find((ds) => ds.id === id && ds.type === 'kv')
    if (kvSource && kvSource.key) {
      await window.spark.kv.set(kvSource.key, value)
    }
  }, [dataSources])

  return {
    data,
    loading,
    updateDataSource,
  }
}
