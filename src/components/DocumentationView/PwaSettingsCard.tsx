import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import pwaData from '@/data/documentation/pwa-data.json'

export function PwaSettingsCard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{pwaData.settingsTitle}</h2>
      <p className="text-foreground/90 leading-relaxed">{pwaData.settingsDescription}</p>

      <Card>
        <CardHeader>
          <CardTitle>{pwaData.settingsCardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pwaData.settings.map((setting, index) => (
            <div key={setting.title} className="space-y-2">
              <div className="font-semibold">{setting.title}</div>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
              {index < pwaData.settings.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
