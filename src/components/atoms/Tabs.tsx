import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', className }: TabsProps) {
  const variantStyles = {
    default: {
      container: 'border-b border-border',
      tab: 'border-b-2 border-transparent data-[active=true]:border-primary',
      active: 'text-foreground',
      inactive: 'text-muted-foreground hover:text-foreground',
    },
    pills: {
      container: 'bg-muted p-1 rounded-lg',
      tab: 'rounded-md data-[active=true]:bg-background data-[active=true]:shadow-sm',
      active: 'text-foreground',
      inactive: 'text-muted-foreground hover:text-foreground',
    },
    underline: {
      container: 'border-b border-border',
      tab: 'border-b-2 border-transparent data-[active=true]:border-accent',
      active: 'text-accent',
      inactive: 'text-muted-foreground hover:text-foreground',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn('flex gap-1', styles.container, className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            data-active={isActive}
            className={cn(
              'flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors',
              isActive ? styles.active : styles.inactive,
              styles.tab,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
