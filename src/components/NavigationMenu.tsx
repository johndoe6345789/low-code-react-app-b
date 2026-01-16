import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  List,
  ChartBar,
  Code,
  Database,
  Tree,
  FlowArrow,
  PaintBrush,
  Flask,
  Play,
  BookOpen,
  Cube,
  Wrench,
  FileText,
  Gear,
  DeviceMobile,
  Image,
  Faders,
  CaretDown,
  CaretDoubleDown,
  CaretDoubleUp,
  Cloud,
  Lightbulb,
} from '@phosphor-icons/react'
import { FeatureToggles } from '@/types/project'

interface NavigationGroup {
  id: string
  label: string
  items: NavigationItem[]
}

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  value: string
  badge?: number
  featureKey?: keyof FeatureToggles
}

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

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <ChartBar size={18} />,
          value: 'dashboard',
        },
      ],
    },
    {
      id: 'development',
      label: 'Development',
      items: [
        {
          id: 'code',
          label: 'Code Editor',
          icon: <Code size={18} />,
          value: 'code',
          featureKey: 'codeEditor',
        },
        {
          id: 'models',
          label: 'Models',
          icon: <Database size={18} />,
          value: 'models',
          featureKey: 'models',
        },
        {
          id: 'components',
          label: 'Components',
          icon: <Tree size={18} />,
          value: 'components',
          featureKey: 'components',
        },
        {
          id: 'component-trees',
          label: 'Component Trees',
          icon: <Tree size={18} />,
          value: 'component-trees',
          featureKey: 'componentTrees',
        },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      items: [
        {
          id: 'workflows',
          label: 'Workflows',
          icon: <FlowArrow size={18} />,
          value: 'workflows',
          featureKey: 'workflows',
        },
        {
          id: 'lambdas',
          label: 'Lambdas',
          icon: <Code size={18} />,
          value: 'lambdas',
          featureKey: 'lambdas',
        },
      ],
    },
    {
      id: 'design',
      label: 'Design & Styling',
      items: [
        {
          id: 'styling',
          label: 'Styling',
          icon: <PaintBrush size={18} />,
          value: 'styling',
          featureKey: 'styling',
        },
        {
          id: 'sass',
          label: 'Sass Styles',
          icon: <PaintBrush size={18} />,
          value: 'sass',
          featureKey: 'sassStyles',
        },
        {
          id: 'favicon',
          label: 'Favicon Designer',
          icon: <Image size={18} />,
          value: 'favicon',
          featureKey: 'faviconDesigner',
        },
        {
          id: 'ideas',
          label: 'Feature Ideas',
          icon: <Lightbulb size={18} />,
          value: 'ideas',
          featureKey: 'ideaCloud',
        },
      ],
    },
    {
      id: 'backend',
      label: 'Backend',
      items: [
        {
          id: 'flask',
          label: 'Flask API',
          icon: <Flask size={18} />,
          value: 'flask',
          featureKey: 'flaskApi',
        },
      ],
    },
    {
      id: 'testing',
      label: 'Testing',
      items: [
        {
          id: 'playwright',
          label: 'Playwright',
          icon: <Play size={18} />,
          value: 'playwright',
          featureKey: 'playwright',
        },
        {
          id: 'storybook',
          label: 'Storybook',
          icon: <BookOpen size={18} />,
          value: 'storybook',
          featureKey: 'storybook',
        },
        {
          id: 'unit-tests',
          label: 'Unit Tests',
          icon: <Cube size={18} />,
          value: 'unit-tests',
          featureKey: 'unitTests',
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools & Configuration',
      items: [
        {
          id: 'errors',
          label: 'Error Repair',
          icon: <Wrench size={18} />,
          value: 'errors',
          badge: errorCount,
          featureKey: 'errorRepair',
        },
        {
          id: 'docs',
          label: 'Documentation',
          icon: <FileText size={18} />,
          value: 'docs',
          featureKey: 'documentation',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Gear size={18} />,
          value: 'settings',
        },
        {
          id: 'pwa',
          label: 'PWA',
          icon: <DeviceMobile size={18} />,
          value: 'pwa',
        },
        {
          id: 'features',
          label: 'Features',
          icon: <Faders size={18} />,
          value: 'features',
        },
      ],
    },
  ]

  const handleItemClick = (value: string) => {
    onTabChange(value)
    setOpen(false)
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

  const isItemVisible = (item: NavigationItem) => {
    if (!item.featureKey) return true
    return featureToggles[item.featureKey]
  }

  const getVisibleItemsCount = (group: NavigationGroup) => {
    return group.items.filter(isItemVisible).length
  }

  const handleExpandAll = () => {
    const allGroupIds = navigationGroups
      .filter((group) => getVisibleItemsCount(group) > 0)
      .map((group) => group.id)
    setExpandedGroups(new Set(allGroupIds))
  }

  const handleCollapseAll = () => {
    setExpandedGroups(new Set())
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
              const visibleItemsCount = getVisibleItemsCount(group)
              if (visibleItemsCount === 0) return null

              const isExpanded = expandedGroups.has(group.id)

              return (
                <Collapsible
                  key={group.id}
                  open={isExpanded}
                  onOpenChange={() => toggleGroup(group.id)}
                >
                  <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors group">
                    <CaretDown
                      size={16}
                      weight="bold"
                      className={`text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                    <h3 className="flex-1 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {visibleItemsCount}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="space-y-1 pl-2">
                      {group.items.map((item) => {
                        if (!isItemVisible(item)) return null

                        const isActive = activeTab === item.value

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-foreground'
                            }`}
                          >
                            <span className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}>
                              {item.icon}
                            </span>
                            <span className="flex-1 text-left text-sm font-medium">
                              {item.label}
                            </span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <Badge
                                variant={isActive ? 'secondary' : 'destructive'}
                                className="ml-auto"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </button>
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
