import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { Database, ArrowClockwise, Trash, CheckCircle, CircleNotch } from '@phosphor-icons/react'

export function SeedDataManager() {
  const { isLoaded, isLoading, loadSeedData, resetSeedData, clearAllData } = useSeedData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={24} weight="duotone" />
          Seed Data Management
        </CardTitle>
        <CardDescription>
          Load, reset, or clear application seed data from the database
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoaded && (
          <Alert>
            <CheckCircle className="h-4 w-4" weight="fill" />
            <AlertDescription>
              Seed data is loaded and available
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={loadSeedData}
              disabled={isLoading || isLoaded}
              variant="default"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  Loading...
                </>
              ) : (
                <>
                  <Database size={16} weight="fill" />
                  Load Seed Data
                </>
              )}
            </Button>

            <Button
              onClick={resetSeedData}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  Resetting...
                </>
              ) : (
                <>
                  <ArrowClockwise size={16} weight="bold" />
                  Reset to Defaults
                </>
              )}
            </Button>

            <Button
              onClick={clearAllData}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <CircleNotch className="animate-spin" size={16} />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash size={16} weight="fill" />
                  Clear All Data
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Load Seed Data:</strong> Populates database with initial data if not already loaded</p>
            <p><strong>Reset to Defaults:</strong> Overwrites all data with fresh seed data</p>
            <p><strong>Clear All Data:</strong> Removes all data from the database (destructive action)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
