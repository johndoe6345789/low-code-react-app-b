import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'
import pwaData from '@/data/documentation/pwa-data.json'

export function PwaFeaturesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PWA Features</CardTitle>
        <CardDescription>Native app capabilities in your browser</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {pwaData.features.map((feature) => (
          <div key={feature.title} className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-accent" />
              <span className="font-semibold text-sm">{feature.title}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">{feature.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
