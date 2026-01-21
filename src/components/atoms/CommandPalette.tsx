import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ReactNode } from 'react'

interface CommandOption {
  value: string
  label: string
  icon?: ReactNode
  onSelect?: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
  emptyMessage?: string
  groups: {
    heading?: string
    items: CommandOption[]
  }[]
}

export function CommandPalette({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  groups,
}: CommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group, groupIndex) => (
          <CommandGroup key={groupIndex} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  item.onSelect?.()
                  onOpenChange(false)
                }}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
