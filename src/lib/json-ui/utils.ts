export function resolveDataBinding(binding: string | { source: string; path?: string }, dataMap: Record<string, any>): any {
  if (typeof binding === 'string') {
    return dataMap[binding]
  }
  
  const { source, path } = binding
  const data = dataMap[source]
  
  if (!path) return data
  
  return getNestedValue(data, path)
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current?.[key]
  }, obj)
}

export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {}
    }
    return current[key]
  }, obj)
  
  target[lastKey] = value
  return obj
}

export function evaluateCondition(condition: string, context: Record<string, any>): boolean {
  try {
    const conditionFn = new Function(...Object.keys(context), `return ${condition}`)
    return Boolean(conditionFn(...Object.values(context)))
  } catch (err) {
    console.warn('Failed to evaluate condition:', condition, err)
    return false
  }
}

export function transformData(data: any, transformFn: string): any {
  try {
    const fn = new Function('data', `return ${transformFn}`)
    return fn(data)
  } catch (err) {
    console.warn('Failed to transform data:', err)
    return data
  }
}

export function mergeClassNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(prefix = 'ui'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
