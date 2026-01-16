import { useState, useCallback, useMemo } from 'react'

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
}

export function usePagination<T>(items: T[], initialPageSize: number = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const total = items.length
  const totalPages = Math.ceil(total / pageSize)

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, page, pageSize])

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(page + 1)
  }, [page, goToPage])

  const prevPage = useCallback(() => {
    goToPage(page - 1)
  }, [page, goToPage])

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }, [])

  return {
    items: paginatedItems,
    page,
    pageSize,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
