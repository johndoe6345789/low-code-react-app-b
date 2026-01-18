import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdDockerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Docker Configuration</CardTitle>
        <CardDescription>Containerization for production deployment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Files Included</h3>
          <div className="space-y-2 ml-4">
            {cicdData.docker.files.map((file) => (
              <div key={file.name} className="space-y-1">
                <code className="text-sm font-mono text-accent">{file.name}</code>
                <p className="text-sm text-muted-foreground">{file.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Docker Commands</h3>
          <pre className="custom-mui-code-block">{cicdData.docker.commands}</pre>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Features</h3>
          <ul className="space-y-2 text-sm">
            {cicdData.docker.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
