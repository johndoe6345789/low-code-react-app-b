import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PipelineStageCard({ stage, description, duration }: {
  stage: string
  description: string
  duration: string
}) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h4 className="font-semibold text-sm">{stage}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {duration}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
