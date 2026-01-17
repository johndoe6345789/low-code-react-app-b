import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCode, CheckCircle, Sparkle, GitBranch } from '@phosphor-icons/react'

export function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-accent mt-0.5">{icon}</div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function AIFeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-4 pb-4">
        <div className="flex gap-3">
          <Sparkle size={20} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

export function AgentFileItem({ filename, path, description, features }: {
  filename: string
  path: string
  description: string
  features: string[]
}) {
  return (
    <div className="space-y-3 border-l-2 border-accent pl-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-accent" />
          <code className="text-sm font-semibold text-accent">{filename}</code>
        </div>
        <p className="text-xs text-muted-foreground font-mono">{path}</p>
        <p className="text-sm text-foreground/90">{description}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features:</p>
        <ul className="space-y-1">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
              <CheckCircle size={14} weight="fill" className="text-accent mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function IntegrationPoint({ component, capabilities }: { component: string; capabilities: string[] }) {
  return (
    <div className="space-y-2 border rounded-lg p-4 bg-card">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Sparkle size={16} weight="duotone" className="text-accent" />
        {component}
      </h4>
      <ul className="space-y-1">
        {capabilities.map((capability, idx) => (
          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>{capability}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
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

export function SassComponentItem({ name, classes, description }: { name: string; classes: string[]; description: string }) {
  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="space-y-1">
        {classes.map((cls, idx) => (
          <code key={idx} className="text-xs font-mono text-accent block">{cls}</code>
        ))}
      </div>
    </div>
  )
}

export function AnimationItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="space-y-1 p-3 border rounded-lg bg-card">
      <code className="text-xs font-mono text-accent">{name}</code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
