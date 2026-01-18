import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Wrench } from '@phosphor-icons/react'
import pwaData from '@/data/documentation/pwa-data.json'

function OfflineList({ items, accent }: { items: string[]; accent: boolean }) {
  return (
    <ul className={`space-y-2 text-sm ${accent ? 'text-foreground/80' : 'text-muted-foreground'}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={accent ? 'text-accent mt-0.5' : 'mt-0.5'}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PwaOfflineSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Offline Capabilities</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-accent" />
              Works Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OfflineList items={pwaData.offline.worksOffline} accent />
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench size={20} weight="duotone" className="text-muted-foreground" />
              Requires Internet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OfflineList items={pwaData.offline.requiresInternet} accent={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
