import { PrismaModel, ComponentNode, ThemeConfig } from '@/types/project'

export function generatePrismaSchema(models: PrismaModel[]): string {
  let schema = `generator client {\n  provider = "prisma-client-js"\n}\n\n`
  schema += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`

  models.forEach((model) => {
    schema += `model ${model.name} {\n`
    model.fields.forEach((field) => {
      let fieldLine = `  ${field.name} ${field.type}`
      if (field.isArray) fieldLine += '[]'
      if (field.isRequired && !field.defaultValue) fieldLine += ''
      else if (!field.isRequired) fieldLine += '?'
      if (field.isUnique) fieldLine += ' @unique'
      if (field.defaultValue) fieldLine += ` @default(${field.defaultValue})`
      schema += fieldLine + '\n'
    })
    schema += `}\n\n`
  })

  return schema
}

export function generateComponentCode(node: ComponentNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  const propsStr = Object.entries(node.props)
    .map(([key, value]) => {
      if (typeof value === 'string') return `${key}="${value}"`
      if (typeof value === 'boolean') return value ? key : ''
      return `${key}={${JSON.stringify(value)}}`
    })
    .filter(Boolean)
    .join(' ')

  if (node.children.length === 0) {
    return `${spaces}<${node.type}${propsStr ? ' ' + propsStr : ''} />`
  }

  let code = `${spaces}<${node.type}${propsStr ? ' ' + propsStr : ''}>\n`
  node.children.forEach((child) => {
    code += generateComponentCode(child, indent + 1) + '\n'
  })
  code += `${spaces}</${node.type}>`

  return code
}

export function generateMUITheme(theme: ThemeConfig): string {
  if (!theme.variants || theme.variants.length === 0) {
    return `import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
  },
});`
  }

  const lightVariant = theme.variants.find((v) => v.id === 'light') || theme.variants[0]
  const darkVariant = theme.variants.find((v) => v.id === 'dark')

  let themeCode = `import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '${lightVariant.colors.primaryColor}',
    },
    secondary: {
      main: '${lightVariant.colors.secondaryColor}',
    },
    error: {
      main: '${lightVariant.colors.errorColor}',
    },
    warning: {
      main: '${lightVariant.colors.warningColor}',
    },
    success: {
      main: '${lightVariant.colors.successColor}',
    },
    background: {
      default: '${lightVariant.colors.background}',
      paper: '${lightVariant.colors.surface}',
    },
    text: {
      primary: '${lightVariant.colors.text}',
      secondary: '${lightVariant.colors.textSecondary}',
    },
  },
  typography: {
    fontFamily: '${theme.fontFamily}',
    fontSize: ${theme.fontSize.medium},
  },
  spacing: ${theme.spacing},
  shape: {
    borderRadius: ${theme.borderRadius},
  },
});
`

  if (darkVariant) {
    themeCode += `
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '${darkVariant.colors.primaryColor}',
    },
    secondary: {
      main: '${darkVariant.colors.secondaryColor}',
    },
    error: {
      main: '${darkVariant.colors.errorColor}',
    },
    warning: {
      main: '${darkVariant.colors.warningColor}',
    },
    success: {
      main: '${darkVariant.colors.successColor}',
    },
    background: {
      default: '${darkVariant.colors.background}',
      paper: '${darkVariant.colors.surface}',
    },
    text: {
      primary: '${darkVariant.colors.text}',
      secondary: '${darkVariant.colors.textSecondary}',
    },
  },
  typography: {
    fontFamily: '${theme.fontFamily}',
    fontSize: ${theme.fontSize.medium},
  },
  spacing: ${theme.spacing},
  shape: {
    borderRadius: ${theme.borderRadius},
  },
});

export const theme = lightTheme;`
  } else {
    themeCode += `\nexport const theme = lightTheme;`
  }

  return themeCode
}

export function generateNextJSProject(
  projectName: string,
  models: PrismaModel[],
  components: ComponentNode[],
  theme: ThemeConfig
): Record<string, string> {
  const files: Record<string, string> = {}

  files['package.json'] = JSON.stringify(
    {
      name: projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        '@mui/material': '^5.15.0',
        '@emotion/react': '^11.11.0',
        '@emotion/styled': '^11.11.0',
        '@prisma/client': '^5.8.0',
        next: '14.1.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
      devDependencies: {
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        prisma: '^5.8.0',
        typescript: '^5',
      },
    },
    null,
    2
  )

  files['prisma/schema.prisma'] = generatePrismaSchema(models)

  files['src/theme.ts'] = generateMUITheme(theme)

  files['src/app/page.tsx'] = `'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/theme'

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Your components here */}
      </main>
    </ThemeProvider>
  )
}`

  files['next.config.js'] = `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`

  files['.env'] = `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"`

  files['README.md'] = `# ${projectName}

Generated with CodeForge

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up your database in .env

3. Run Prisma migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser.`

  return files
}
