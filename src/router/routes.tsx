import { lazy, Suspense } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import { LoadingFallback } from '@/components/molecules'
import { getEnabledPages, resolveProps } from '@/config/page-loader'
import { ComponentRegistry } from '@/lib/component-registry'
import { FeatureToggles } from '@/types/project'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

console.log('[ROUTES] 🛣️ Routes configuration loading')

const LazyComponent = ({ 
  componentName, 
  props 
}: { 
  componentName: string
  props: any 
}) => {
  console.log('[ROUTES] 🎨 Rendering lazy component:', componentName)
  const Component = ComponentRegistry[componentName as keyof typeof ComponentRegistry] as any
  
  if (!Component) {
    console.error('[ROUTES] ❌ Component not found:', componentName)
    return <LoadingFallback message={`Component ${componentName} not found`} />
  }
  
  return (
    <Suspense fallback={<LoadingFallback message={`Loading ${componentName.toLowerCase()}...`} />}>
      <Component {...props} />
    </Suspense>
  )
}

const ResizableLayout = ({
  leftComponent,
  rightComponent,
  leftProps,
  rightProps,
  config
}: any) => {
  console.log('[ROUTES] 🔀 Rendering resizable layout')
  const LeftComponent = ComponentRegistry[leftComponent as keyof typeof ComponentRegistry] as any
  const RightComponent = ComponentRegistry[rightComponent as keyof typeof ComponentRegistry] as any

  if (!LeftComponent || !RightComponent) {
    console.error('[ROUTES] ❌ Resizable components not found:', { leftComponent, rightComponent })
    return <LoadingFallback message="Layout components not found" />
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel 
        defaultSize={config.leftPanel.defaultSize} 
        minSize={config.leftPanel.minSize} 
        maxSize={config.leftPanel.maxSize}
      >
        <Suspense fallback={<LoadingFallback message={`Loading ${leftComponent.toLowerCase()}...`} />}>
          <LeftComponent {...leftProps} />
        </Suspense>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={config.rightPanel.defaultSize}>
        <Suspense fallback={<LoadingFallback message={`Loading ${rightComponent.toLowerCase()}...`} />}>
          <RightComponent {...rightProps} />
        </Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export function createRoutes(
  featureToggles: FeatureToggles,
  stateContext: any,
  actionContext: any
): RouteObject[] {
  console.log('[ROUTES] 🏗️ Creating routes with feature toggles')
  const enabledPages = getEnabledPages(featureToggles)
  console.log('[ROUTES] 📄 Enabled pages:', enabledPages.map(p => p.id).join(', '))

  const routes: RouteObject[] = enabledPages.map(page => {
    console.log('[ROUTES] 📝 Configuring route for page:', page.id)
    
    const props = page.props 
      ? resolveProps(page.props, stateContext, actionContext)
      : {}

    if (page.requiresResizable && page.resizableConfig) {
      console.log('[ROUTES] 🔀 Page requires resizable layout:', page.id)
      const config = page.resizableConfig
      const leftProps = resolveProps(config.leftProps, stateContext, actionContext)

      return {
        path: `/${page.id}`,
        element: (
          <ResizableLayout
            leftComponent={config.leftComponent}
            rightComponent={page.component}
            leftProps={leftProps}
            rightProps={props}
            config={config}
          />
        )
      }
    }

    return {
      path: `/${page.id}`,
      element: <LazyComponent componentName={page.component} props={props} />
    }
  })

  routes.push({
    path: '/',
    element: <Navigate to="/dashboard" replace />
  })

  routes.push({
    path: '*',
    element: <Navigate to="/dashboard" replace />
  })

  console.log('[ROUTES] ✅ Routes created:', routes.length, 'routes')
  return routes
}
