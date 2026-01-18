interface IconWrapperProps {
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'muted' | 'primary' | 'destructive'
  className?: string
}

export function IconWrapper({ 
  icon, 
  size = 'md', 
  variant = 'default',
  className = '' 
}: IconWrapperProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    destructive: 'text-destructive',
  }

  return (
    <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {icon}
    </span>
  )
}
