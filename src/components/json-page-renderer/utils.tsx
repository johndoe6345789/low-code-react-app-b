import * as Icons from '@phosphor-icons/react'

export function resolveBinding(binding: string, data: Record<string, any>): any {
  try {
    const func = new Function(...Object.keys(data), `return ${binding}`)
    return func(...Object.values(data))
  } catch {
    return binding
  }
}

export function getIcon(iconName: string, props?: any) {
  const IconComponent = (Icons as any)[iconName]
  if (!IconComponent) return null
  return <IconComponent size={24} weight="duotone" {...props} />
}
