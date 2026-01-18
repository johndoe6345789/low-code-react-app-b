import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import pwaData from '@/data/documentation/pwa-data.json'

function InstallationCard({ title, items }: { title: string; items: { title: string; steps: string[] }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.title}>
            <div className="font-semibold mb-1">{item.title}</div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              {item.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PwaInstallationSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{pwaData.installationTitle}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <InstallationCard title={pwaData.installationDesktopTitle} items={pwaData.installation.desktop} />
        <InstallationCard title={pwaData.installationMobileTitle} items={pwaData.installation.mobile} />
      </div>
    </div>
  )
}
