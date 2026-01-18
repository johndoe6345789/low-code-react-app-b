import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, GitBranch } from '@phosphor-icons/react'

export function CICDPlatformItem({ name, file, description, features }: {
  name: string
  file: string
  description: string
  features: string[]
}) {
  return (
    <div className="space-y-3 border-l-2 border-accent pl-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <GitBranch size={18} className="text-accent" />
          <h3 className="text-base font-semibold">{name}</h3>
        </div>
        <code className="text-xs text-muted-foreground font-mono">{file}</code>
        <p className="text-sm text-foreground/90">{description}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features:</p>
        <ul className="space-y-1">
          {features.map((feature) => (
            <li key={feature} className="text-sm text-foreground/80 flex items-start gap-2">
              <CheckCircle size={14} weight="fill" className="text-accent mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

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
