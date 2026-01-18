import { Card, CardContent } from '@/components/ui/card'
import { GitBranch } from '@phosphor-icons/react'
import cicdData from '@/data/documentation/cicd-data.json'

const toneStyles = {
  green: {
    card: 'bg-green-500/5 border-green-500/20',
    icon: 'text-green-500'
  },
  blue: {
    card: 'bg-blue-500/5 border-blue-500/20',
    icon: 'text-blue-500'
  },
  purple: {
    card: 'bg-purple-500/5 border-purple-500/20',
    icon: 'text-purple-500'
  },
  orange: {
    card: 'bg-orange-500/5 border-orange-500/20',
    icon: 'text-orange-500'
  }
} as const

export function CicdBranchStrategySection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Branch Strategy</h2>
      <div className="grid gap-4">
        {cicdData.branches.map((branch) => {
          const styles = toneStyles[branch.tone]
          return (
            <Card key={branch.name} className={styles.card}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <GitBranch size={20} weight="duotone" className={`${styles.icon} mt-0.5`} />
                  <div className="space-y-1">
                    <h4 className="font-semibold">{branch.name}</h4>
                    <p className="text-sm text-muted-foreground">{branch.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
