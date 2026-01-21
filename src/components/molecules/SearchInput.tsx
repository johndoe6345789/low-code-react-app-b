import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
}

export function SearchInput({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Search...', 
  className = '' 
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <MagnifyingGlass className="absolute left-3 text-muted-foreground" size={16} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange('')
            onClear?.()
          }}
          className="absolute right-1 h-7 w-7 p-0"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  )
}
