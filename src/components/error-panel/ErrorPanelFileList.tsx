import { Stack } from '@/components/atoms'
import { CodeError } from '@/types/errors'
import { ProjectFile } from '@/types/project'
import { ErrorPanelFileCard } from './ErrorPanelFileCard'

interface ErrorPanelFileListProps {
  files: ProjectFile[]
  errorsByFile: Record<string, CodeError[]>
  issueLabel: string
  issuesLabel: string
  openLabel: string
  repairLabel: string
  lineLabel: string
  fixedLabel: string
  showCodeLabel: string
  hideCodeLabel: string
  isRepairing: boolean
  onFileSelect: (fileId: string) => void
  onRepairFile: (fileId: string) => void
  onRepairError: (error: CodeError) => void
}

export function ErrorPanelFileList({
  files,
  errorsByFile,
  issueLabel,
  issuesLabel,
  openLabel,
  repairLabel,
  lineLabel,
  fixedLabel,
  showCodeLabel,
  hideCodeLabel,
  isRepairing,
  onFileSelect,
  onRepairFile,
  onRepairError,
}: ErrorPanelFileListProps) {
  return (
    <Stack direction="vertical" spacing="md">
      {Object.entries(errorsByFile).map(([fileId, fileErrors]) => {
        const file = files.find((entry) => entry.id === fileId)
        if (!file) return null

        return (
          <ErrorPanelFileCard
            key={fileId}
            file={file}
            errors={fileErrors}
            issueLabel={issueLabel}
            issuesLabel={issuesLabel}
            openLabel={openLabel}
            repairLabel={repairLabel}
            lineLabel={lineLabel}
            fixedLabel={fixedLabel}
            showCodeLabel={showCodeLabel}
            hideCodeLabel={hideCodeLabel}
            isRepairing={isRepairing}
            onFileSelect={onFileSelect}
            onRepairFile={onRepairFile}
            onRepairError={onRepairError}
          />
        )
      })}
    </Stack>
  )
}
