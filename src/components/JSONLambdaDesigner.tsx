import { PageRenderer } from '@/lib/schema-renderer'
import lambdaDesignerSchema from '@/config/pages/lambda-designer.json'
import { useKV } from '@github/spark/hooks'

export function JSONLambdaDesigner() {
  const [lambdas] = useKV('app-lambdas', [])
  
  return (
    <PageRenderer 
      schema={lambdaDesignerSchema as any} 
      data={{ lambdas }}
      functions={{}}
    />
  )
}
