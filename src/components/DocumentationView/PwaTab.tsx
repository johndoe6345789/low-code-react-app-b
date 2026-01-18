import { PwaFeaturesCard } from './PwaFeaturesCard'
import { PwaInstallationSection } from './PwaInstallationSection'
import { PwaOfflineSection } from './PwaOfflineSection'
import { PwaOverviewSection } from './PwaOverviewSection'
import { PwaProTipsCard } from './PwaProTipsCard'
import { PwaSettingsCard } from './PwaSettingsCard'

export function PwaTab() {
  return (
    <div className="space-y-6">
      <PwaOverviewSection />
      <PwaFeaturesCard />
      <PwaInstallationSection />
      <PwaSettingsCard />
      <PwaOfflineSection />
      <PwaProTipsCard />
    </div>
  )
}
