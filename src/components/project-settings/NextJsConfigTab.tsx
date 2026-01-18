import { NextJsConfig } from '@/types/project'
import { NextJsApplicationCard } from '@/components/project-settings/NextJsApplicationCard'
import { NextJsFeaturesCard } from '@/components/project-settings/NextJsFeaturesCard'

interface NextJsConfigTabProps {
  nextjsConfig: NextJsConfig
  onNextjsConfigChange: (config: NextJsConfig | ((current: NextJsConfig) => NextJsConfig)) => void
}

export function NextJsConfigTab({
  nextjsConfig,
  onNextjsConfigChange,
}: NextJsConfigTabProps) {
  return (
    <div className="max-w-2xl space-y-6">
      <NextJsApplicationCard
        nextjsConfig={nextjsConfig}
        onNextjsConfigChange={onNextjsConfigChange}
      />
      <NextJsFeaturesCard
        nextjsConfig={nextjsConfig}
        onNextjsConfigChange={onNextjsConfigChange}
      />
    </div>
  )
}
