/**
 * Pure JSON components - no TypeScript wrappers needed
 * Interfaces are defined in src/lib/json-ui/interfaces/
 */
import { createJsonComponent } from './create-json-component'
import type { LoadingFallbackProps } from './interfaces/loading-fallback'
import type { NavigationItemProps } from './interfaces/navigation-item'
import type { PageHeaderContentProps } from './interfaces/page-header-content'

import loadingFallbackDef from './wrappers/definitions/loading-fallback.json'
import navigationItemDef from './wrappers/definitions/navigation-item.json'
import pageHeaderContentDef from './wrappers/definitions/page-header-content.json'

export const LoadingFallback = createJsonComponent<LoadingFallbackProps>(loadingFallbackDef)
export const NavigationItem = createJsonComponent<NavigationItemProps>(navigationItemDef)
export const PageHeaderContent = createJsonComponent<PageHeaderContentProps>(pageHeaderContentDef)
