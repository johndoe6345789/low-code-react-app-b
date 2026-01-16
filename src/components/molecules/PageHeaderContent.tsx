import { TabIcon } from '@/components/atoms'

interface PageHeaderContentProps {
  title: string
  icon: React.ReactNode
  description?: string
}

export function PageHeaderContent({ title, icon, description }: PageHeaderContentProps) {
  return (
    <div className="flex items-center gap-3">
      <TabIcon icon={icon} variant="gradient" />
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-bold truncate">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
