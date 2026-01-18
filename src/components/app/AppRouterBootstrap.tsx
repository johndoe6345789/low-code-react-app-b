import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppRouterLayout from '@/components/app/AppRouterLayout'
import LoadingScreen from '@/components/app/LoadingScreen'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { preloadCriticalComponents } from '@/lib/component-registry'

export default function AppRouterBootstrap() {
  const { loadSeedData } = useSeedData()
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true)
    }, 100)

    loadSeedData()
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
  }, [loadSeedData])

  if (!appReady) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <AppRouterLayout />
    </BrowserRouter>
  )
}
