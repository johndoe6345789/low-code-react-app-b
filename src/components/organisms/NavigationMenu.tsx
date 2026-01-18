import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { CaretDoubleDown, CaretDoubleUp } from '@phosphor-icons/react'
import { NavigationItem, NavigationGroupHeader } from '@/components/molecules'
import { navigationGroups, NavigationItemData } from '@/lib/navigation-config'
import { FeatureToggles } from '@/types/project'
import { useRoutePreload } from '@/hooks/use-route-preload'
import navigationMenuCopy from '@/data/navigation-menu.json'

interface NavigationMenuProps {
  activeTab: string
  onTabChange: (tab: string) => void
  featureToggles: FeatureToggles
  errorCount?: number
}

interface NavigationMenuControlsProps {
  onExpandAll: () => void
  onCollapseAll: () => void
}

interface NavigationMenuGroupListProps {
  activeTab: string
  expandedGroups: Set<string>
  featureToggles: FeatureToggles
  errorCount: number
  onToggleGroup: (groupId: string) => void
  onItemClick: (value: string) => void
  onItemHover: (value: string) => void
  onItemLeave: (value: string) => void
}

function NavigationMenuControls({
  onExpandAll,
  onCollapseAll,
}: NavigationMenuControlsProps) {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExpandAll}
        className="flex-1"
      >
        <CaretDoubleDown size={16} className="mr-2" />
        {navigationMenuCopy.labels.expandAll}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCollapseAll}
        className="flex-1"
      >
        <CaretDoubleUp size={16} className="mr-2" />
        {navigationMenuCopy.labels.collapseAll}
      </Button>
    </div>
  )
}

function NavigationMenuHeader({
  onExpandAll,
  onCollapseAll,
}: NavigationMenuControlsProps) {
  return (
    <SidebarHeader className="px-4 py-4 border-b">
      <h2 className="text-lg font-semibold">{navigationMenuCopy.labels.title}</h2>
      <NavigationMenuControls
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />
    </SidebarHeader>
  )
}

function NavigationMenuGroupList({
  activeTab,
  expandedGroups,
  featureToggles,
  errorCount,
  onToggleGroup,
  onItemClick,
  onItemHover,
  onItemLeave,
}: NavigationMenuGroupListProps) {
  const isItemVisible = (item: NavigationItemData) => {
    if (!item.featureKey) return true
    return featureToggles[item.featureKey]
  }

  const getVisibleItemsCount = (groupId: string) => {
    const group = navigationGroups.find((g) => g.id === groupId)
    if (!group) return 0
    return group.items.filter(isItemVisible).length
  }

  const getItemBadge = (item: NavigationItemData) => {
    if (item.id === 'errors') return errorCount
    return item.badge
  }

  return (
    <div className="space-y-2 py-4">
      {navigationGroups.map((group) => {
        const visibleItemsCount = getVisibleItemsCount(group.id)
        if (visibleItemsCount === 0) return null

        const isExpanded = expandedGroups.has(group.id)

        return (
          <Collapsible
            key={group.id}
            open={isExpanded}
            onOpenChange={() => onToggleGroup(group.id)}
          >
            <NavigationGroupHeader
              label={group.label}
              count={visibleItemsCount}
              isExpanded={isExpanded}
            />
            <CollapsibleContent className="mt-1">
              <div className="space-y-1 pl-2">
                {group.items.map((item) => {
                  if (!isItemVisible(item)) return null

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => onItemHover(item.value)}
                      onMouseLeave={() => onItemLeave(item.value)}
                    >
                      <NavigationItem
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.value}
                        badge={getItemBadge(item)}
                        onClick={() => onItemClick(item.value)}
                      />
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}

export function NavigationMenu({
  activeTab,
  onTabChange,
  featureToggles,
  errorCount = 0,
}: NavigationMenuProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['overview', 'development', 'automation', 'design', 'backend', 'testing', 'tools'])
  )
  
  const { preloadRoute, cancelPreload } = useRoutePreload({ delay: 100 })

  const handleItemClick = (value: string) => {
    onTabChange(value)
  }
  
  const handleItemHover = (value: string) => {
    console.log(`[NAV] 🖱️ Hover detected on: ${value}`)
    preloadRoute(value)
  }
  
  const handleItemLeave = (value: string) => {
    console.log(`[NAV] 👋 Hover left: ${value}`)
    cancelPreload(value)
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const handleExpandAll = () => {
    const allGroupIds = navigationGroups
      .filter((group) =>
        group.items.some((item) => {
          if (!item.featureKey) return true
          return featureToggles[item.featureKey]
        })
      )
      .map((group) => group.id)
    setExpandedGroups(new Set(allGroupIds))
  }

  const handleCollapseAll = () => {
    setExpandedGroups(new Set())
  }

  return (
    <Sidebar side="left" collapsible="offcanvas">
      <NavigationMenuHeader
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />
      <SidebarContent>
        <ScrollArea className="h-full px-4">
          <NavigationMenuGroupList
            activeTab={activeTab}
            expandedGroups={expandedGroups}
            featureToggles={featureToggles}
            errorCount={errorCount}
            onToggleGroup={toggleGroup}
            onItemClick={handleItemClick}
            onItemHover={handleItemHover}
            onItemLeave={handleItemLeave}
          />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
