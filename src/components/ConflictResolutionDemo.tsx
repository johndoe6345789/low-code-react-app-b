import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useConflictResolution } from '@/hooks/use-conflict-resolution'
import { ConflictIndicator } from '@/components/ConflictIndicator'
import { db } from '@/lib/db'
import { 
  Flask, 
  Database, 
  Warning, 
  CheckCircle, 
  ArrowsClockwise 
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function ConflictResolutionDemo() {
  const { hasConflicts, stats, detect, resolveAll } = useConflictResolution()
  const [simulatingConflict, setSimulatingConflict] = useState(false)

  const simulateConflict = async () => {
    setSimulatingConflict(true)
    try {
      const testFile = {
        id: 'demo-conflict-file',
        name: 'example.ts',
        path: '/src/example.ts',
        content: 'const local = "This is the local version"',
        language: 'typescript',
        updatedAt: Date.now(),
      }

      await db.put('files', testFile)
      
      toast.info('Simulated local file created. Now simulating a remote conflict...')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Conflict simulation complete! Click "Detect Conflicts" to see it.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to simulate conflict')
    } finally {
      setSimulatingConflict(false)
    }
  }

  const handleQuickResolveAll = async () => {
    try {
      await resolveAll('local')
      toast.success('All conflicts resolved using local versions')
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve conflicts')
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold font-mono mb-2">Conflict Resolution System</h2>
        <p className="text-muted-foreground">
          Demo and test the conflict detection and resolution features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database size={20} className="text-primary" weight="duotone" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conflicts:</span>
              {hasConflicts ? (
                <Badge variant="destructive">{stats.totalConflicts}</Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle size={12} />
                  None
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Files:</span>
              <span className="text-sm font-medium">{stats.conflictsByType.files || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Models:</span>
              <span className="text-sm font-medium">{stats.conflictsByType.models || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flask size={20} className="text-accent" weight="duotone" />
              Demo Actions
            </CardTitle>
            <CardDescription>Test the conflict resolution workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={simulateConflict}
                disabled={simulatingConflict}
              >
                <Warning size={16} />
                Simulate Conflict
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => detect()}
              >
                <ArrowsClockwise size={16} />
                Detect Conflicts
              </Button>

              {hasConflicts && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleQuickResolveAll}
                  >
                    <CheckCircle size={16} />
                    Resolve All (Local)
                  </Button>
                </>
              )}
            </div>

            {hasConflicts && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/30">
                <div className="flex items-start gap-2">
                  <Warning size={20} className="text-destructive mt-0.5" weight="fill" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      {stats.totalConflicts} conflict{stats.totalConflicts === 1 ? '' : 's'} detected
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Navigate to the Conflict Resolution page to review and resolve them
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resolution Strategies</CardTitle>
          <CardDescription>Available approaches for handling conflicts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-md border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <Database size={16} className="text-primary" />
                <span className="font-medium text-sm">Keep Local</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Preserve the local version and discard remote changes
              </p>
            </div>

            <div className="p-3 rounded-md border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <Flask size={16} className="text-accent" />
                <span className="font-medium text-sm">Keep Remote</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Accept the remote version and overwrite local changes
              </p>
            </div>

            <div className="p-3 rounded-md border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <ArrowsClockwise size={16} className="text-primary" />
                <span className="font-medium text-sm">Merge Both</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Combine local and remote changes into a single version
              </p>
            </div>

            <div className="p-3 rounded-md border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-accent" />
                <span className="font-medium text-sm">Manual Edit</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Manually edit the conflicting data to create a custom resolution
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ConflictIndicator variant="compact" showLabel={false} />
            Conflict Indicator Component
          </CardTitle>
          <CardDescription>
            The conflict indicator can be placed anywhere in the UI to show active conflicts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Badge variant:</span>
              <ConflictIndicator variant="badge" showLabel={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Compact variant:</span>
              <ConflictIndicator variant="compact" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
