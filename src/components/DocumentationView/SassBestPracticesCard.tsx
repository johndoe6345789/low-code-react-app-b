import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Target } from '@phosphor-icons/react'
import sassData from '@/data/documentation/sass-data.json'

export function SassBestPracticesCard() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={20} weight="duotone" />
          Best Practices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {sassData.bestPractices.map((practice) => (
            <li key={practice} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
