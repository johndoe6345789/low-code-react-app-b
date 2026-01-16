export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: string
}

export interface PrismaModel {
  id: string
  name: string
  fields: PrismaField[]
}

export interface PrismaField {
  id: string
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
  isArray: boolean
  defaultValue?: string
  relation?: string
}

export interface ComponentNode {
  id: string
  type: string
  props: Record<string, any>
  children: ComponentNode[]
  name: string
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  errorColor: string
  warningColor: string
  successColor: string
  fontFamily: string
  fontSize: {
    small: number
    medium: number
    large: number
  }
  spacing: number
  borderRadius: number
}

export interface Project {
  name: string
  files: ProjectFile[]
  models: PrismaModel[]
  components: ComponentNode[]
  theme: ThemeConfig
}
