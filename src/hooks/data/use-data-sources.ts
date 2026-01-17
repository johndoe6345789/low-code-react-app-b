import { useState, useCallback, useEffect } from 'react'
import { DataSource } from '@/types/json-ui'

export function useDataSources(sources: DataSource[]) {
  const [data, setData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    sources.forEach(source => {
      initial[source.id] = source.defaultValue
    })
    return initial
  })

  useEffect(() => {
    const computedData = { ...data }
    
    sources.forEach(source => {
      if (source.type === 'computed' && source.compute) {
        computedData[source.id] = source.compute(data)
      }
    })
    
    setData(computedData)
  }, [sources])

  const updateData = useCallback((sourceId: string, value: any) => {
    setData(prev => {
      const updated = { ...prev, [sourceId]: value }
      
      sources.forEach(source => {
        if (source.type === 'computed' && source.compute) {
          updated[source.id] = source.compute(updated)
        }
      })
      
      return updated
    })
  }, [sources])

  const updatePath = useCallback((sourceId: string, path: string, value: any) => {
    setData(prev => {
      const keys = path.split('.')
      const result = { ...prev }
      const current = { ...result[sourceId] }
      result[sourceId] = current
      
      let target: any = current
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        target[key] = { ...target[key] }
        target = target[key]
      }
      
      target[keys[keys.length - 1]] = value
      
      sources.forEach(source => {
        if (source.type === 'computed' && source.compute) {
          result[source.id] = source.compute(result)
        }
      })
      
      return result
    })
  }, [sources])

  return {
    data,
    updateData,
    updatePath,
  }
}
