import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

export function useDocumentationViewState() {
  const [activeTab, setActiveTab] = useState('readme')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }, [])

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    handleSearchChange
  }
}
