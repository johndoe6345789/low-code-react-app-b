import { useKV } from '@github/spark/hooks'

export type DataSourceType = 'kv' | 'static' | 'computed'

export interface DataSourceConfig<T = any> {
  type: DataSourceType
  key?: string
  defaultValue?: T
  compute?: (allData: Record<string, any>) => T
  dependencies?: string[]
}

export function useKVDataSource<T = any>(key: string, defaultValue?: T) {
  return useKV(key, defaultValue)
}

export function useStaticDataSource<T = any>(defaultValue: T) {
  return [defaultValue, () => {}, () => {}] as const
}

export function useComputedDataSource<T = any>(
  compute: (allData: Record<string, any>) => T,
  dependencies: Record<string, any>
) {
  return compute(dependencies)
}

export function useMultipleDataSources(_sources: DataSourceConfig[]) {
  return {}
}
