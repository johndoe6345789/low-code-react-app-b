import { FileCode, FileJs, FilePlus } from '@phosphor-icons/react'

interface FileIconProps {
  type?: 'code' | 'json' | 'plus'
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}

export function FileIcon({ type = 'code', size = 20, weight = 'regular', className = '' }: FileIconProps) {
  const iconMap = {
    code: FileCode,
    json: FileJs,
    plus: FilePlus,
  }

  const IconComponent = iconMap[type]
  return <IconComponent size={size} weight={weight} className={className} />
}
