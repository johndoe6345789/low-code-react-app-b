import { useEffect, useMemo, useState } from 'react'
import { PageSchema, DataSource } from '@/types/page-schema'
import { useFiles } from '../data/use-files'
import { useModels } from '../data/use-models'
import { useComponents } from '../data/use-components'
import { useWorkflows } from '../data/use-workflows'
import { useLambdas } from '../data/use-lambdas'
import { useActions } from './use-actions'

export function usePage(schema: PageSchema) {
  const files = useFiles()
  const models = useModels()
  const components = useComponents()
  const workflows = useWorkflows()
  const lambdas = useLambdas()
  
  const [staticData, setStaticData] = useState<Record<string, any>>({})
  
  const dataContext = useMemo(() => {
    const context: Record<string, any> = {
      files: files.files,
      models: models.models,
      components: components.components,
      workflows: workflows.workflows,
      lambdas: lambdas.lambdas,
      setFiles: files.addFile,
      setModels: models.addModel,
      setComponents: components.addComponent,
      setWorkflows: workflows.addWorkflow,
      setLambdas: lambdas.addLambda,
      ...staticData,
    }
    
    if (schema.seedData) {
      Object.assign(context, schema.seedData)
    }
    
    return context
  }, [files, models, components, workflows, lambdas, staticData, schema.seedData])
  
  const { execute, isExecuting, handlers } = useActions(schema.actions, dataContext)
  
  useEffect(() => {
    if (schema.data) {
      const nextStatic: Record<string, any> = {}
      schema.data.forEach(source => {
        if (source.type === 'static' && source.defaultValue !== undefined) {
          nextStatic[source.id] = source.defaultValue
        }
      })
      setStaticData(nextStatic)
    }
  }, [schema.data, dataContext])
  
  return {
    context: dataContext,
    execute,
    isExecuting,
    handlers,
    schema,
  }
}
