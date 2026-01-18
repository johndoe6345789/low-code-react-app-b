import { JSONUIRenderer } from '@/lib/json-ui'
import type { UIComponent } from '@/lib/json-ui/types'
import breadcrumbDefinition from './definitions/breadcrumb.json'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const breadcrumbComponent = breadcrumbDefinition as UIComponent

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items?.length) {
    return null
  }

  return (
    <JSONUIRenderer
      component={breadcrumbComponent}
      dataMap={{ items, className }}
    />
  )
}
