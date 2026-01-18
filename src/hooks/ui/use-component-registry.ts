import { useMemo } from 'react'
import { uiComponentRegistry, iconComponents } from '@/lib/json-ui/component-registry'
import * as Icons from '@phosphor-icons/react'

interface ComponentRegistryOptions {
  customComponents?: Record<string, React.ComponentType<any>>
}

export function useComponentRegistry({ customComponents = {} }: ComponentRegistryOptions = {}) {
  const registry = useMemo(
    () => ({
      ...uiComponentRegistry,
      ...customComponents,
    }),
    [customComponents]
  )

  const getComponent = (type: string): React.ComponentType<any> | null => {
    return registry[type as keyof typeof registry] || null
  }

  const getIcon = (iconName: string, props?: any): React.ReactElement | null => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || (Icons as any)[iconName]
    if (!IconComponent) return null
    return IconComponent({ size: 24, weight: "duotone", ...props })
  }

  return {
    registry,
    getComponent,
    getIcon,
  }
}
