import { AgentsCoreServices } from './AgentsCoreServices'
import { AgentsFutureEnhancements } from './AgentsFutureEnhancements'
import { AgentsIntegrationPoints } from './AgentsIntegrationPoints'
import { AgentsOverviewSection } from './AgentsOverviewSection'
import { AgentsPromptEngineering } from './AgentsPromptEngineering'

export function AgentsTab() {
  return (
    <div className="space-y-6">
      <AgentsOverviewSection />
      <div className="space-y-4">
        <AgentsCoreServices />
        <AgentsIntegrationPoints />
        <AgentsPromptEngineering />
        <AgentsFutureEnhancements />
      </div>
    </div>
  )
}
