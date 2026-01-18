import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataSource } from '@/types/json-ui'

interface UseDataSourceEditorParams {
  dataSource: DataSource | null
  allDataSources: DataSource[]
  onSave: (dataSource: DataSource) => void
  onOpenChange: (open: boolean) => void
}

export function useDataSourceEditor({
  dataSource,
  allDataSources,
  onSave,
  onOpenChange,
}: UseDataSourceEditorParams) {
  const [editingSource, setEditingSource] = useState<DataSource | null>(dataSource)

  useEffect(() => {
    setEditingSource(dataSource)
  }, [dataSource])

  const updateField = useCallback(<K extends keyof DataSource>(field: K, value: DataSource[K]) => {
    setEditingSource((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }, [])

  const addDependency = useCallback((depId: string) => {
    setEditingSource((prev) => {
      if (!prev || prev.type !== 'computed') return prev
      const deps = prev.dependencies || []
      if (deps.includes(depId)) return prev
      return { ...prev, dependencies: [...deps, depId] }
    })
  }, [])

  const removeDependency = useCallback((depId: string) => {
    setEditingSource((prev) => {
      if (!prev || prev.type !== 'computed') return prev
      const deps = prev.dependencies || []
      return { ...prev, dependencies: deps.filter((id) => id !== depId) }
    })
  }, [])

  const handleSave = useCallback(() => {
    if (!editingSource) return
    onSave(editingSource)
    onOpenChange(false)
  }, [editingSource, onOpenChange, onSave])

  const availableDeps = useMemo(() => {
    if (!editingSource) return []
    return allDataSources.filter(
      (ds) => ds.id !== editingSource.id && ds.type !== 'computed',
    )
  }, [allDataSources, editingSource])

  const selectedDeps = useMemo(() => editingSource?.dependencies || [], [editingSource])

  const unselectedDeps = useMemo(() => {
    if (!editingSource) return []
    return availableDeps.filter((ds) => !selectedDeps.includes(ds.id))
  }, [availableDeps, editingSource, selectedDeps])

  return {
    editingSource,
    updateField,
    addDependency,
    removeDependency,
    handleSave,
    availableDeps,
    selectedDeps,
    unselectedDeps,
  }
}
