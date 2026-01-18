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

interface ScanForErrorsParams {
  files: ProjectFile[]
  setErrors: Dispatch<SetStateAction<CodeError[]>>
  setIsScanning: Dispatch<SetStateAction<boolean>>
}

export function createScanForErrors({
  files,
  setErrors,
  setIsScanning,
}: ScanForErrorsParams) {
  return async () => {
    setIsScanning(true)
    try {
      const allErrors: CodeError[] = []

      for (const file of files) {
        const fileErrors = await ErrorRepairService.detectErrors(file)
        allErrors.push(...fileErrors)
      }

      setErrors(allErrors)

      if (allErrors.length === 0) {
        toast.success(errorPanelCopy.toast.noErrorsFound)
      } else {
        toast.info(formatWithCount(errorPanelCopy.toast.foundIssues, allErrors.length))
      }
    } catch (error) {
      toast.error(errorPanelCopy.toast.scanFailed)
      console.error(error)
    } finally {
      setIsScanning(false)
    }
  }
}
