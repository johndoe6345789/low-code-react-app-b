import { CheckCircle, Lightning } from '@phosphor-icons/react'
import { EmptyState } from '@/components/atoms'

interface ErrorPanelEmptyStateProps {
  isScanning: boolean
  noIssuesTitle: string
  noIssuesDescription: string
  scanningTitle: string
  scanningDescription: string
}

export function ErrorPanelEmptyState({
  isScanning,
  noIssuesTitle,
  noIssuesDescription,
  scanningTitle,
  scanningDescription,
}: ErrorPanelEmptyStateProps) {
  if (isScanning) {
    return (
      <EmptyState
        icon={<Lightning size={48} weight="duotone" className="text-accent animate-pulse" />}
        title={scanningTitle}
        description={scanningDescription}
      />
    )
  }

  return (
    <EmptyState
      icon={<CheckCircle size={48} weight="duotone" className="text-green-500" />}
      title={noIssuesTitle}
      description={noIssuesDescription}
    />
  )
}
