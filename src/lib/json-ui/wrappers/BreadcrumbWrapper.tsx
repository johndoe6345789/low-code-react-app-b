import { BreadcrumbNav } from '@/components/atoms'
import { cn } from '@/lib/utils'
import type { BreadcrumbWrapperProps } from './interfaces'

export function BreadcrumbWrapper({ items = [], className }: BreadcrumbWrapperProps) {
  if (items.length === 0) {
    return null
  }

  return <BreadcrumbNav items={items} className={cn('flex items-center', className)} />
}
