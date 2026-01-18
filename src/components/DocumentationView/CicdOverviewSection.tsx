import { Separator } from '@/components/ui/separator'
import { GitBranch } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdOverviewSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <GitBranch size={32} weight="duotone" className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{cicdData.title}</h1>
          <p className="text-lg text-muted-foreground">{cicdData.subtitle}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-foreground/90 leading-relaxed">{cicdData.overview}</p>
      </div>
    </div>
  )
}
