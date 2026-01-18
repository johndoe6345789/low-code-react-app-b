import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import agentsData from '@/data/documentation/agents-data.json'
import { AgentFileItem } from './AgentItems'

export function AgentsCoreServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core AI Services</CardTitle>
        <CardDescription>Primary modules handling AI operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agentsData.coreServices.map((service) => (
          <AgentFileItem
            key={service.filename}
            filename={service.filename}
            path={service.path}
            description={service.description}
            features={service.features}
          />
        ))}
      </CardContent>
    </Card>
  )
}
