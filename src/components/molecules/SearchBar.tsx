import { Input, IconButton, Flex } from '@/components/atoms'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  return (
    <Flex gap="sm" className={className}>
      <div className="relative flex-1">
        <MagnifyingGlass 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          size={16}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {value && (
        <IconButton
          icon={<X size={16} />}
          variant="ghost"
          onClick={() => onChange('')}
          title="Clear search"
        />
      )}
    </Flex>
  )
}
