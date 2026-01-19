import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle } from '@phosphor-icons/react'

interface CompletionCardProps {
  completionScore: number
  completionMessage: string
  isReadyToExport: boolean
}

export function CompletionCard({ 
  completionScore, 
  completionMessage, 
  isReadyToExport 
}: CompletionCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle size={24} weight="duotone" className="text-primary" />
          Project Completeness
        </CardTitle>
        <CardDescription>Overall progress of your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{completionScore}%</span>
          <Badge variant={isReadyToExport ? 'default' : 'secondary'} className="text-sm">
            {isReadyToExport ? 'Ready to Export' : 'In Progress'}
          </Badge>
        </div>
        <Progress value={completionScore} className="h-3" />
        <p className="text-sm text-muted-foreground">{completionMessage}</p>
      </CardContent>
    </Card>
  )
}
