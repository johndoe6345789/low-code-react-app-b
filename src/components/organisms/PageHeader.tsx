import { PageHeaderContent } from '@/components/molecules'
import { Stack, Container } from '@/components/atoms'
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
      <PageHeaderContent
        title={info.title}
        icon={info.icon}
        description={info.description}
      />
    </Stack>
  )
}
