import { ScrollArea } from '@/components/ui/scroll-area'
import errorPanelCopy from '@/data/error-panel.json'
import { ProjectFile } from '@/types/project'
import { ErrorPanelHeader } from '@/components/error-panel/ErrorPanelHeader'
import { ErrorPanelEmptyState } from '@/components/error-panel/ErrorPanelEmptyState'
import { ErrorPanelFileList } from '@/components/error-panel/ErrorPanelFileList'
import { useErrorPanelState } from '@/components/error-panel/useErrorPanelState'

interface ErrorPanelProps {
  files: ProjectFile[]
  onFileChange: (fileId: string, content: string) => void
  onFileSelect: (fileId: string) => void
}

export function ErrorPanel({ files, onFileChange, onFileSelect }: ErrorPanelProps) {
  const {
    errors,
    errorsByFile,
    errorCount,
    warningCount,
    isScanning,
    isRepairing,
    scanForErrors,
    repairAllErrors,
    repairFileWithContext,
    repairSingleError,
  } = useErrorPanelState({ files, onFileChange })

  return (
    <div className="h-full flex flex-col bg-background">
      <ErrorPanelHeader
        title={errorPanelCopy.header.title}
        scanLabel={errorPanelCopy.header.scan}
        scanningLabel={errorPanelCopy.header.scanning}
        repairAllLabel={errorPanelCopy.header.repairAll}
        repairingLabel={errorPanelCopy.header.repairing}
        errorCount={errorCount}
        warningCount={warningCount}
        errorLabel={errorPanelCopy.counts.errorSingular}
        errorsLabel={errorPanelCopy.counts.errorPlural}
        warningLabel={errorPanelCopy.counts.warningSingular}
        warningsLabel={errorPanelCopy.counts.warningPlural}
        isScanning={isScanning}
        isRepairing={isRepairing}
        onScan={scanForErrors}
        onRepairAll={repairAllErrors}
      />

      <ScrollArea className="flex-1">
        <div className="p-6">
          {errors.length === 0 && (
            <ErrorPanelEmptyState
              isScanning={isScanning}
              noIssuesTitle={errorPanelCopy.emptyStates.noIssuesTitle}
              noIssuesDescription={errorPanelCopy.emptyStates.noIssuesDescription}
              scanningTitle={errorPanelCopy.emptyStates.scanningTitle}
              scanningDescription={errorPanelCopy.emptyStates.scanningDescription}
            />
          )}

          {errors.length > 0 && (
            <ErrorPanelFileList
              files={files}
              errorsByFile={errorsByFile}
              issueLabel={errorPanelCopy.counts.issueSingular}
              issuesLabel={errorPanelCopy.counts.issuePlural}
              openLabel={errorPanelCopy.actions.open}
              repairLabel={errorPanelCopy.actions.repair}
              lineLabel={errorPanelCopy.labels.line}
              fixedLabel={errorPanelCopy.actions.fixed}
              showCodeLabel={errorPanelCopy.actions.showCode}
              hideCodeLabel={errorPanelCopy.actions.hideCode}
              isRepairing={isRepairing}
              onFileSelect={onFileSelect}
              onRepairFile={repairFileWithContext}
              onRepairError={repairSingleError}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
