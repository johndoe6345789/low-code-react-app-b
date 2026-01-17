import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  fallback?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export function Image({ 
  src, 
  alt, 
  width, 
  height, 
  fit = 'cover',
  fallback,
  className,
  onLoad,
  onError 
}: ImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLoad = () => {
    setLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setLoading(false)
    onError?.()
  }

  const imgSrc = error && fallback ? fallback : src

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity',
          loading ? 'opacity-0' : 'opacity-100',
          `object-${fit}`
        )}
      />
    </div>
  )
}
