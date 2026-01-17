import { PageRenderer } from '@/lib/json-ui/page-renderer'
import modelDesignerSchema from '@/config/pages/model-designer.json'
import { PageSchema } from '@/types/json-ui'

interface JSONModelDesignerProps {
  models: any[]
  onModelsChange: (models: any[]) => void
}

export function JSONModelDesigner({ models, onModelsChange }: JSONModelDesignerProps) {
  const schema = modelDesignerSchema as PageSchema

  const handleCustomAction = async (action: any, event?: any) => {
    console.log('[JSONModelDesigner] Custom action:', action, event)
  }

  return <PageRenderer schema={schema} onCustomAction={handleCustomAction} />
}
