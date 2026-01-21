import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: number
}

export function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  )
}
