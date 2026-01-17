import { JSONPageRenderer } from './JSONPageRenderer'
import lambdaDesignerConfig from '@/config/pages/lambda-designer.json'

export function JSONLambdaDesigner() {
  return <JSONPageRenderer config={lambdaDesignerConfig} />
}
