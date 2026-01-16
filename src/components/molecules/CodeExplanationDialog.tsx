import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkle } from '@phosphor-icons/react'

interface CodeExplanationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string | undefined
  explanation: string
  isLoading: boolean
}

export function CodeExplanationDialog({
  open,
  onOpenChange,
  fileName,
  explanation,
  isLoading,
}: CodeExplanationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Code Explanation</DialogTitle>
          <DialogDescription>
            AI-generated explanation of {fileName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="p-4 bg-muted rounded-lg">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkle size={16} weight="duotone" className="animate-pulse" />
                Analyzing code...
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm">{explanation}</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
