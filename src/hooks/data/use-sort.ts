import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface UseSortOptions<T> {
  items: T[]
  initialField?: keyof T
  initialDirection?: SortDirection
}

export function useSort<T>(options: UseSortOptions<T>) {
  const { items, initialField, initialDirection = 'asc' } = options
  const [field, setField] = useState<keyof T | null>(initialField || null)
  const [direction, setDirection] = useState<SortDirection>(initialDirection)

  const sorted = useMemo(() => {
    if (!field || !direction) return items

    return [...items].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [items, field, direction])

  const toggleSort = (newField: keyof T) => {
    if (field === newField) {
      setDirection(prev =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      )
      if (direction === 'desc') {
        setField(null)
      }
    } else {
      setField(newField)
      setDirection('asc')
    }
  }

  const reset = () => {
    setField(null)
    setDirection(null)
  }

  return {
    sorted,
    field,
    direction,
    toggleSort,
    setField,
    setDirection,
    reset,
  }
}
