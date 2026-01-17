/// <reference path="../global.d.ts" />

import { PrismaModel, ComponentNode, ThemeConfig, ProjectFile } from '@/types/project'
import { ProtectedLLMService } from './protected-llm-service'

export class AIService {
  static async generateComponent(description: string): Promise<ComponentNode | null> {
    try {
      const prompt = window.spark.llmPrompt`You are a React component generator. Generate a component tree structure based on this description: ${description}

Return a valid JSON object with a single property "component" containing the component structure. The component should follow this format:
{
  "component": {
    "id": "unique-id",
    "type": "Box",
    "name": "ComponentName",
    "props": {
      "sx": { "p": 2 }
    },
    "children": []
  }
}

Make sure to use appropriate Material UI components and props. Keep the structure clean and semantic.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: true, priority: 'medium', category: 'generate-component' }
      )

      if (result) {
        const parsed = JSON.parse(result)
        return parsed.component
      }
      return null
    } catch (error) {
      console.error('AI component generation failed:', error)
      return null
    }
  }

  static async generatePrismaModel(description: string, existingModels: PrismaModel[]): Promise<PrismaModel | null> {
    try {
      const existingModelNames = existingModels.map(m => m.name).join(', ')

      const prompt = window.spark.llmPrompt`You are a Prisma schema expert. Create a Prisma model based on this description: ${description}

Existing models in the schema: ${existingModelNames || 'none'}

Return a valid JSON object with a single property "model" containing the model structure:
{
  "model": {
    "id": "unique-id-here",
    "name": "ModelName",
    "fields": [
      {
        "id": "field-id-1",
        "name": "id",
        "type": "String",
        "isRequired": true,
        "isUnique": true,
        "isArray": false,
        "defaultValue": "uuid()"
      },
      {
        "id": "field-id-2",
        "name": "fieldName",
        "type": "String",
        "isRequired": true,
        "isUnique": false,
        "isArray": false
      }
    ]
  }
}`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: true, priority: 'medium', category: 'generate-model' }
      )

      if (result) {
        const parsed = JSON.parse(result)
        return parsed.model
      }
      return null
    } catch (error) {
      console.error('AI model generation failed:', error)
      return null
    }
  }

  static async generateCodeFromDescription(
    description: string,
    fileType: 'component' | 'page' | 'api' | 'utility'
  ): Promise<string | null> {
    try {
      const fileTypeInstructions = {
        component: "Create a reusable React component with TypeScript. Use Material UI components and proper typing.",
        page: "Create a Next.js page component with 'use client' directive if needed. Use Material UI and proper page structure.",
        api: "Create a Next.js API route handler with proper types and error handling.",
        utility: "Create a utility function with TypeScript types and JSDoc comments."
      }

      const prompt = window.spark.llmPrompt`You are a Next.js developer. ${fileTypeInstructions[fileType]}

Description: ${description}

Generate clean, production-ready code following Next.js 14 and Material UI best practices. Include all necessary imports.

Return ONLY the code without any markdown formatting or explanations.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: false, priority: 'high', category: 'generate-code' }
      )

      return result ? result.trim() : null
    } catch (error) {
      console.error('AI code generation failed:', error)
      return null
    }
  }

  static async improveCode(code: string, instruction: string): Promise<string | null> {
    try {
      const prompt = window.spark.llmPrompt`You are a code improvement assistant. Improve the following code based on this instruction: ${instruction}

Original code:
${code}

Return ONLY the improved code without any markdown formatting or explanations.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: false, priority: 'high', category: 'improve-code' }
      )

      return result ? result.trim() : null
    } catch (error) {
      console.error('AI code improvement failed:', error)
      return null
    }
  }

  static async generateThemeFromDescription(description: string): Promise<Partial<ThemeConfig> | null> {
    try {
      const prompt = window.spark.llmPrompt`You are a UI/UX designer. Generate a Material UI theme configuration based on this description: ${description}

Return a valid JSON object with a single property "theme" containing:
{
  "theme": {
    "primaryColor": "#hex-color",
    "secondaryColor": "#hex-color",
    "errorColor": "#hex-color",
    "warningColor": "#ff9800",
    "successColor": "#hex-color",
    "fontFamily": "font-name, fallback",
    "fontSize": {
      "small": 12,
      "medium": 14,
      "large": 20
    },
    "spacing": 8,
    "borderRadius": 4
  }
}`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: true, priority: 'low', category: 'generate-theme' }
      )

      if (result) {
        const parsed = JSON.parse(result)
        return parsed.theme
      }
      return null
    } catch (error) {
      console.error('AI theme generation failed:', error)
      return null
    }
  }

  static async suggestFieldsForModel(modelName: string, existingFields: string[]): Promise<string[] | null> {
    try {
      const existingFieldsStr = existingFields.join(', ')
      const prompt = window.spark.llmPrompt`You are a database architect. Suggest additional useful fields for a Prisma model named ${modelName}.

Existing fields: ${existingFieldsStr}

Return a valid JSON object with a single property "fields" containing an array of field name suggestions (strings only):
{
  "fields": ["fieldName1", "fieldName2", "fieldName3"]
}

Suggest 3-5 common fields that would be useful for this model type. Use camelCase naming.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: true, priority: 'low', category: 'suggest-fields' }
      )

      if (result) {
        const parsed = JSON.parse(result)
        return parsed.fields
      }
      return null
    } catch (error) {
      console.error('AI field suggestion failed:', error)
      return null
    }
  }

  static async explainCode(code: string): Promise<string | null> {
    try {
      const prompt = window.spark.llmPrompt`You are a code teacher. Explain what this code does in simple terms:
${code}

Provide a clear, concise explanation suitable for developers.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: false, priority: 'low', category: 'explain-code', model: 'gpt-4o-mini' }
      )

      return result ? result.trim() : null
    } catch (error) {
      console.error('AI code explanation failed:', error)
      return null
    }
  }

  static async generateCompleteApp(description: string): Promise<{ files: ProjectFile[], models: PrismaModel[], theme: Partial<ThemeConfig> } | null> {
    try {
      const prompt = window.spark.llmPrompt`You are a full-stack architect. Generate a complete Next.js application structure based on this description: ${description}

Return a valid JSON object with properties "files", "models", and "theme":
{
  "files": [
    {
      "id": "unique-id",
      "name": "page.tsx",
      "path": "/src/app/page.tsx",
      "content": "full code content here",
      "language": "typescript"
    }
  ],
  "models": [
    {
      "id": "unique-id",
      "name": "User",
      "fields": [
        {
          "id": "field-id",
          "name": "id",
          "type": "String",
          "isRequired": true,
          "isUnique": true,
          "isArray": false,
          "defaultValue": "uuid()"
        }
      ]
    }
  ],
  "theme": {
    "primaryColor": "#1976d2",
    "secondaryColor": "#dc004e",
    "errorColor": "#f44336",
    "warningColor": "#ff9800",
    "successColor": "#4caf50",
    "fontFamily": "Roboto, Arial, sans-serif",
    "fontSize": { "small": 12, "medium": 14, "large": 20 },
    "spacing": 8,
    "borderRadius": 4
  }
}

Create 2-4 essential files for the app structure. Include appropriate Prisma models. Design a cohesive theme.`

      const result = await ProtectedLLMService.safeLLMCall(
        prompt,
        { jsonMode: true, priority: 'high', category: 'generate-app' }
      )

      if (result) {
        return JSON.parse(result)
      }
      return null
    } catch (error) {
      console.error('AI app generation failed:', error)
      return null
    }
  }
}
