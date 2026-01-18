interface TabIconProps {
  icon: React.ReactNode
  variant?: 'default' | 'gradient'
}

export function TabIcon({ icon, variant = 'default' }: TabIconProps) {
  if (variant === 'gradient') {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
    )
  }

  return <>{icon}</>
}
