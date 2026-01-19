import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'
import { Input } from './Input'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: boolean
  helperText?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PasswordInput({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Enter password',
  disabled,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  )
}
