import { useState, useCallback } from 'react'

export interface Entity {
  id: string
  [key: string]: any
}

export function useCRUD<T extends Entity>(
  items: T[],
  setItems: (items: T[] | ((prev: T[]) => T[])) => void
) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const create = useCallback(
    (item: T) => {
      setItems((current) => [...(current || []), item])
      return item.id
    },
    [setItems]
  )

  const read = useCallback(
    (id: string) => {
      return items?.find((item) => item.id === id)
    },
    [items]
  )

  const update = useCallback(
    (id: string, updates: Partial<T>) => {
      setItems((current) =>
        (current || []).map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      )
    },
    [setItems]
  )

  const remove = useCallback(
    (id: string) => {
      setItems((current) => (current || []).filter((item) => item.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
      }
    },
    [setItems, selectedId]
  )

  const duplicate = useCallback(
    (id: string, newId: string) => {
      const item = read(id)
      if (!item) return null

      const duplicated = { ...item, id: newId }
      create(duplicated)
      return newId
    },
    [read, create]
  )

  const selected = selectedId ? read(selectedId) : null

  return {
    items: items || [],
    create,
    read,
    update,
    remove,
    duplicate,
    selectedId,
    setSelectedId,
    selected,
  }
}
