import { useMemo, useState } from 'react'
import { navigationGroups, NavigationItemData } from '@/lib/navigation-config'
import navigationMenuCopy from '@/data/navigation-menu.json'
import { useRoutePreload } from '@/hooks/use-route-preload'
import { FeatureToggles } from '@/types/project'

interface NavigationMenuGroupItem extends NavigationItemData {
  isActive: boolean
}

interface NavigationMenuGroup {
  id: string
  label: string
  visibleCount: number
  isExpanded: boolean
  items: NavigationMenuGroupItem[]
}

export function useNavigationMenu(
  activeTab: string,
  onTabChange: (tab: string) => void,
  featureToggles: FeatureToggles,
  errorCount = 0
) {
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([
    'overview',
    'development',
    'automation',
    'design',
    'backend',
    'testing',
    'tools',
  ])

  const { preloadRoute, cancelPreload } = useRoutePreload({ delay: 100 })

  const isItemVisible = (item: NavigationItemData) => {
    if (!item.featureKey) return true
    return featureToggles[item.featureKey]
  }

  const groups = useMemo<NavigationMenuGroup[]>(() => {
    return navigationGroups
      .map((group) => {
        const items = group.items
          .filter(isItemVisible)
          .map((item) => ({
            ...item,
            badge: item.id === 'errors' ? errorCount : item.badge,
            isActive: activeTab === item.value,
          }))
        return {
          id: group.id,
          label: group.label,
          visibleCount: items.length,
          isExpanded: expandedGroupIds.includes(group.id),
          items,
        }
      })
      .filter((group) => group.visibleCount > 0)
  }, [activeTab, errorCount, expandedGroupIds, featureToggles])

  const toggleGroup = (groupId: string) => {
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const expandAll = () => {
    const allGroupIds = navigationGroups
      .filter((group) => group.items.some(isItemVisible))
      .map((group) => group.id)
    setExpandedGroupIds(allGroupIds)
  }

  const collapseAll = () => {
    setExpandedGroupIds([])
  }

  const onItemClick = (value: string) => {
    onTabChange(value)
  }

  const onItemHover = (value: string) => {
    console.log(`[NAV] 🖱️ Hover detected on: ${value}`)
    preloadRoute(value)
  }

  const onItemLeave = (value: string) => {
    console.log(`[NAV] 👋 Hover left: ${value}`)
    cancelPreload(value)
  }

  return {
    labels: navigationMenuCopy.labels,
    groups,
    toggleGroup,
    expandAll,
    collapseAll,
    onItemClick,
    onItemHover,
    onItemLeave,
  }
}
