import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import navigationItemDef from './definitions/navigation-item.json'

interface NavigationItemWrapperProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  badge?: number
  onClick: () => void
}

export function NavigationItemWrapper(props: NavigationItemWrapperProps) {
  return (
    <div onClick={props.onClick}>
      <ComponentRenderer
        component={navigationItemDef}
        data={{
          icon: props.icon,
          label: props.label,
          isActive: props.isActive,
          badge: props.badge
        }}
        context={{}}
      />
    </div>
  )
}
