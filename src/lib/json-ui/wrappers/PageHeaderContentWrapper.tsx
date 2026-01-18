import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import pageHeaderContentDef from './definitions/page-header-content.json'

interface PageHeaderContentWrapperProps {
  title: string
  icon: React.ReactNode
  description?: string
}

export function PageHeaderContentWrapper(props: PageHeaderContentWrapperProps) {
  return (
    <ComponentRenderer
      component={pageHeaderContentDef}
      data={{
        title: props.title,
        icon: props.icon,
        description: props.description
      }}
      context={{}}
    />
  )
}
