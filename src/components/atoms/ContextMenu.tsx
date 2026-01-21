import {
  ContextMenu as ShadcnContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import { ReactNode } from 'react'

export interface ContextMenuItemType {
  label: string
  icon?: ReactNode
  shortcut?: string
  onSelect?: () => void
  disabled?: boolean
  separator?: boolean
  submenu?: ContextMenuItemType[]
}

interface ContextMenuProps {
  trigger: ReactNode
  items: ContextMenuItemType[]
}

export function ContextMenu({ trigger, items }: ContextMenuProps) {
  const renderItems = (menuItems: ContextMenuItemType[]) => {
    return menuItems.map((item, index) => {
      if (item.separator) {
        return <ContextMenuSeparator key={`separator-${index}`} />
      }

      if (item.submenu && item.submenu.length > 0) {
        return (
          <ContextMenuSub key={index}>
            <ContextMenuSubTrigger>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {renderItems(item.submenu)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )
      }

      return (
        <ContextMenuItem
          key={index}
          onSelect={item.onSelect}
          disabled={item.disabled}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          {item.shortcut && (
            <span className="ml-auto text-xs text-muted-foreground">
              {item.shortcut}
            </span>
          )}
        </ContextMenuItem>
      )
    })
  }

  return (
    <ShadcnContextMenu>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent>{renderItems(items)}</ContextMenuContent>
    </ShadcnContextMenu>
  )
}
