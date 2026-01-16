import { PageHeaderContent } from '@/components/molecules'
import { tabInfo } from '@/lib/navigation-config'

interface PageHeaderProps {
  activeTab: string
}

export function PageHeader({ activeTab }: PageHeaderProps) {
  const info = tabInfo[activeTab]

  if (!info) return null

  return (
    <div className="border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4">
      <PageHeaderContent
        title={info.title}
        icon={info.icon}
        description={info.description}
      />
    </div>
  )
}
