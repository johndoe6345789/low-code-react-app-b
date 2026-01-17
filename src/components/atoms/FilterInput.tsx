import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface FilterInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterInput({
  value,
  onChange,
  placeholder = 'Filter...',
  className,
}: FilterInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <MagnifyingGlass
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
          isFocused ? 'text-primary' : 'text-muted-foreground'
        )}
        size={16}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
