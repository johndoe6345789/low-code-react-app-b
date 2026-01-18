import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import agentsData from '@/data/documentation/agents-data.json'
import { IntegrationPoint } from './AgentItems'

export function AgentsIntegrationPoints() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agentsData.integrationPointsTitle}</CardTitle>
        <CardDescription>{agentsData.integrationPointsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {agentsData.integrationPoints.map((point) => (
            <IntegrationPoint key={point.component} component={point.component} capabilities={point.capabilities} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
