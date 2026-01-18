import { cn } from '@/lib/utils'

interface AvatarGroupProps {
  avatars: {
    src?: string
    alt: string
    fallback: string
  }[]
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(avatars.length - max, 0)

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'relative inline-flex items-center justify-center rounded-full border-2 border-background bg-muted overflow-hidden',
            sizeClasses[size]
          )}
          title={avatar.alt}
        >
          {avatar.src ? (
            <img src={avatar.src} alt={avatar.alt} className="h-full w-full object-cover" />
          ) : (
            <span className="font-medium text-foreground">{avatar.fallback}</span>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full border-2 border-background bg-muted',
            sizeClasses[size]
          )}
        >
          <span className="font-medium text-foreground">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
}
