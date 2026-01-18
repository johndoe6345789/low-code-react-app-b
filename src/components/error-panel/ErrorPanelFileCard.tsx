import { ArrowRight, FileCode, Wrench } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { ActionButton, Badge, Flex, Text } from '@/components/atoms'
import { CodeError } from '@/types/errors'
import { ProjectFile } from '@/types/project'
import { ErrorPanelErrorItem } from './ErrorPanelErrorItem'

interface ErrorPanelFileCardProps {
  file: ProjectFile
  errors: CodeError[]
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

export function ErrorPanelFileCard({
  file,
  errors,
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
}: ErrorPanelFileCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted px-4 py-3">
        <Flex align="center" justify="between">
          <Flex align="center" gap="sm">
            <FileCode size={18} weight="duotone" />
            <Text className="font-medium">{file.name}</Text>
            <Badge variant="outline" size="sm">
              {errors.length} {errors.length === 1 ? issueLabel : issuesLabel}
            </Badge>
          </Flex>
          <Flex gap="sm">
            <ActionButton
              icon={<ArrowRight size={14} />}
              label={openLabel}
              onClick={() => onFileSelect(file.id)}
              variant="outline"
              size="sm"
            />
            <ActionButton
              icon={<Wrench size={14} />}
              label={repairLabel}
              onClick={() => onRepairFile(file.id)}
              disabled={isRepairing}
              variant="default"
              size="sm"
            />
          </Flex>
        </Flex>
      </div>

      <div className="p-4 space-y-2">
        {errors.map((error) => (
          <ErrorPanelErrorItem
            key={error.id}
            error={error}
            isRepairing={isRepairing}
            lineLabel={lineLabel}
            fixedLabel={fixedLabel}
            showCodeLabel={showCodeLabel}
            hideCodeLabel={hideCodeLabel}
            onRepair={onRepairError}
          />
        ))}
      </div>
    </Card>
  )
}
