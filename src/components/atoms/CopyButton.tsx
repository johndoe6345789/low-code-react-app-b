import { Copy, Check } from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CopyButton({ text, size = 'md', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const sizeStyles = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded-md transition-colors',
        copied 
          ? 'bg-accent text-accent-foreground' 
          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        sizeStyles[size],
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check size={iconSize[size]} weight="bold" />
      ) : (
        <Copy size={iconSize[size]} />
      )}
    </button>
  )
}
