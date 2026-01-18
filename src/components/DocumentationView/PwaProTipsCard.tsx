import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from '@phosphor-icons/react'
import pwaData from '@/data/documentation/pwa-data.json'

export function PwaProTipsCard() {
  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb size={20} weight="duotone" className="text-accent" />
          {pwaData.proTipsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {pwaData.proTips.map((tip) => (
            <li key={tip.title} className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>
                <strong>{tip.title}:</strong> {tip.description}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
