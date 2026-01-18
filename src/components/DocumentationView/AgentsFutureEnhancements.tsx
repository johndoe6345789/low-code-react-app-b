import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Package } from '@phosphor-icons/react'
import agentsData from '@/data/documentation/agents-data.json'

export function AgentsFutureEnhancements() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package size={20} weight="duotone" />
          {agentsData.futureEnhancementsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {agentsData.futureEnhancements.map((item) => (
            <li key={item.title} className="flex items-start gap-2">
              <Target size={16} className="text-accent mt-1 flex-shrink-0" />
              <span>
                <strong>{item.title}:</strong> {item.description}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
