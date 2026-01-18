import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import sassData from '@/data/documentation/sass-data.json'
import { AnimationItem } from './SassItems'

export function SassAnimationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Classes</CardTitle>
        <CardDescription>Pre-built animation utilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sassData.animations.map((animation) => (
            <AnimationItem key={animation.name} name={animation.name} description={animation.description} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
