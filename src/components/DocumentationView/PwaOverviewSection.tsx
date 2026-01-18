import { Separator } from '@/components/ui/separator'
import { Rocket } from '@phosphor-icons/react'
import pwaData from '@/data/documentation/pwa-data.json'

export function PwaOverviewSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Rocket size={32} weight="duotone" className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{pwaData.title}</h1>
          <p className="text-lg text-muted-foreground">{pwaData.subtitle}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{pwaData.overviewTitle}</h2>
        <p className="text-foreground/90 leading-relaxed">{pwaData.overview}</p>
      </div>
    </div>
  )
}
