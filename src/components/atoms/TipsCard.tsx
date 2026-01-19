import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warning } from '@phosphor-icons/react'

interface TipsCardProps {
  tips: Array<{ message: string; show: boolean }>
}

export function TipsCard({ tips }: TipsCardProps) {
  const visibleTips = tips.filter(tip => tip.show)

  if (visibleTips.length === 0) return null

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warning size={24} weight="duotone" className="text-yellow-500" />
          Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {visibleTips.map((tip, index) => (
          <p key={index}>• {tip.message}</p>
        ))}
      </CardContent>
    </Card>
  )
}
