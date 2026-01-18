import { JSONPageRenderer } from '@/components/JSONPageRenderer'
import { LoadingFallback } from '@/components/molecules'
import { useSchemaLoader } from '@/hooks/use-schema-loader'

interface JSONSchemaPageLoaderProps {
  schemaPath: string
  data?: Record<string, any>
  functions?: Record<string, (...args: any[]) => any>
}

export function JSONSchemaPageLoader({ schemaPath, data, functions }: JSONSchemaPageLoaderProps) {
  const { schema, loading, error } = useSchemaLoader(schemaPath)

  if (loading) {
    return <LoadingFallback message={`Loading ${schemaPath}...`} />
  }

  if (error || !schema) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error || 'Schema not found'}</p>
      </div>
    )
  }

  return <JSONPageRenderer schema={schema} data={data} functions={functions} />
}
