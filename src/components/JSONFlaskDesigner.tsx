import { JSONPageRenderer } from './JSONPageRenderer'
import flaskDesignerConfig from '@/config/pages/flask-designer.json'

export function JSONFlaskDesigner() {
  return <JSONPageRenderer config={flaskDesignerConfig} />
}
