import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdQuickStartCard() {
  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb size={20} weight="duotone" className="text-accent" />
          Quick Start
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cicdData.quickStart.map((step) => (
            <div key={step.step} className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">
                  {step.step}
                </span>
                {step.title}
              </h3>
              <p className="text-sm text-foreground/80 ml-8">{step.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
