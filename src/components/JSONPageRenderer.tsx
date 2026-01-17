import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/atoms'
import * as Icons from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface PageComponentConfig {
  id: string
  type: string
  [key: string]: any
}

export interface PageLayoutConfig {
  type: string
  spacing?: string
  sections?: PageSectionConfig[]
  [key: string]: any
}

export interface PageSectionConfig {
  type: string
  [key: string]: any
}

export interface PageSchema {
  id: string
  layout: PageLayoutConfig
  dashboardCards?: any[]
  statCards?: any[]
  [key: string]: any
}

interface ComponentRendererProps {
  schema: PageSchema
  data: Record<string, any>
  functions?: Record<string, (...args: any[]) => any>
}

function resolveBinding(binding: string, data: Record<string, any>): any {
  try {
    const func = new Function(...Object.keys(data), `return ${binding}`)
    return func(...Object.values(data))
  } catch {
    return binding
  }
}

function getIcon(iconName: string, props?: any) {
  const IconComponent = (Icons as any)[iconName]
  if (!IconComponent) return null
  return <IconComponent size={24} weight="duotone" {...props} />
}

export function JSONPageRenderer({ schema, data, functions = {} }: ComponentRendererProps) {
  const renderSection = (section: PageSectionConfig, index: number): ReactNode => {
    switch (section.type) {
      case 'header':
        return (
          <div key={index}>
            <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
            {section.description && (
              <p className="text-muted-foreground">{section.description}</p>
            )}
          </div>
        )

      case 'cards':
        const cards = schema[section.items as string] || []
        return (
          <div key={index} className={cn('space-y-' + (section.spacing || '4'))}>
            {cards.map((card: any) => renderCard(card))}
          </div>
        )

      case 'grid':
        const gridItems = schema[section.items as string] || []
        const { sm = 1, md = 2, lg = 3 } = section.columns || {}
        return (
          <div
            key={index}
            className={cn(
              'grid gap-' + (section.gap || '4'),
              `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`
            )}
          >
            {gridItems.map((item: any) => renderStatCard(item))}
          </div>
        )

      default:
        return null
    }
  }

  const renderCard = (card: any): ReactNode => {
    const icon = card.icon ? getIcon(card.icon) : null

    if (card.type === 'gradient-card') {
      const computeFn = functions[card.dataSource?.compute]
      const computedData = computeFn ? computeFn(data) : {}

      return (
        <Card
          key={card.id}
          className={cn(
            'bg-gradient-to-br border-primary/20',
            card.gradient
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {card.title}
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {card.components?.map((comp: any, idx: number) => 
              renderSubComponent(comp, computedData, idx)
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <Card key={card.id}>
        <CardHeader>
          <CardTitle>{card.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {card.component && renderCustomComponent(card.component, card.props || {})}
        </CardContent>
      </Card>
    )
  }

  const renderSubComponent = (comp: any, dataContext: any, key: number): ReactNode => {
    const value = dataContext[comp.binding]

    switch (comp.type) {
      case 'metric':
        return (
          <div key={key} className="flex items-center justify-between">
            <span className={cn(
              'font-bold',
              comp.size === 'large' ? 'text-4xl' : 'text-2xl'
            )}>
              {comp.format === 'percentage' ? `${value}%` : value}
            </span>
          </div>
        )

      case 'badge':
        const variant = value === 'ready' ? comp.variants?.ready : comp.variants?.inProgress
        return (
          <Badge key={key} variant={variant?.variant as any}>
            {variant?.label}
          </Badge>
        )

      case 'progress':
        return <Progress key={key} value={value} className="h-3" />

      case 'text':
        return (
          <p key={key} className={comp.className}>
            {value}
          </p>
        )

      default:
        return null
    }
  }

  const renderStatCard = (stat: any): ReactNode => {
    const icon = stat.icon ? getIcon(stat.icon) : undefined
    const value = resolveBinding(stat.dataBinding, data)
    const description = `${value} ${stat.description}`

    return (
      <StatCard
        key={stat.id}
        icon={icon}
        title={stat.title}
        value={value}
        description={description}
        color={stat.color}
      />
    )
  }

  const renderCustomComponent = (componentName: string, props: any): ReactNode => {
    return <div>Custom component: {componentName}</div>
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {schema.layout.sections?.map((section, index) => renderSection(section, index))}
    </div>
  )
}
