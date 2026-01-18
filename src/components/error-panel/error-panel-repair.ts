import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { CodeError } from '@/types/errors'
import { ProjectFile } from '@/types/project'
import { ErrorRepairService } from '@/lib/error-repair-service'
import errorPanelCopy from '@/data/error-panel.json'

const formatWithCount = (template: string, count: number) =>
  template
    .replace('{count}', String(count))
    .replace('{plural}', count === 1 ? '' : 's')

const formatWithValue = (template: string, token: string, value: string) =>
  template.replace(token, value)

interface RepairHandlersParams {
  files: ProjectFile[]
  errors: CodeError[]
  onFileChange: (fileId: string, content: string) => void
  scanForErrors: () => Promise<void>
  setErrors: Dispatch<SetStateAction<CodeError[]>>
  setIsRepairing: Dispatch<SetStateAction<boolean>>
}

export function createRepairHandlers({
  files,
  errors,
  onFileChange,
  scanForErrors,
  setErrors,
  setIsRepairing,
}: RepairHandlersParams) {
  const repairSingleError = async (error: CodeError) => {
    const file = files.find((entry) => entry.id === error.fileId)
    if (!file) return

    setIsRepairing(true)
    try {
      const result = await ErrorRepairService.repairCode(file, [error])

      if (result.success && result.fixedCode) {
        onFileChange(file.id, result.fixedCode)

        setErrors((prev) =>
          prev.map((entry) =>
            entry.id === error.id
              ? { ...entry, isFixed: true, fixedCode: result.fixedCode }
              : entry
          )
        )

        toast.success(
          formatWithValue(errorPanelCopy.toast.fixedSingle, '{message}', error.message),
          {
            description: result.explanation,
          }
        )

        await scanForErrors()
      } else {
        toast.error(errorPanelCopy.toast.repairErrorFailed)
      }
    } catch (error) {
      toast.error(errorPanelCopy.toast.repairFailed)
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  const repairAllErrors = async () => {
    setIsRepairing(true)
    try {
      const results = await ErrorRepairService.repairMultipleFiles(files, errors)

      let fixedCount = 0
      results.forEach((result, fileId) => {
        if (result.success && result.fixedCode) {
          onFileChange(fileId, result.fixedCode)
          fixedCount++
        }
      })

      if (fixedCount > 0) {
        toast.success(formatWithCount(errorPanelCopy.toast.repairedFiles, fixedCount))
        await scanForErrors()
      } else {
        toast.error(errorPanelCopy.toast.noFilesRepaired)
      }
    } catch (error) {
      toast.error(errorPanelCopy.toast.batchRepairFailed)
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  const repairFileWithContext = async (fileId: string) => {
    const file = files.find((entry) => entry.id === fileId)
    if (!file) return

    const fileErrors = errors.filter((entry) => entry.fileId === fileId)
    if (fileErrors.length === 0) return

    setIsRepairing(true)
    try {
      const relatedFiles = files.filter((entry) => entry.id !== fileId).slice(0, 3)

      const result = await ErrorRepairService.repairWithContext(
        file,
        fileErrors,
        relatedFiles
      )

      if (result.success && result.fixedCode) {
        onFileChange(file.id, result.fixedCode)

        toast.success(
          formatWithValue(errorPanelCopy.toast.repairedFile, '{fileName}', file.name),
          {
            description: result.explanation,
          }
        )

        await scanForErrors()
      } else {
        toast.error(errorPanelCopy.toast.repairFileFailed)
      }
    } catch (error) {
      toast.error(errorPanelCopy.toast.contextRepairFailed)
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  return {
    repairSingleError,
    repairAllErrors,
    repairFileWithContext,
  }
}
