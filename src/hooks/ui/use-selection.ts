import { useState, useCallback } from 'react'

export function useSelection<T extends string | number>(
  initialSelection: T[] = []
) {
  const [selected, setSelected] = useState<T[]>(initialSelection)

  const select = useCallback((id: T) => {
    setSelected((prev) => [...prev, id])
  }, [])

  const deselect = useCallback((id: T) => {
    setSelected((prev) => prev.filter((item) => item !== id))
  }, [])

  const toggle = useCallback((id: T) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback((ids: T[]) => {
    setSelected(ids)
  }, [])

  const clear = useCallback(() => {
    setSelected([])
  }, [])

  const isSelected = useCallback(
    (id: T) => selected.includes(id),
    [selected]
  )

  return {
    selected,
    select,
    deselect,
    toggle,
    selectAll,
    clear,
    isSelected,
    count: selected.length,
  }
}
