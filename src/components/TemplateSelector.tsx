import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSeedTemplates, type TemplateType } from '@/hooks/data/use-seed-templates'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TemplateExplorer } from './TemplateExplorer'
import { toast } from 'sonner'
import { Download, Package, Plus, Trash } from '@phosphor-icons/react'

export function TemplateSelector() {
  const { templates, isLoading, clearAndLoadTemplate, mergeTemplate } = useSeedTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<'replace' | 'merge'>('replace')

  const handleSelectTemplate = (templateId: TemplateType, action: 'replace' | 'merge') => {
    setSelectedTemplate(templateId)
    setActionType(action)
    setShowConfirmDialog(true)
  }

  const handleConfirmLoad = async () => {
    if (!selectedTemplate) return

    setShowConfirmDialog(false)
    
    const success = actionType === 'replace'
      ? await clearAndLoadTemplate(selectedTemplate)
      : await mergeTemplate(selectedTemplate)

    if (success) {
      toast.success(`Template loaded successfully!`, {
        description: `${actionType === 'replace' ? 'Replaced' : 'Merged'} with ${selectedTemplate} template`
      })
      window.location.reload()
    } else {
      toast.error('Failed to load template', {
        description: 'Please try again or check the console for errors'
      })
    }
  }

  return (
    <>
      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Load Templates</TabsTrigger>
          <TabsTrigger value="explorer">Explore Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Project Templates</h2>
            <p className="text-muted-foreground">
              Start your project with pre-configured templates including models, components, and workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{template.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSelectTemplate(template.id, 'replace')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Download className="mr-2" size={16} />
                      Load Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectTemplate(template.id, 'merge')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Plus className="mr-2" size={16} />
                      Merge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Package size={16} />
            <AlertDescription>
              <strong>Load Template:</strong> Replaces all existing data with the selected template.
              <br />
              <strong>Merge:</strong> Adds template data to your existing project without removing current data.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="explorer" className="mt-6">
          <TemplateExplorer />
        </TabsContent>
      </Tabs>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'replace' ? 'Replace Project Data?' : 'Merge Template Data?'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'replace' ? (
                <>
                  This will <strong className="text-destructive">delete all existing data</strong> and load the{' '}
                  <strong>{selectedTemplate}</strong> template. This action cannot be undone.
                </>
              ) : (
                <>
                  This will <strong>add</strong> the <strong>{selectedTemplate}</strong> template data to your
                  existing project without removing current data.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'replace' ? 'destructive' : 'default'}
              onClick={handleConfirmLoad}
            >
              {actionType === 'replace' ? (
                <>
                  <Trash className="mr-2" size={16} />
                  Replace All Data
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={16} />
                  Merge Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
