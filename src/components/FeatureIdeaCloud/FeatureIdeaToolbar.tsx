import { Panel } from 'reactflow'
import { Plus, Package, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type FeatureIdeaToolbarProps = {
  debugPanelOpen: boolean
  setDebugPanelOpen: (open: boolean) => void
  handleGenerateIdeas: () => void
  handleAddGroup: () => void
  handleAddIdea: () => void
}

export const FeatureIdeaToolbar = ({
  debugPanelOpen,
  setDebugPanelOpen,
  handleGenerateIdeas,
  handleAddGroup,
  handleAddIdea,
}: FeatureIdeaToolbarProps) => (
  <Panel position="top-right" className="flex gap-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setDebugPanelOpen(!debugPanelOpen)}
            variant="outline"
            className="shadow-lg"
            size="icon"
          >
            🔍
          </Button>
        </TooltipTrigger>
        <TooltipContent>Debug Connection Status</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleGenerateIdeas} variant="outline" className="shadow-lg">
            <Sparkle size={20} weight="duotone" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>AI Generate Ideas</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleAddGroup} variant="outline" className="shadow-lg">
            <Package size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add Group</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleAddIdea} className="shadow-lg">
            <Plus size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add Idea</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </Panel>
)
