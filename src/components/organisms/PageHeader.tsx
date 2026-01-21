import { Stack, Container, TabIcon } from '@/components/atoms'
import { tabInfo } from '@/lib/navigation-config'

interface PageHeaderProps {
  activeTab: string
}

export function PageHeader({ activeTab }: PageHeaderProps) {
  const info = tabInfo[activeTab]

  if (!info) return null

  return (
    <Stack 
      direction="vertical" 
      spacing="none" 
      className="border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4"
    >
      {/* PageHeaderContent - inlined */}
      <div className="flex items-center gap-3">
        <TabIcon icon={info.icon} variant="gradient" />
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold truncate">{info.title}</h2>
          {info.description && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {info.description}
            </p>
          )}
        </div>
      </div>
    </Stack>
  )
}
