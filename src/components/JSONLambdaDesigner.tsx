import { PageRenderer } from '@/lib/schema-renderer'
import lambdaDesignerSchema from '@/config/pages/lambda-designer.json'
import { useKV } from '@github/spark/hooks'
import { Component as ComponentSchema } from '@/schemas/ui-schema'

export function JSONLambdaDesigner() {
  const [lambdas] = useKV('app-lambdas', [])
  
  return (
    <PageRenderer 
      schema={lambdaDesignerSchema as ComponentSchema} 
      data={{ lambdas }}
      functions={{}}
    />
  )
}
