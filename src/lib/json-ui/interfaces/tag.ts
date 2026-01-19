export interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
  className?: string
}
