import { useState, useCallback, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { DataSource } from '@/types/json-ui'

export function useDataSources(dataSources: DataSource[]) {
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  const kvSources = dataSources.filter(ds => ds.type === 'kv')
  const kvStates = kvSources.map(ds => 
    useKV(ds.key || `ds-${ds.id}`, ds.defaultValue)
  )

  useEffect(() => {
    const initializeData = async () => {
      const newData: Record<string, any> = {}

      dataSources.forEach((source, index) => {
        if (source.type === 'kv') {
          const kvIndex = kvSources.indexOf(source)
          if (kvIndex !== -1 && kvStates[kvIndex]) {
            newData[source.id] = kvStates[kvIndex][0]
          }
        } else if (source.type === 'static') {
          newData[source.id] = source.defaultValue
        }
      })

      setData(newData)
      setLoading(false)
    }

    initializeData()
  }, [])

  useEffect(() => {
    const computedSources = dataSources.filter(ds => ds.type === 'computed')
    
    computedSources.forEach(source => {
      if (source.compute) {
        const deps = source.dependencies || []
        const hasAllDeps = deps.every(dep => dep in data)
        
        if (hasAllDeps) {
          const computedValue = source.compute(data)
          setData(prev => ({ ...prev, [source.id]: computedValue }))
        }
      }
    })
  }, [data, dataSources])

  const updateData = useCallback((sourceId: string, value: any) => {
    const source = dataSources.find(ds => ds.id === sourceId)
    
    if (!source) {
      console.warn(`Data source ${sourceId} not found`)
      return
    }

    if (source.type === 'kv') {
      const kvIndex = kvSources.indexOf(source)
      if (kvIndex !== -1 && kvStates[kvIndex]) {
        kvStates[kvIndex][1](value)
      }
    }

    setData(prev => ({ ...prev, [sourceId]: value }))
  }, [dataSources, kvSources, kvStates])

  const updatePath = useCallback((sourceId: string, path: string, value: any) => {
    const source = dataSources.find(ds => ds.id === sourceId)
    
    if (!source) {
      console.warn(`Data source ${sourceId} not found`)
      return
    }

    setData(prev => {
      const sourceData = prev[sourceId]
      if (!sourceData || typeof sourceData !== 'object') {
        return prev
      }

      const pathParts = path.split('.')
      const newData = { ...sourceData }
      let current: any = newData

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!(pathParts[i] in current)) {
          current[pathParts[i]] = {}
        }
        current = current[pathParts[i]]
      }

      current[pathParts[pathParts.length - 1]] = value

      if (source.type === 'kv') {
        const kvIndex = kvSources.indexOf(source)
        if (kvIndex !== -1 && kvStates[kvIndex]) {
          kvStates[kvIndex][1](newData)
        }
      }

      return { ...prev, [sourceId]: newData }
    })
  }, [dataSources, kvSources, kvStates])

  return {
    data,
    updateData,
    updatePath,
    loading,
  }
}
