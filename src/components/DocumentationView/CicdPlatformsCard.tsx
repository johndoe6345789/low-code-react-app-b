import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import cicdData from '@/data/documentation/cicd-data.json'
import { CICDPlatformItem } from './CicdItems'

export function CicdPlatformsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cicdData.platformsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cicdData.platforms.map((platform) => (
          <CICDPlatformItem
            key={platform.name}
            featureLabel={cicdData.platformsFeaturesLabel}
            name={platform.name}
            file={platform.file}
            description={platform.description}
            features={platform.features}
          />
        ))}
      </CardContent>
    </Card>
  )
}
