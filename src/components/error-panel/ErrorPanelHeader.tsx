import { Lightning, Wrench } from '@phosphor-icons/react'
import { Badge, ActionButton, Flex, Heading, IconText } from '@/components/atoms'

interface ErrorPanelHeaderProps {
  title: string
  scanLabel: string
  scanningLabel: string
  repairAllLabel: string
  repairingLabel: string
  errorCount: number
  warningCount: number
  errorLabel: string
  errorsLabel: string
  warningLabel: string
  warningsLabel: string
  isScanning: boolean
  isRepairing: boolean
  onScan: () => void
  onRepairAll: () => void
}

export function ErrorPanelHeader({
  title,
  scanLabel,
  scanningLabel,
  repairAllLabel,
  repairingLabel,
  errorCount,
  warningCount,
  errorLabel,
  errorsLabel,
  warningLabel,
  warningsLabel,
  isScanning,
  isRepairing,
  onScan,
  onRepairAll,
}: ErrorPanelHeaderProps) {
  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <Flex align="center" justify="between">
        <Flex align="center" gap="md">
          <IconText icon={<Wrench size={20} weight="duotone" className="text-accent" />}>
            <Heading level={3}>{title}</Heading>
          </IconText>
          {(errorCount > 0 || warningCount > 0) && (
            <Flex gap="sm">
              {errorCount > 0 && (
                <Badge variant="destructive">
                  {errorCount} {errorCount === 1 ? errorLabel : errorsLabel}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="secondary">
                  {warningCount} {warningCount === 1 ? warningLabel : warningsLabel}
                </Badge>
              )}
            </Flex>
          )}
        </Flex>
        <Flex gap="sm">
          <ActionButton
            icon={<Lightning size={16} />}
            label={isScanning ? scanningLabel : scanLabel}
            onClick={onScan}
            disabled={isScanning || isRepairing}
            variant="outline"
          />
          <ActionButton
            icon={<Wrench size={16} />}
            label={isRepairing ? repairingLabel : repairAllLabel}
            onClick={onRepairAll}
            disabled={errorCount + warningCount === 0 || isRepairing || isScanning}
            variant="default"
          />
        </Flex>
      </Flex>
    </div>
  )
}
