import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@/hooks/use-kv'
import type { DataSourceConfig } from './types'

export function useJSONDataSource(id: string, config: DataSourceConfig) {
  const [kvValue, setKVValue] = useKV(config.key || id, config.defaultValue)
  const [apiValue, setApiValue] = useState(config.defaultValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAPI = useCallback(async () => {
    if (config.type !== 'api' || !config.url) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(config.url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      let data = await response.json()
      
      if (config.transform) {
        data = config.transform(data)
      }
      
      setApiValue(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [config.type, config.url, config.transform])

  useEffect(() => {
    if (config.type === 'api') {
      fetchAPI()
    }
  }, [config.type, fetchAPI])

  const getValue = () => {
    switch (config.type) {
      case 'kv':
        return kvValue
      case 'api':
        return apiValue
      case 'static':
        return config.defaultValue
      case 'computed':
        return config.defaultValue
      default:
        return null
    }
  }

  const setValue = (newValue: any) => {
    switch (config.type) {
      case 'kv':
        setKVValue(newValue)
        break
      case 'api':
        setApiValue(newValue)
        break
      default:
        break
    }
  }

  return {
    value: getValue(),
    setValue,
    loading,
    error,
    refetch: fetchAPI,
  }
}

export function useJSONDataSources(sources: Record<string, DataSourceConfig>) {
  const [dataMap, setDataMap] = useState<Record<string, unknown>>({})
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
  const [errorMap, setErrorMap] = useState<Record<string, Error | null>>({})

  const sourceIds = Object.keys(sources)

  const updateData = useCallback((id: string, value: unknown) => {
    setDataMap((prev) => ({ ...prev, [id]: value }))
  }, [])

  const getData = useCallback((id: string) => dataMap[id], [dataMap])

  useEffect(() => {
    sourceIds.forEach((id) => {
      const config = sources[id]
      
      if (config.type === 'static') {
        updateData(id, config.defaultValue)
      }
    })
  }, [sourceIds])

  return {
    dataMap,
    loadingMap,
    errorMap,
    updateData,
    getData,
  }
}

export function useJSONActions() {
  const [actionHandlers, setActionHandlers] = useState<Record<string, (...args: any[]) => void>>({})

  const registerAction = useCallback((id: string, handler: (...args: any[]) => void) => {
    setActionHandlers((prev) => ({ ...prev, [id]: handler }))
  }, [])

  const executeAction = useCallback((id: string, ...args: any[]) => {
    const handler = actionHandlers[id]
    if (handler) {
      handler(...args)
    } else {
      console.warn(`Action handler not found: ${id}`)
    }
  }, [actionHandlers])

  return {
    registerAction,
    executeAction,
  }
}
