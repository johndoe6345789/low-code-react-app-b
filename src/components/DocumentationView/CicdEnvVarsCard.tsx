import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import cicdData from '@/data/documentation/cicd-data.json'

export function CicdEnvVarsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>Required configuration for CI/CD platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold">Variable</th>
                  <th className="text-left py-2 pr-4 font-semibold">Description</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {cicdData.environmentVariables.map((variable) => (
                  <tr key={variable.variable} className="border-b">
                    <td className="py-2 pr-4">
                      <code className="text-accent">{variable.variable}</code>
                    </td>
                    <td className="py-2 pr-4">{variable.description}</td>
                    <td className="py-2">{variable.required}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
