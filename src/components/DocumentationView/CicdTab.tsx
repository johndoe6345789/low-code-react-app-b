import { CicdBestPracticesCard } from './CicdBestPracticesCard'
import { CicdBranchStrategySection } from './CicdBranchStrategySection'
import { CicdDockerCard } from './CicdDockerCard'
import { CicdEnvVarsCard } from './CicdEnvVarsCard'
import { CicdOverviewSection } from './CicdOverviewSection'
import { CicdPipelineSection } from './CicdPipelineSection'
import { CicdPlatformsCard } from './CicdPlatformsCard'
import { CicdQuickStartCard } from './CicdQuickStartCard'
import { CicdResourcesCard } from './CicdResourcesCard'

export function CicdTab() {
  return (
    <div className="space-y-6">
      <CicdOverviewSection />
      <CicdPlatformsCard />
      <CicdPipelineSection />
      <CicdDockerCard />
      <CicdEnvVarsCard />
      <CicdBranchStrategySection />
      <CicdQuickStartCard />
      <CicdBestPracticesCard />
      <CicdResourcesCard />
    </div>
  )
}
