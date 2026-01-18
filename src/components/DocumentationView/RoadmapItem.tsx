import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function RoadmapItem({ status, title, description, version }: {
  status: 'completed' | 'planned'
  title: string
  description: string
  version: string
}) {
  return (
    <Card className={status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50'}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                {version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
