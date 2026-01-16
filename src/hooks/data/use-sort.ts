import { useState, useCallback } from 'react'

export type SortDirection = 'asc' | 'desc'

export function useSort<T>(items: T[], defaultKey?: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey || null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const toggleSort = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDirection('asc')
      }
    },
    [sortKey]
  )

  const sortedItems = [...items].sort((a, b) => {
    if (!sortKey) return 0

    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (aVal === bVal) return 0

    let comparison = 0
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal)
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  return {
    sortedItems,
    sortKey,
    sortDirection,
    toggleSort,
    setSortKey,
    setSortDirection,
  }
}
