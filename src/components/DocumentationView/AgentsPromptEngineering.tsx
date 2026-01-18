import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import agentsData from '@/data/documentation/agents-data.json'

export function AgentsPromptEngineering() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agentsData.promptEngineeringTitle}</CardTitle>
        <CardDescription>{agentsData.promptEngineeringDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agentsData.promptEngineering.map((item) => (
          <div key={item.title} className="space-y-2">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
