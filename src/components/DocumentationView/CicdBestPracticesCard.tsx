import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Rocket } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdBestPracticesCard() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket size={20} weight="duotone" />
          {cicdData.bestPracticesTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {cicdData.bestPractices.map((practice) => (
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
