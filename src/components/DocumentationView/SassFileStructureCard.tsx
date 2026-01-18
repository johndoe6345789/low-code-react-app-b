import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import sassData from '@/data/documentation/sass-data.json'

export function SassFileStructureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sassData.fileStructureTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sassData.fileStructure.map((item) => (
          <div key={item.file} className="space-y-2">
            <code className="text-sm font-mono text-accent">{item.file}</code>
            <p className="text-sm text-muted-foreground ml-4">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
