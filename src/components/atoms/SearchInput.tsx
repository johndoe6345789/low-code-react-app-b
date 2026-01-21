import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Input } from '@/lib/json-ui/json-components'

interface BasicSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
}

export function BasicSearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className,
}: BasicSearchInputProps) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      leftIcon={<MagnifyingGlass size={18} />}
      rightIcon={
        value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )
      }
    />
  )
}
