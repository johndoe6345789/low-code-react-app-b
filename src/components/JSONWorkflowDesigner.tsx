import { PageRenderer } from '@/lib/json-ui/page-renderer'
import workflowDesignerSchema from '@/config/pages/workflow-designer.json'
import { PageSchema } from '@/types/json-ui'

interface JSONWorkflowDesignerProps {
  workflows: any[]
  onWorkflowsChange: (updater: (workflows: any[]) => any[]) => void
}

export function JSONWorkflowDesigner({ workflows, onWorkflowsChange }: JSONWorkflowDesignerProps) {
  const schema = workflowDesignerSchema as unknown as PageSchema

  const handleCustomAction = async (action: any, event?: any) => {
    console.log('[JSONWorkflowDesigner] Custom action:', action, event)
  }

  return <PageRenderer schema={schema} onCustomAction={handleCustomAction} />
}
