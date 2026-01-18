import { PageRenderer } from '@/lib/json-ui/page-renderer'
import { LoadingFallback } from '@/components/molecules'
import { useSchemaLoader } from '@/hooks/use-schema-loader'

interface JSONSchemaPageLoaderProps {
  schemaPath: string
}

export function JSONSchemaPageLoader({ schemaPath }: JSONSchemaPageLoaderProps) {
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

  return <PageRenderer schema={schema} />
}
