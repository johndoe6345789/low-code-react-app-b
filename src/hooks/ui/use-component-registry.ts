import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import * as Icons from '@phosphor-icons/react'

interface ComponentRegistryOptions {
  customComponents?: Record<string, React.ComponentType<any>>
}

export function useComponentRegistry({ customComponents = {} }: ComponentRegistryOptions = {}) {
  const registry = useMemo(
    () => ({
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Button,
      Badge,
      Input,
      Label,
      Separator,
      Progress,
      ...customComponents,
    }),
    [customComponents]
  )

  const getComponent = (type: string): React.ComponentType<any> | null => {
    return registry[type as keyof typeof registry] || null
  }

  const getIcon = (iconName: string, props?: any) => {
    const IconComponent = (Icons as any)[iconName]
    if (!IconComponent) return null
    return <IconComponent size={24} weight="duotone" {...props} />
  }

  return {
    registry,
    getComponent,
    getIcon,
  }
}
