import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import loadingFallbackDef from './definitions/loading-fallback.json'

interface LoadingFallbackWrapperProps {
  message?: string
}

export function LoadingFallbackWrapper({ message = 'Loading...' }: LoadingFallbackWrapperProps) {
  return (
    <ComponentRenderer
      component={loadingFallbackDef}
      data={{ message }}
      context={{}}
    />
  )
}
