import { useState, useEffect } from 'react'
import { useDebounce } from './use-debounce'

export function useSearch<T>(
  items: T[],
  searchKeys: (keyof T)[],
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceMs)
  const [results, setResults] = useState<T[]>(items)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(items)
      return
    }

    const lowerQuery = debouncedQuery.toLowerCase()
    const filtered = items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery)
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery)
        }
        return false
      })
    )

    setResults(filtered)
  }, [debouncedQuery, items, searchKeys])

  return {
    query,
    setQuery,
    results,
    isSearching: query.length > 0,
  }
}
