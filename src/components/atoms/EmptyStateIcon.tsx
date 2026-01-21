interface EmptyStateIconProps {
  icon: React.ReactNode
  variant?: 'default' | 'muted'
}

export function EmptyStateIcon({ icon, variant = 'muted' }: EmptyStateIconProps) {
  const variantClasses = {
    default: 'from-primary/20 to-accent/20 text-primary',
    muted: 'from-muted to-muted/50 text-muted-foreground',
  }

  return (
    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${variantClasses[variant]} flex items-center justify-center`}>
      {icon}
    </div>
  )
}
