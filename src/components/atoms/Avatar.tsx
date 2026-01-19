import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const initials = fallback || alt?.slice(0, 2).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-muted-foreground">{initials}</span>
      )}
    </div>
  )
}
