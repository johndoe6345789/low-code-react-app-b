import { useState, useEffect, useCallback } from 'react'


export type DataSourceType = 'kv' | 'static' | 'computed'

export interface DataSourceConfig<T = any> {
  defaultVal
  dependencies?: strin

  const [value, se
  return {
    setData: setValue,
 


  compute: (allData: Record<st
  dependencies: string[],
) {

    try {
    
      consol
  }, dependencies.
  return {
      deleteData: deleteValue,
      isLoading: false,
      error: null,
    }
  }

  if (config.type === 'computed' && config.compute) {
    const [computed, setComputed] = useState<T>(() => config.compute(allData))

    useEffect(() => {
      const newValue = config.compute!(allData)
      setComputed(newValue)
    }, config.dependencies?.map(dep => allData[dep]) || [allData])

    return {
      data: computed,
      setData: () => {},
      deleteData: () => {},
      isLoading: false,
      error: null,
    }
  }

  const [staticData] = useState<T>(config.defaultValue as T)

      onUp
    })

    allData,
  }























