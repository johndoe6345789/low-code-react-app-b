import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import cicdData from '@/data/documentation/cicd-data.json'
import { CICDPlatformItem } from './CicdItems'

export function CicdPlatformsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cicdData.platforms.map((platform) => (
          <CICDPlatformItem
            key={platform.name}
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
