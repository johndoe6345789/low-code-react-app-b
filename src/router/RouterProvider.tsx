import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createRoutes } from './routes'
import { FeatureToggles } from '@/types/project'

console.log('[ROUTER_PROVIDER] 🚀 RouterProvider module loading')

interface RouterProviderProps {
  featureToggles: FeatureToggles
  stateContext: any
  actionContext: any
  children?: React.ReactNode
}

export function RouterProvider({ 
  featureToggles, 
  stateContext, 
  actionContext 
}: RouterProviderProps) {
  console.log('[ROUTER_PROVIDER] 🏗️ Creating routes')
  
  const routes = useMemo(() => {
    console.log('[ROUTER_PROVIDER] 🔄 Routes memo updating')
    const routeConfigs = createRoutes(featureToggles, stateContext, actionContext)
    console.log('[ROUTER_PROVIDER] ✅ Routes created:', routeConfigs.length, 'routes')
    return routeConfigs
  }, [featureToggles, stateContext, actionContext])

  console.log('[ROUTER_PROVIDER] 🎨 Rendering routes')
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={route.path || index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
