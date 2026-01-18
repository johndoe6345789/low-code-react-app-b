import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Rocket } from '@phosphor-icons/react'
import sassData from '@/data/documentation/sass-data.json'

export function SassQuickStartCard() {
  return (
    <Card className="bg-accent/5 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket size={20} weight="duotone" />
          {sassData.quickStartTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{sassData.quickStart.components.title}</h3>
          <pre className="custom-mui-code-block">{sassData.quickStart.components.code}</pre>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">{sassData.quickStart.mixins.title}</h3>
          <pre className="custom-mui-code-block">{sassData.quickStart.mixins.code}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
