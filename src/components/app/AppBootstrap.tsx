import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppLayout from '@/components/app/AppLayout'
import LoadingScreen from '@/components/app/LoadingScreen'
import { useComponentTreeLoader } from '@/hooks/use-component-tree-loader'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { preloadCriticalComponents } from '@/lib/component-registry'

export default function AppBootstrap() {
  const { loadSeedData } = useSeedData()
  const { loadComponentTrees } = useComponentTreeLoader()
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true)
    }, 100)

    loadSeedData()
      .then(() => loadComponentTrees())
      .catch(err => {
        console.error('[APP_ROUTER] ❌ Seed data loading failed:', err)
      })
      .finally(() => {
        clearTimeout(timer)
        setAppReady(true)
        preloadCriticalComponents()
      })

    return () => {
      clearTimeout(timer)
    }
  }, [loadSeedData, loadComponentTrees])

  if (!appReady) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
