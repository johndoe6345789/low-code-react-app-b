import { useState, useCallback } from 'react'

export type ValidationRule<T> = {
  validate: (value: T) => boolean
  message: string
}

export function useFormField<T>(
  initialValue: T,
  rules: ValidationRule<T>[] = []
) {
  const [value, setValue] = useState<T>(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const validate = useCallback(() => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        setError(rule.message)
        return false
      }
    }
    setError(null)
    return true
  }, [value, rules])

  const onChange = useCallback((newValue: T) => {
    setValue(newValue)
    setTouched(true)
  }, [])

  const onBlur = useCallback(() => {
    setTouched(true)
    validate()
  }, [validate])

  const reset = useCallback(() => {
    setValue(initialValue)
    setError(null)
    setTouched(false)
  }, [initialValue])

  return {
    value,
    setValue,
    onChange,
    onBlur,
    error,
    touched,
    isValid: error === null && touched,
    validate,
    reset,
  }
}
