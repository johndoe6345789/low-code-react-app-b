/**
 * JSON-friendly expression evaluator
 * Safely evaluates simple expressions without requiring external functions
 */

interface EvaluationContext {
  data: Record<string, any>
  event?: any
}

type ExpressionFunction = (args: any[], context: EvaluationContext) => any

const parseArguments = (argsString: string): string[] => {
  if (!argsString.trim()) return []
  const args: string[] = []
  let current = ''
  let depth = 0
  let inSingleQuote = false
  let inDoubleQuote = false

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i]
    const prevChar = argsString[i - 1]

    if (char === "'" && !inDoubleQuote && prevChar !== '\\') {
      inSingleQuote = !inSingleQuote
    } else if (char === '"' && !inSingleQuote && prevChar !== '\\') {
      inDoubleQuote = !inDoubleQuote
    } else if (!inSingleQuote && !inDoubleQuote) {
      if (char === '(') depth += 1
      if (char === ')') depth = Math.max(0, depth - 1)
      if (char === ',' && depth === 0) {
        args.push(current.trim())
        current = ''
        continue
      }
    }

    current += char
  }

  if (current.trim()) {
    args.push(current.trim())
  }

  return args
}

const expressionFunctions: Record<string, ExpressionFunction> = {
  findById: ([list, id]) => {
    if (!Array.isArray(list)) return null
    return list.find((item) => item?.id === id) ?? null
  },
  findByIdOrFirst: ([list, id]) => {
    if (!Array.isArray(list)) return null
    return list.find((item) => item?.id === id) ?? list[0] ?? null
  },
  length: ([value]) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length
    }
    if (value && typeof value === 'object') {
      return Object.keys(value).length
    }
    return 0
  },
  keyCount: ([value]) => {
    if (!value || typeof value !== 'object') return 0
    return Object.keys(value).length
  },
  sumByLength: ([list, path], context) => {
    if (!Array.isArray(list)) return 0
    const resolvedPath = typeof path === 'string' ? path : evaluateExpression(String(path), context)
    if (!resolvedPath || typeof resolvedPath !== 'string') return 0
    return list.reduce((sum, item) => {
      const value = getNestedValue(item, resolvedPath)
      const length = Array.isArray(value) || typeof value === 'string' ? value.length : 0
      return sum + length
    }, 0)
  },
  isRecentTimestamp: ([lastSaved, nowValue, thresholdValue]) => {
    if (!lastSaved) return false
    const now = typeof nowValue === 'number' ? nowValue : Date.now()
    const threshold = typeof thresholdValue === 'number' ? thresholdValue : 3000
    return now - lastSaved < threshold
  },
  timeAgo: ([lastSaved, nowValue]) => {
    if (!lastSaved) return ''
    const now = typeof nowValue === 'number' ? nowValue : Date.now()
    const seconds = Math.floor((now - lastSaved) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  },
  filterUsersByQuery: ([users, query]) => {
    const list = Array.isArray(users) ? users : []
    const normalizedQuery = typeof query === 'string' ? query.toLowerCase() : ''
    if (!normalizedQuery) return list
    return list.filter((user) => {
      const name = String(user?.name ?? '').toLowerCase()
      const email = String(user?.email ?? '').toLowerCase()
      return name.includes(normalizedQuery) || email.includes(normalizedQuery)
    })
  },
  userStats: ([users]) => {
    const list = Array.isArray(users) ? users : []
    return {
      total: list.length,
      active: list.filter((user) => user?.status === 'active').length,
      inactive: list.filter((user) => user?.status === 'inactive').length,
    }
  },
  todoStats: ([todos]) => {
    const list = Array.isArray(todos) ? todos : []
    return {
      total: list.length,
      completed: list.filter((todo) => Boolean(todo?.completed)).length,
      remaining: list.filter((todo) => !todo?.completed).length,
    }
  },
}

export const supportedExpressionFunctions = new Set(Object.keys(expressionFunctions))

/**
 * Safely evaluate a JSON expression
 * Supports:
 * - Data access: "data.fieldName", "data.user.name"
 * - Event access: "event.target.value", "event.key"
 * - Literals: numbers, strings, booleans, null
 * - Date operations: "Date.now()"
 * - Basic operations: trim(), toLowerCase(), toUpperCase()
 */
