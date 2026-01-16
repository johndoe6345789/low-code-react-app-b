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

export interface ColorPalette {
  primaryColor: string
  secondaryColor: string
  errorColor: string
  warningColor: string
  successColor: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  customColors: Record<string, string>
}

export interface ThemeVariant {
  id: string
  name: string
  colors: ColorPalette
}

export interface ThemeConfig {
  variants: ThemeVariant[]
  activeVariantId: string
  fontFamily: string
  fontSize: {
    small: number
    medium: number
    large: number
  }
  spacing: number
  borderRadius: number
}

export interface PlaywrightTest {
  id: string
  name: string
  description: string
  pageUrl: string
  steps: PlaywrightStep[]
}

export interface PlaywrightStep {
  id: string
  action: 'navigate' | 'click' | 'fill' | 'expect' | 'wait' | 'select' | 'check' | 'uncheck'
  selector?: string
  value?: string
  assertion?: string
  timeout?: number
}

export interface StorybookStory {
  id: string
  componentName: string
  storyName: string
  args: Record<string, any>
  description: string
  category: string
}

export interface UnitTest {
  id: string
  name: string
  description: string
  testType: 'component' | 'function' | 'hook' | 'integration'
  targetFile: string
  testCases: TestCase[]
}

export interface TestCase {
  id: string
  description: string
  assertions: string[]
  setup?: string
  teardown?: string
}

export interface FlaskEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  name: string
  description: string
  requestBody?: FlaskRequestBody
  queryParams?: FlaskParam[]
  pathParams?: FlaskParam[]
  responseSchema?: string
  authentication?: boolean
  corsEnabled?: boolean
}

export interface FlaskRequestBody {
  contentType: 'application/json' | 'multipart/form-data' | 'application/x-www-form-urlencoded'
  schema: Record<string, FlaskFieldSchema>
}

export interface FlaskParam {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  required: boolean
  description?: string
  defaultValue?: string
}

export interface FlaskFieldSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description?: string
  validation?: string
}

export interface FlaskBlueprint {
  id: string
  name: string
  urlPrefix: string
  endpoints: FlaskEndpoint[]
  description: string
}

export interface FlaskConfig {
  blueprints: FlaskBlueprint[]
  databaseUrl?: string
  corsOrigins?: string[]
  jwtSecret?: boolean
  enableSwagger?: boolean
  port?: number
  debug?: boolean
}

export interface NextJsConfig {
  appName: string
  typescript: boolean
  eslint: boolean
  tailwind: boolean
  srcDirectory: boolean
  appRouter: boolean
  importAlias: string
  turbopack?: boolean
}

export interface NpmPackage {
  id: string
  name: string
  version: string
  isDev: boolean
  description?: string
}

export interface NpmSettings {
  packages: NpmPackage[]
  scripts: Record<string, string>
  nodeVersion?: string
  packageManager: 'npm' | 'yarn' | 'pnpm'
}

export interface Project {
  name: string
  files: ProjectFile[]
  models: PrismaModel[]
  components: ComponentNode[]
  theme: ThemeConfig
  playwrightTests?: PlaywrightTest[]
  storybookStories?: StorybookStory[]
  unitTests?: UnitTest[]
  flaskConfig?: FlaskConfig
  nextjsConfig?: NextJsConfig
  npmSettings?: NpmSettings
}
