import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import sassData from '@/data/documentation/sass-data.json'
import { SassComponentItem } from './SassItems'

export function SassComponentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sassData.componentsTitle}</CardTitle>
        <CardDescription>{sassData.componentsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {sassData.components.map((component) => (
            <SassComponentItem
              key={component.name}
              name={component.name}
              classes={component.classes}
              description={component.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
