import { JSONPageRenderer, ComponentRendererProps } from './JSONPageRenderer'
import flaskDesignerConfig from '@/config/pages/flask-designer.json'

export function JSONFlaskDesigner() {
  return <JSONPageRenderer schema={flaskDesignerConfig as ComponentRendererProps['schema']} />
}
