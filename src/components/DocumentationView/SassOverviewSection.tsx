import { Separator } from '@/components/ui/separator'
import { PaintBrush } from '@phosphor-icons/react'
import sassData from '@/data/documentation/sass-data.json'

export function SassOverviewSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <PaintBrush size={32} weight="duotone" className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{sassData.title}</h1>
          <p className="text-lg text-muted-foreground">{sassData.subtitle}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-foreground/90 leading-relaxed">{sassData.overview}</p>
      </div>
    </div>
  )
}
