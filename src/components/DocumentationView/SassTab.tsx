import { SassAnimationsCard } from './SassAnimationsCard'
import { SassBestPracticesCard } from './SassBestPracticesCard'
import { SassComponentsCard } from './SassComponentsCard'
import { SassFileStructureCard } from './SassFileStructureCard'
import { SassLayoutCard } from './SassLayoutCard'
import { SassOverviewSection } from './SassOverviewSection'
import { SassQuickStartCard } from './SassQuickStartCard'
import { SassUtilitiesCard } from './SassUtilitiesCard'

export function SassTab() {
  return (
    <div className="space-y-6">
      <SassOverviewSection />
      <SassFileStructureCard />
      <SassComponentsCard />
      <SassLayoutCard />
      <SassUtilitiesCard />
      <SassAnimationsCard />
      <SassQuickStartCard />
      <SassBestPracticesCard />
    </div>
  )
}
