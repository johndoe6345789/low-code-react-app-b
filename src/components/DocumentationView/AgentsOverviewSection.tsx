import { Separator } from '@/components/ui/separator'
import { FileCode } from '@phosphor-icons/react'
import agentsData from '@/data/documentation/agents-data.json'

export function AgentsOverviewSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        <FileCode size={36} weight="duotone" className="text-accent" />
        {agentsData.title}
      </h1>
      <p className="text-lg text-muted-foreground">{agentsData.subtitle}</p>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{agentsData.overviewTitle}</h2>
        <p className="text-foreground/90 leading-relaxed">{agentsData.overview}</p>
      </div>
    </div>
  )
}
