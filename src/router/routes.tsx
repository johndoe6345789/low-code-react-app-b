import { lazy, Suspense } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import { JSONSchemaPageLoader } from '@/components/JSONSchemaPageLoader'
import { LoadingFallback } from '@/components/molecules'
import { JSONSchemaPageLoader } from '@/components/JSONSchemaPageLoader'
import { NotFoundPage } from '@/components/NotFoundPage'
import { getEnabledPages, resolveProps } from '@/config/page-loader'
import { ComponentRegistry } from '@/lib/component-registry'
import { PageRenderer } from '@/lib/json-ui/page-renderer'
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
  const resolveJsonBindings = (jsonProps?: { data?: string[]; functions?: string[] }) => ({
    data: resolveProps(jsonProps?.data ? { state: jsonProps.data } : undefined, stateContext, actionContext),
    functions: resolveProps(jsonProps?.functions ? { actions: jsonProps.functions } : undefined, stateContext, actionContext),
  })

  console.log('[ROUTES] 🏗️ Creating routes with feature toggles:', featureToggles)
  const enabledPages = getEnabledPages(featureToggles)
  console.log('[ROUTES] 📄 Enabled pages count:', enabledPages.length)
  console.log('[ROUTES] 📄 Enabled page IDs:', enabledPages.map(p => p.id).join(', '))
  console.log('[ROUTES] 📄 Enabled pages details:', JSON.stringify(enabledPages.map(p => ({ 
    id: p.id, 
    component: p.component, 
    isRoot: p.isRoot,
    enabled: p.enabled 
  })), null, 2))

  const rootPage = enabledPages.find(p => p.isRoot)
  console.log('[ROUTES] 🏠 Root page search result:', rootPage ? `Found: ${rootPage.id} (${rootPage.component})` : 'NOT FOUND - will redirect to /dashboard')

  const renderJsonPage = (page: typeof enabledPages[number]) => {
    if (page.schema) {
      console.log('[ROUTES] 🧾 Rendering preloaded JSON schema for page:', page.id)
      return <PageRenderer schema={page.schema} />
    }

    if (page.schemaPath) {
      console.log('[ROUTES] 🧾 Rendering JSON schema loader for page:', page.id)
      return <JSONSchemaPageLoader schemaPath={page.schemaPath} />
    }

    console.error('[ROUTES] ❌ JSON page missing schemaPath:', page.id)
    return <LoadingFallback message={`Schema path missing for JSON page: ${page.id}`} />
  }

  const routes: RouteObject[] = enabledPages
    .filter(p => !p.isRoot)
    .map(page => {
      console.log('[ROUTES] 📝 Configuring route for page:', page.id)
      
      const props = page.props 
        ? resolveProps(page.props, stateContext, actionContext)
        : {}

      if (page.type === 'json' || page.schemaPath) {
        return {
          path: `/${page.id}`,
          element: renderJsonPage(page)
        }
      }

      if (page.requiresResizable && page.resizableConfig) {
        console.log('[ROUTES] 🔀 Page requires resizable layout:', page.id)
        const config = page.resizableConfig
        const leftProps = resolveProps(config.leftProps, stateContext, actionContext)

        if (!page.component) {
          console.error('[ROUTES] ❌ Resizable page missing component:', page.id)
          return {
            path: `/${page.id}`,
            element: <LoadingFallback message={`Component missing for page: ${page.id}`} />
          }
        }

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

      if (!page.component) {
        console.error('[ROUTES] ❌ Page missing component:', page.id)
        return {
          path: `/${page.id}`,
          element: <LoadingFallback message={`Component missing for page: ${page.id}`} />
        }
      }

      return {
        path: `/${page.id}`,
        element: <LazyComponent componentName={page.component} props={props} />
      }
    })

  if (rootPage) {
    console.log('[ROUTES] ✅ Adding root route from JSON config:', rootPage.component)
    const props = rootPage.props 
      ? resolveProps(rootPage.props, stateContext, actionContext)
      : {}
    
    if (rootPage.type === 'json' || rootPage.schemaPath) {
      routes.push({
        path: '/',
        element: renderJsonPage(rootPage)
      })
    } else if (!rootPage.component) {
      console.error('[ROUTES] ❌ Root page missing component:', rootPage.id)
      routes.push({
        path: '/',
        element: <LoadingFallback message="Root page component missing" />
      })
    } else {
      routes.push({
        path: '/',
        element: <LazyComponent componentName={rootPage.component} props={props} />
      })
    }
  } else {
    console.log('[ROUTES] ⚠️ No root page in config, redirecting to /dashboard')
    routes.push({
      path: '/',
      element: <Navigate to="/dashboard" replace />
    })
  }

  routes.push({
    path: '*',
    element: <NotFoundPage />
  })

  console.log('[ROUTES] ✅ Routes created:', routes.length, 'routes')
  return routes
}
