import { JSONPageRenderer } from './JSONPageRenderer'
import styleDesignerConfig from '@/config/pages/style-designer.json'

export function JSONStyleDesigner() {
  return <JSONPageRenderer config={styleDesignerConfig} />
}
