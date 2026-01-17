import { JSONPageRenderer, ComponentRendererProps } from './JSONPageRenderer'
import styleDesignerConfig from '@/config/pages/style-designer.json'

export function JSONStyleDesigner() {
  return <JSONPageRenderer schema={styleDesignerConfig as ComponentRendererProps['schema']} />
}
