import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  MapPin, 
  FileCode, 
  CheckCircle, 
  Clock, 
  Sparkle,
  Code,
  Database,
  Tree,
  PaintBrush,
  Flask,
  Play,
  Cube,
  Wrench,
  Gear,
  Package,
  Rocket,
  Target,
  Lightbulb
} from '@phosphor-icons/react'

export function DocumentationView() {
  const [activeTab, setActiveTab] = useState('readme')

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6 py-3">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="readme" className="gap-2">
              <BookOpen size={18} />
              README
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <MapPin size={18} />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <FileCode size={18} />
              Agents Files
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-8">
            <TabsContent value="readme" className="m-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Code size={32} weight="duotone" className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">CodeForge</h1>
                    <p className="text-lg text-muted-foreground">
                      Low-Code Next.js App Builder with AI
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Overview</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    CodeForge is a comprehensive visual low-code platform for generating production-ready Next.js applications. 
                    It combines the power of visual designers with direct code editing, AI-powered generation, and a complete 
                    full-stack development toolkit.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket size={20} weight="duotone" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FeatureItem 
                      icon={<Code size={18} />}
                      title="Monaco Code Editor"
                      description="Full-featured code editor with syntax highlighting, autocomplete, and AI-powered improvements"
                    />
                    <FeatureItem 
                      icon={<Database size={18} />}
                      title="Prisma Schema Designer"
                      description="Visual database model designer with automatic schema generation and AI assistance"
                    />
                    <FeatureItem 
                      icon={<Tree size={18} />}
                      title="Component Tree Builder"
                      description="Hierarchical component structure builder with drag-and-drop and AI generation"
                    />
                    <FeatureItem 
                      icon={<PaintBrush size={18} />}
                      title="Theme Designer"
                      description="Material UI theme customizer with multiple variants, custom colors, and AI theme generation"
                    />
                    <FeatureItem 
                      icon={<Flask size={18} />}
                      title="Flask Backend Designer"
                      description="Visual Python Flask API designer with blueprints, endpoints, and CORS configuration"
                    />
                    <FeatureItem 
                      icon={<Play size={18} />}
                      title="Playwright Test Designer"
                      description="E2E test builder with step configuration and AI test generation"
                    />
                    <FeatureItem 
                      icon={<Cube size={18} />}
                      title="Unit Test Designer"
                      description="Comprehensive test suite builder for components, functions, hooks, and integration tests"
                    />
                    <FeatureItem 
                      icon={<Wrench size={18} />}
                      title="Auto Error Repair"
                      description="Automated error detection and AI-powered code repair system"
                    />
                    <FeatureItem 
                      icon={<Gear size={18} />}
                      title="Project Settings"
                      description="Configure Next.js options, npm packages, scripts, and build settings"
                    />
                    <FeatureItem 
                      icon={<Sparkle size={18} />}
                      title="AI Integration"
                      description="OpenAI-powered generation across all features for rapid development"
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Getting Started</h2>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                          Create Your First Model
                        </h3>
                        <p className="text-muted-foreground ml-8">
                          Navigate to the <strong>Models</strong> tab and create your database schema using the visual designer 
                          or describe your data model to the AI.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                          Design Your Components
                        </h3>
                        <p className="text-muted-foreground ml-8">
                          Use the <strong>Components</strong> tab to build your UI hierarchy visually or let the AI generate 
                          component structures based on your requirements.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                          Customize Your Theme
                        </h3>
                        <p className="text-muted-foreground ml-8">
                          Head to the <strong>Styling</strong> tab to create custom color palettes, manage theme variants (light/dark), 
                          and configure typography.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                          Build Your Backend
                        </h3>
                        <p className="text-muted-foreground ml-8">
                          Configure your Flask API in the <strong>Flask API</strong> tab by creating blueprints and endpoints 
                          with full CORS and authentication support.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">5</span>
                          Export Your Project
                        </h3>
                        <p className="text-muted-foreground ml-8">
                          Click <strong>Export Project</strong> to generate all files including Next.js pages, Prisma schemas, 
                          Flask backend, tests, and configuration files ready for deployment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">AI-Powered Features</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    CodeForge integrates OpenAI across every designer to accelerate development:
                  </p>
                  <div className="grid gap-3">
                    <AIFeatureCard 
                      title="Complete App Generation"
                      description="Describe your application and get a full project structure with models, components, and styling"
                    />
                    <AIFeatureCard 
                      title="Model Generation"
                      description="Generate Prisma models with fields and relations from natural language descriptions"
                    />
                    <AIFeatureCard 
                      title="Component Creation"
                      description="Build complex React components with proper structure and Material UI integration"
                    />
                    <AIFeatureCard 
                      title="Theme Generation"
                      description="Create beautiful, accessible color palettes that match your brand or description"
                    />
                    <AIFeatureCard 
                      title="Test Generation"
                      description="Generate comprehensive E2E, unit, and integration tests with proper assertions"
                    />
                    <AIFeatureCard 
                      title="Code Explanation"
                      description="Get detailed explanations of any code snippet to understand implementation details"
                    />
                    <AIFeatureCard 
                      title="Code Improvement"
                      description="Automatically optimize code for performance, readability, and best practices"
                    />
                    <AIFeatureCard 
                      title="Error Repair"
                      description="Automatically detect and fix syntax, type, import, and lint errors with context-aware fixes"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Technology Stack</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Frontend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Next.js 14 with App Router
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            React 18 with TypeScript
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Material UI 5
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Monaco Editor
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Tailwind CSS
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Backend & Tools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Flask REST API
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Prisma ORM
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Playwright E2E Testing
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Vitest & React Testing Library
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} weight="fill" className="text-accent" />
                            Storybook for Components
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb size={20} weight="duotone" className="text-accent" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>💡 Use the AI Generate feature to quickly scaffold entire applications from descriptions</p>
                    <p>💡 The Error Repair tab automatically scans and fixes common issues - check it before exporting</p>
                    <p>💡 Create multiple theme variants (light, dark, custom) in the Styling tab for complete theme support</p>
                    <p>💡 Test your components with Storybook stories before writing full E2E tests</p>
                    <p>💡 Flask blueprints help organize your API endpoints by feature or resource</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="m-0 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <MapPin size={36} weight="duotone" className="text-accent" />
                  Product Roadmap
                </h1>
                <p className="text-lg text-muted-foreground">
                  Features delivered and planned for CodeForge development
                </p>

                <Separator />

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle size={24} weight="fill" className="text-green-500" />
                      <h2 className="text-2xl font-semibold">Completed Features</h2>
                    </div>
                    <div className="space-y-3 ml-9">
                      <RoadmapItem 
                        status="completed"
                        title="Monaco Code Editor Integration"
                        description="Full-featured code editor with syntax highlighting, multi-file tabs, and auto-save"
                        version="v1.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Prisma Schema Designer"
                        description="Visual database model designer with fields, relations, and schema generation"
                        version="v1.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Component Tree Builder"
                        description="Hierarchical React component structure builder with Material UI components"
                        version="v1.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Theme Designer"
                        description="Material UI theme customizer with color palettes and typography configuration"
                        version="v1.1"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="OpenAI Integration"
                        description="AI-powered generation across models, components, themes, and code"
                        version="v2.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Multi-Theme Variants"
                        description="Support for light, dark, and custom theme variants with unlimited custom colors"
                        version="v2.1"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Playwright Test Designer"
                        description="Visual E2E test builder with step-by-step configuration and AI generation"
                        version="v3.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Storybook Story Designer"
                        description="Component story builder with args configuration and category organization"
                        version="v3.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Unit Test Designer"
                        description="Comprehensive test suite builder for components, functions, hooks, and integration tests"
                        version="v3.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Auto Error Detection & Repair"
                        description="Automated error scanning with AI-powered context-aware code repair"
                        version="v3.1"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Responsive UI Improvements"
                        description="Multi-row tab support and improved layout for complex applications"
                        version="v3.2"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Flask Backend Designer"
                        description="Python Flask REST API designer with blueprints, endpoints, and CORS configuration"
                        version="v4.0"
                      />
                      <RoadmapItem 
                        status="completed"
                        title="Project Settings Designer"
                        description="Next.js configuration, npm package management, and build script customization"
                        version="v4.0"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Clock size={24} weight="duotone" className="text-accent" />
                      <h2 className="text-2xl font-semibold">Planned Features</h2>
                    </div>
                    <div className="space-y-3 ml-9">
                      <RoadmapItem 
                        status="planned"
                        title="Real-Time Preview"
                        description="Live preview of generated applications with hot reload"
                        version="v4.1"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Database Seeding Designer"
                        description="Visual interface for creating seed data for Prisma models"
                        version="v4.2"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="API Client Generator"
                        description="Generate TypeScript API clients from Flask backend definitions"
                        version="v4.2"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Form Builder"
                        description="Visual form designer with validation, field types, and submission handling"
                        version="v4.3"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Authentication Designer"
                        description="Configure authentication flows (JWT, OAuth, sessions) for both frontend and backend"
                        version="v5.0"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Docker Configuration"
                        description="Generate Docker and docker-compose files for containerized deployment"
                        version="v5.0"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="GraphQL API Designer"
                        description="Alternative to Flask REST - design GraphQL schemas and resolvers"
                        version="v5.1"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="State Management Designer"
                        description="Configure Redux, Zustand, or Jotai state management patterns"
                        version="v5.2"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="CI/CD Pipeline Generator"
                        description="Generate GitHub Actions, GitLab CI, or CircleCI configuration files"
                        version="v5.3"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Component Library Export"
                        description="Export designed components as a standalone npm package"
                        version="v6.0"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Design System Generator"
                        description="Create complete design systems with tokens, components, and documentation"
                        version="v6.0"
                      />
                      <RoadmapItem 
                        status="planned"
                        title="Collaboration Features"
                        description="Real-time collaborative editing and commenting system"
                        version="v6.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="m-0 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <FileCode size={36} weight="duotone" className="text-accent" />
                  Agents Files
                </h1>
                <p className="text-lg text-muted-foreground">
                  AI agent configuration and service architecture
                </p>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">AI Service Architecture</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    CodeForge uses a modular AI service architecture that integrates OpenAI's GPT models across all features. 
                    Each designer has specialized prompts and validation logic to ensure high-quality generated code.
                  </p>

                  <Card>
                    <CardHeader>
                      <CardTitle>Core AI Services</CardTitle>
                      <CardDescription>Primary modules handling AI operations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AgentFileItem 
                        filename="ai-service.ts"
                        path="/src/lib/ai-service.ts"
                        description="Central AI service orchestrating OpenAI API calls"
                        features={[
                          'Complete application generation from descriptions',
                          'Model generation with Prisma schema validation',
                          'Component generation with Material UI integration',
                          'Theme generation with color theory and accessibility',
                          'Code explanation and documentation',
                          'Code improvement and optimization',
                          'Test generation for Playwright, Storybook, and unit tests'
                        ]}
                      />
                      <AgentFileItem 
                        filename="error-repair-service.ts"
                        path="/src/lib/error-repair-service.ts"
                        description="Error detection and automated repair system"
                        features={[
                          'Syntax error detection and repair',
                          'Import statement validation and fixes',
                          'TypeScript type error resolution',
                          'ESLint violation detection and fixes',
                          'Context-aware repair using related files',
                          'Batch repair operations',
                          'Repair explanation generation'
                        ]}
                      />
                      <AgentFileItem 
                        filename="generators.ts"
                        path="/src/lib/generators.ts"
                        description="Code generation utilities for project export"
                        features={[
                          'Next.js project structure generation',
                          'Prisma schema file generation',
                          'Material UI theme configuration',
                          'Playwright test file generation',
                          'Storybook story file generation',
                          'Unit test file generation',
                          'Flask application structure',
                          'Package.json configuration'
                        ]}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Integration Points</CardTitle>
                      <CardDescription>Features enhanced by AI capabilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <IntegrationPoint 
                          component="ModelDesigner"
                          capabilities={[
                            'Generate models from natural language',
                            'Suggest appropriate field types',
                            'Create relations between models',
                            'Generate realistic field names and structures'
                          ]}
                        />
                        <IntegrationPoint 
                          component="ComponentTreeBuilder"
                          capabilities={[
                            'Generate component hierarchies',
                            'Suggest Material UI components',
                            'Create prop configurations',
                            'Build complex layouts from descriptions'
                          ]}
                        />
                        <IntegrationPoint 
                          component="StyleDesigner"
                          capabilities={[
                            'Generate color palettes from descriptions',
                            'Ensure WCAG accessibility compliance',
                            'Create harmonious color relationships',
                            'Suggest typography pairings'
                          ]}
                        />
                        <IntegrationPoint 
                          component="CodeEditor"
                          capabilities={[
                            'Explain code functionality',
                            'Improve code quality and performance',
                            'Suggest best practices',
                            'Generate inline documentation'
                          ]}
                        />
                        <IntegrationPoint 
                          component="PlaywrightDesigner"
                          capabilities={[
                            'Generate E2E test scenarios',
                            'Create test steps from user flows',
                            'Suggest appropriate selectors',
                            'Generate assertions for validations'
                          ]}
                        />
                        <IntegrationPoint 
                          component="StorybookDesigner"
                          capabilities={[
                            'Generate component stories',
                            'Create meaningful story variations',
                            'Configure args based on prop types',
                            'Organize stories by categories'
                          ]}
                        />
                        <IntegrationPoint 
                          component="UnitTestDesigner"
                          capabilities={[
                            'Generate comprehensive test suites',
                            'Create test cases with assertions',
                            'Generate setup and teardown code',
                            'Cover edge cases and error scenarios'
                          ]}
                        />
                        <IntegrationPoint 
                          component="ErrorPanel"
                          capabilities={[
                            'Analyze error patterns',
                            'Generate context-aware fixes',
                            'Explain error causes',
                            'Prevent similar errors in future'
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prompt Engineering</CardTitle>
                      <CardDescription>How we optimize AI interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Context Preservation</h3>
                        <p className="text-sm text-muted-foreground">
                          All AI prompts include relevant project context such as existing models, components, 
                          and theme configurations to ensure generated code integrates seamlessly.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Format Specification</h3>
                        <p className="text-sm text-muted-foreground">
                          Prompts specify exact output formats (JSON, TypeScript, Python) with strict schemas 
                          to ensure parseable and valid responses.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Best Practices Enforcement</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated code follows Next.js, React, and Flask best practices through detailed 
                          prompt instructions and post-processing validation.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Error Handling</h3>
                        <p className="text-sm text-muted-foreground">
                          Fallback mechanisms and retry logic ensure graceful degradation when AI services 
                          are unavailable or responses are malformed.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package size={20} weight="duotone" />
                        Future AI Enhancements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Target size={16} className="text-accent mt-1 flex-shrink-0" />
                          <span><strong>Multi-Model Support:</strong> Integration with Claude, Gemini, and other LLMs for specialized tasks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target size={16} className="text-accent mt-1 flex-shrink-0" />
                          <span><strong>Fine-Tuned Models:</strong> Custom models trained on specific frameworks and design patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target size={16} className="text-accent mt-1 flex-shrink-0" />
                          <span><strong>Code Review Agent:</strong> Automated code review with security and performance analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target size={16} className="text-accent mt-1 flex-shrink-0" />
                          <span><strong>Conversational Interface:</strong> Chat-based project building with natural language commands</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target size={16} className="text-accent mt-1 flex-shrink-0" />
                          <span><strong>Learning System:</strong> AI that learns from user corrections and preferences over time</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-accent mt-0.5">{icon}</div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function AIFeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-4 pb-4">
        <div className="flex gap-3">
          <Sparkle size={20} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RoadmapItem({ status, title, description, version }: { 
  status: 'completed' | 'planned'
  title: string
  description: string
  version: string 
}) {
  return (
    <Card className={status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50'}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                {version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AgentFileItem({ filename, path, description, features }: {
  filename: string
  path: string
  description: string
  features: string[]
}) {
  return (
    <div className="space-y-3 border-l-2 border-accent pl-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-accent" />
          <code className="text-sm font-semibold text-accent">{filename}</code>
        </div>
        <p className="text-xs text-muted-foreground font-mono">{path}</p>
        <p className="text-sm text-foreground/90">{description}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features:</p>
        <ul className="space-y-1">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
              <CheckCircle size={14} weight="fill" className="text-accent mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function IntegrationPoint({ component, capabilities }: { component: string; capabilities: string[] }) {
  return (
    <div className="space-y-2 border rounded-lg p-4 bg-card">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Sparkle size={16} weight="duotone" className="text-accent" />
        {component}
      </h4>
      <ul className="space-y-1">
        {capabilities.map((capability, idx) => (
          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>{capability}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
