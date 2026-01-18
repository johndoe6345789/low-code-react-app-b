import { PageRenderer } from '@/lib/json-ui/page-renderer'
import lambdaDesignerSchema from '@/config/pages/lambda-designer.json'
import { PageSchema } from '@/types/json-ui'

export function JSONLambdaDesigner() {
  return (
    <PageRenderer schema={lambdaDesignerSchema as PageSchema} />
  )
}