export function evaluateExpression(
  expression: string | undefined,
  context: EvaluationContext
): any {
  if (!expression) return undefined

  const { data, event } = context

  try {
    const functionMatch = expression.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\((.*)\)$/)
    if (functionMatch) {
      const functionName = functionMatch[1]
      const argString = functionMatch[2]
      const handler = expressionFunctions[functionName]
      if (handler) {
        const args = parseArguments(argString).map((arg) => evaluateExpression(arg, context))
        return handler(args, context)
      }
    }

    if (expression === 'event') {
      return event
    }

    if (expression === 'data') {
      return data
    }

    // Handle direct data access: "data.fieldName"
    if (expression.startsWith('data.')) {
      return getNestedValue(data, expression.substring(5))
    }

    // Handle event access: "event.target.value"
    if (expression.startsWith('event.')) {
      return getNestedValue(event, expression.substring(6))
    }

    // Handle Date.now()
    if (expression === 'Date.now()') {
      return Date.now()
    }

    // Handle string literals
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1)
    }
    if (expression.startsWith("'") && expression.endsWith("'")) {
      return expression.slice(1, -1)
    }

    // Handle numbers
    const num = Number(expression)
    if (!isNaN(num)) {
      return num
    }

    // Handle booleans
    if (expression === 'true') return true
    if (expression === 'false') return false
    if (expression === 'null') return null
    if (expression === 'undefined') return undefined

    // If no pattern matched, return the expression as-is
    console.warn(`Expression "${expression}" could not be evaluated, returning as-is`)
    return expression
  } catch (error) {
    console.error(`Failed to evaluate expression "${expression}":`, error)
    return undefined
  }
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue({ user: { name: 'John' } }, 'user.name') => 'John'
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined

  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }

  return current
}

/**
 * Apply string operation to a value
 * Supports: trim, toLowerCase, toUpperCase, length
 */
export function applyStringOperation(value: any, operation: string): any {
  if (value == null) return value

  const str = String(value)

  switch (operation) {
    case 'trim':
      return str.trim()
    case 'toLowerCase':
      return str.toLowerCase()
    case 'toUpperCase':
      return str.toUpperCase()
    case 'length':
      return str.length
    default:
      console.warn(`Unknown string operation: ${operation}`)
      return value
  }
}

/**
 * Evaluate a template object with dynamic values
 * Example: { "id": "Date.now()", "text": "data.newTodo" }
 */
export function evaluateTemplate(
  template: Record<string, any>,
  context: EvaluationContext
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(template)) {
    if (typeof value === 'string') {
      result[key] = evaluateExpression(value, context)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Evaluate a condition expression
 * Supports:
 * - "data.field > 0"
 * - "data.field.length > 0"
 * - "data.field === 'value'"
 * - "data.field != null"
 */
export function evaluateCondition(
  condition: string | undefined,
  context: EvaluationContext
): boolean {
  if (!condition) return true

  const { data } = context

  try {
    // Simple pattern matching for common conditions
    // "data.field > 0"
    const gtMatch = condition.match(/^data\.([a-zA-Z0-9_.]+)\s*>\s*(.+)$/)
    if (gtMatch) {
      const value = getNestedValue(data, gtMatch[1])
      const threshold = Number(gtMatch[2])
      return (value ?? 0) > threshold
    }

    // "data.field.length > 0"
    const lengthMatch = condition.match(/^data\.([a-zA-Z0-9_.]+)\.length\s*>\s*(.+)$/)
    if (lengthMatch) {
      const value = getNestedValue(data, lengthMatch[1])
      const threshold = Number(lengthMatch[2])
      const length = value?.length ?? 0
      return length > threshold
    }

    // "data.field === 'value'"
    const eqMatch = condition.match(/^data\.([a-zA-Z0-9_.]+)\s*===\s*['"](.+)['"]$/)
    if (eqMatch) {
      const value = getNestedValue(data, eqMatch[1])
      return value === eqMatch[2]
    }

    // "data.field != null"
    const nullCheck = condition.match(/^data\.([a-zA-Z0-9_.]+)\s*!=\s*null$/)
    if (nullCheck) {
      const value = getNestedValue(data, nullCheck[1])
      return value != null
    }

    // If no pattern matched, log warning and return true (fail open)
    console.warn(`Condition "${condition}" could not be evaluated, defaulting to true`)
    return true
  } catch (error) {
    console.error(`Failed to evaluate condition "${condition}":`, error)
    return true // Fail open
  }
}
