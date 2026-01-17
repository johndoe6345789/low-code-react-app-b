import { useState, useCallback, useEffect } from 'react'
import { PageSchemaType } from '@/schemas/ui-schema'

interface UseSchemaLoaderOptions {
  schemaUrl?: string
  schema?: PageSchemaType
  onError?: (error: Error) => void
}

export function useSchemaLoader({ schemaUrl, schema: initialSchema, onError }: UseSchemaLoaderOptions) {
  const [schema, setSchema] = useState<PageSchemaType | null>(initialSchema || null)
  const [loading, setLoading] = useState(!!schemaUrl && !initialSchema)
  const [error, setError] = useState<Error | null>(null)

  const loadSchema = useCallback(
    async (url: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to load schema: ${response.statusText}`)
        }

        const data = await response.json()
        setSchema(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error loading schema')
        setError(error)
        if (onError) {
          onError(error)
        }
      } finally {
        setLoading(false)
      }
    },
    [onError]
  )

  useEffect(() => {
    if (schemaUrl && !initialSchema) {
      loadSchema(schemaUrl)
    }
  }, [schemaUrl, initialSchema, loadSchema])

  const reloadSchema = useCallback(() => {
    if (schemaUrl) {
      loadSchema(schemaUrl)
    }
  }, [schemaUrl, loadSchema])

  return {
    schema,
    loading,
    error,
    reloadSchema,
    setSchema,
  }
}
