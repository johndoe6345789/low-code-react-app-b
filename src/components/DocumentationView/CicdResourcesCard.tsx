import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileCode, Package } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdResourcesCard() {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package size={20} weight="duotone" />
          Additional Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {cicdData.resources.map((resource) => (
            <li key={resource.label} className="flex items-start gap-2">
              <FileCode size={16} className="text-accent mt-1 flex-shrink-0" />
              <span>
                <code className="text-accent">{resource.label}</code> - {resource.description}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
