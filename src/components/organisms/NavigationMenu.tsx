import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { List, CaretDoubleDown, CaretDoubleUp } from '@phosphor-icons/react'
import { NavigationItem, NavigationGroupHeader } from '@/components/molecules'
import { navigationGroups, NavigationItemData } from '@/lib/navigation-config'
import { FeatureToggles } from '@/types/project'
import { useRoutePreload } from '@/hooks/use-route-preload'

interface NavigationMenuProps {
  activeTab: string
  onTabChange: (tab: string) => void
  featureToggles: FeatureToggles
  errorCount?: number
}

export function NavigationMenu({
  activeTab,
  onTabChange,
  featureToggles,
  errorCount = 0,
}: NavigationMenuProps) {
  const [open, setOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['overview', 'development', 'automation', 'design', 'backend', 'testing', 'tools'])
  )
  
  const { preloadRoute, cancelPreload } = useRoutePreload({ delay: 100 })

  const handleItemClick = (value: string) => {
    onTabChange(value)
    setOpen(false)
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

  const isItemVisible = (item: NavigationItemData) => {
    if (!item.featureKey) return true
    return featureToggles[item.featureKey]
  }

  const getVisibleItemsCount = (groupId: string) => {
    const group = navigationGroups.find((g) => g.id === groupId)
    if (!group) return 0
    return group.items.filter(isItemVisible).length
  }

  const handleExpandAll = () => {
    const allGroupIds = navigationGroups
      .filter((group) => getVisibleItemsCount(group.id) > 0)
      .map((group) => group.id)
    setExpandedGroups(new Set(allGroupIds))
  }

  const handleCollapseAll = () => {
    setExpandedGroups(new Set())
  }

  const getItemBadge = (item: NavigationItemData) => {
    if (item.id === 'errors') return errorCount
    return item.badge
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <List size={20} weight="bold" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            className="flex-1"
          >
            <CaretDoubleDown size={16} className="mr-2" />
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCollapseAll}
            className="flex-1"
          >
            <CaretDoubleUp size={16} className="mr-2" />
            Collapse All
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
          <div className="space-y-2">
            {navigationGroups.map((group) => {
              const visibleItemsCount = getVisibleItemsCount(group.id)
              if (visibleItemsCount === 0) return null

              const isExpanded = expandedGroups.has(group.id)

              return (
                <Collapsible
                  key={group.id}
                  open={isExpanded}
                  onOpenChange={() => toggleGroup(group.id)}
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
                            onMouseEnter={() => handleItemHover(item.value)}
                            onMouseLeave={() => handleItemLeave(item.value)}
                          >
                            <NavigationItem
                              icon={item.icon}
                              label={item.label}
                              isActive={activeTab === item.value}
                              badge={getItemBadge(item)}
                              onClick={() => handleItemClick(item.value)}
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
