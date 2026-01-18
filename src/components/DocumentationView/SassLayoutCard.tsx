import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code } from '@phosphor-icons/react'
import sassData from '@/data/documentation/sass-data.json'
import { FeatureItem } from './FeatureItems'

export function SassLayoutCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sassData.layoutTitle}</CardTitle>
        <CardDescription>{sassData.layoutDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sassData.layoutComponents.map((item) => (
          <FeatureItem
            key={item.title}
            icon={<Code size={18} />}
            title={item.title}
            description={item.description}
          />
        ))}
      </CardContent>
    </Card>
  )
}
