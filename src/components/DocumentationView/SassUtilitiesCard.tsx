import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Lightbulb } from '@phosphor-icons/react'
import sassData from '@/data/documentation/sass-data.json'

export function SassUtilitiesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sassData.utilitiesTitle}</CardTitle>
        <CardDescription>{sassData.utilitiesDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sassData.utilities.map((utility, index) => (
            <div key={utility.title} className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb size={18} weight="duotone" className="text-accent" />
                {utility.title}
              </h3>
              <div className="ml-6 space-y-2 text-sm">
                <p className="font-mono text-accent">{utility.mixin}</p>
                <p className="text-muted-foreground">{utility.description}</p>
                <pre className="custom-mui-code-block text-xs mt-2">{utility.snippet}</pre>
              </div>
              {index < sassData.utilities.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
