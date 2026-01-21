import { Plus, Pencil, Trash, Copy, Download, Upload } from '@phosphor-icons/react'

interface ActionIconProps {
  action: 'add' | 'edit' | 'delete' | 'copy' | 'download' | 'upload'
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}

export function ActionIcon({ action, size = 16, weight = 'regular', className = '' }: ActionIconProps) {
  const iconMap = {
    add: Plus,
    edit: Pencil,
    delete: Trash,
    copy: Copy,
    download: Download,
    upload: Upload,
  }

  const IconComponent = iconMap[action]
  return <IconComponent size={size} weight={weight} className={className} />
}
