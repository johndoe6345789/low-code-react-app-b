import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FeatureToggles } from '@/types/project'
import {
  BookOpen,
  Code,
  Cube,
  Database,
  FileText,
  Flask,
  FlowArrow,
  Image,
  Lightbulb,
  PaintBrush,
  Play,
  Tree,
  Wrench,
} from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import featureToggleSettings from '@/config/feature-toggle-settings.json'
import type { ComponentType } from 'react'

interface FeatureToggleSettingsProps {
  features: FeatureToggles
  onFeaturesChange: (features: FeatureToggles) => void
}

type FeatureToggleIconKey =
  | 'BookOpen'
  | 'Code'
  | 'Cube'
  | 'Database'
  | 'FileText'
  | 'Flask'
  | 'FlowArrow'
  | 'Image'
  | 'Lightbulb'
  | 'PaintBrush'
  | 'Play'
  | 'Tree'
  | 'Wrench'

const iconMap: Record<FeatureToggleIconKey, ComponentType<{ size?: number; weight?: 'duotone' }>> = {
  BookOpen,
  Code,
  Cube,
  Database,
  FileText,
  Flask,
  FlowArrow,
  Image,
  Lightbulb,
  PaintBrush,
  Play,
  Tree,
  Wrench,
}

type FeatureToggleItem = {
  key: keyof FeatureToggles
  label: string
  description: string
  icon: FeatureToggleIconKey
}

const featuresList = featureToggleSettings as FeatureToggleItem[]

function FeatureToggleHeader({ enabledCount, totalCount }: { enabledCount: number; totalCount: number }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">Feature Toggles</h2>
      <p className="text-muted-foreground">
        Enable or disable features to customize your workspace. {enabledCount} of {totalCount} features enabled.
      </p>
    </div>
  )
}

function FeatureToggleCard({
  item,
  enabled,
  onToggle,
}: {
  item: FeatureToggleItem
  enabled: boolean
  onToggle: (value: boolean) => void
}) {
  const Icon = iconMap[item.icon]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Icon size={20} weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardDescription className="text-xs mt-1">{item.description}</CardDescription>
            </div>
          </div>
          <Switch id={item.key} checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
    </Card>
  )
}

function FeatureToggleGrid({
  items,
  features,
  onToggle,
}: {
  items: FeatureToggleItem[]
  features: FeatureToggles
  onToggle: (key: keyof FeatureToggles, value: boolean) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-4">
      {items.map((item) => (
        <FeatureToggleCard
          key={item.key}
          item={item}
          enabled={features[item.key]}
          onToggle={(checked) => onToggle(item.key, checked)}
        />
      ))}
    </div>
  )
}

export function FeatureToggleSettings({ features, onFeaturesChange }: FeatureToggleSettingsProps) {
  const handleToggle = (key: keyof FeatureToggles, value: boolean) => {
    onFeaturesChange({
      ...features,
      [key]: value,
    })
  }

  const enabledCount = Object.values(features).filter(Boolean).length
  const totalCount = Object.keys(features).length

  return (
    <div className="h-full p-6 bg-background">
      <FeatureToggleHeader enabledCount={enabledCount} totalCount={totalCount} />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <FeatureToggleGrid items={featuresList} features={features} onToggle={handleToggle} />
      </ScrollArea>
    </div>
  )
}
