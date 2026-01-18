import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, CircleNotch, Database, Trash, ArrowClockwise } from '@phosphor-icons/react'
import type { SeedDataManagerWrapperProps } from './interfaces'

export function SeedDataManagerWrapper({
  isLoaded = false,
  isLoading = false,
  title = 'Seed Data Management',
  description = 'Load, reset, or clear application seed data from the database',
  loadLabel = 'Load Seed Data',
  loadingLabel = 'Loading...',
  resetLabel = 'Reset to Defaults',
  resettingLabel = 'Resetting...',
  clearLabel = 'Clear All Data',
  clearingLabel = 'Clearing...',
  onLoadSeedData,
  onResetSeedData,
  onClearAllData,
  helperText = {
    load: 'Populates database with initial data if not already loaded',
    reset: 'Overwrites all data with fresh seed data',
    clear: 'Removes all data from the database (destructive action)',
  },
}: SeedDataManagerWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={24} weight="duotone" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoaded && (
          <Alert>
            <CheckCircle className="h-4 w-4" weight="fill" />
            <AlertDescription>Seed data is loaded and available</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={onLoadSeedData}
              disabled={isLoading || isLoaded}
              variant="default"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  {loadingLabel}
                </>
              ) : (
                <>
                  <Database size={16} weight="fill" />
                  {loadLabel}
                </>
              )}
            </Button>

            <Button
              onClick={onResetSeedData}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  {resettingLabel}
                </>
              ) : (
                <>
                  <ArrowClockwise size={16} weight="bold" />
                  {resetLabel}
                </>
              )}
            </Button>

            <Button
              onClick={onClearAllData}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  {clearingLabel}
                </>
              ) : (
                <>
                  <Trash size={16} weight="fill" />
                  {clearLabel}
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            {helperText.load && (
              <p>
                <strong>Load Seed Data:</strong> {helperText.load}
              </p>
            )}
            {helperText.reset && (
              <p>
                <strong>Reset to Defaults:</strong> {helperText.reset}
              </p>
            )}
            {helperText.clear && (
              <p>
                <strong>Clear All Data:</strong> {helperText.clear}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
