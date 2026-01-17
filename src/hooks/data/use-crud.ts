import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export interface UseCRUDOptions<T> {
  key: string
  defaultValue?: T[]
  persist?: boolean
  getId?: (item: T) => string | number
}

export function useCRUD<T>(options: UseCRUDOptions<T>) {
  const { key, defaultValue = [], persist = true, getId = (item: any) => item.id } = options

  const [persistedItems, setPersistedItems] = useKV<T[]>(key, defaultValue)
  const [localItems, setLocalItems] = useState<T[]>(defaultValue)

  const items = persist ? persistedItems : localItems
  const setItems = persist ? setPersistedItems : setLocalItems

  const create = useCallback((item: T) => {
    setItems((current: T[]) => [...current, item])
  }, [setItems])

  const read = useCallback((id: string | number): T | undefined => {
    return items.find(item => getId(item) === id)
  }, [items, getId])

  const update = useCallback((id: string | number, updates: Partial<T>) => {
    setItems((current: T[]) =>
      current.map(item =>
        getId(item) === id ? { ...item, ...updates } : item
      )
    )
  }, [setItems, getId])

  const remove = useCallback((id: string | number) => {
    setItems((current: T[]) =>
      current.filter(item => getId(item) !== id)
    )
  }, [setItems, getId])

  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  return {
    items,
    create,
    read,
    update,
    remove,
    clear,
    setItems,
  }
}
