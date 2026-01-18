import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataSource } from '@/types/json-ui'

export function useDataSourceEditor(
  dataSource: DataSource | null,
  allDataSources: DataSource[],
) {
  const [editingSource, setEditingSource] = useState<DataSource | null>(dataSource)

  useEffect(() => {
    setEditingSource(dataSource)
  }, [dataSource])

  const updateField = useCallback(<K extends keyof DataSource>(field: K, value: DataSource[K]) => {
    setEditingSource(prev => (prev ? { ...prev, [field]: value } : prev))
  }, [])

  const addDependency = useCallback((depId: string) => {
    setEditingSource(prev => {
      if (!prev || prev.type !== 'computed') return prev
      const deps = prev.dependencies || []
      if (deps.includes(depId)) return prev
      return { ...prev, dependencies: [...deps, depId] }
    })
  }, [])

  const removeDependency = useCallback((depId: string) => {
    setEditingSource(prev => {
      if (!prev || prev.type !== 'computed') return prev
      const deps = prev.dependencies || []
      return { ...prev, dependencies: deps.filter(dep => dep !== depId) }
    })
  }, [])

  const availableDeps = useMemo(() => {
    if (!editingSource) return []
    return allDataSources.filter(
      ds => ds.id !== editingSource.id && ds.type !== 'computed',
    )
  }, [allDataSources, editingSource])

  const selectedDeps = useMemo(() => editingSource?.dependencies || [], [editingSource])

  const unselectedDeps = useMemo(
    () => availableDeps.filter(ds => !selectedDeps.includes(ds.id)),
    [availableDeps, selectedDeps],
  )

  return {
    editingSource,
    updateField,
    addDependency,
    removeDependency,
    availableDeps,
    selectedDeps,
    unselectedDeps,
  }
}
