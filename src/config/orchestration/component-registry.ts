import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

import { ProjectDashboard } from '@/components/ProjectDashboard'
import { CodeEditor } from '@/components/CodeEditor'
import { JSONModelDesigner } from '@/components/JSONModelDesigner'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { JSONComponentTreeManager } from '@/components/JSONComponentTreeManager'
import { JSONWorkflowDesigner } from '@/components/JSONWorkflowDesigner'
import { JSONLambdaDesigner } from '@/components/JSONLambdaDesigner'
import { JSONStyleDesigner } from '@/components/JSONStyleDesigner'
import { FileExplorer } from '@/components/FileExplorer'
import { PlaywrightDesigner } from '@/components/PlaywrightDesigner'
import { StorybookDesigner } from '@/components/StorybookDesigner'
import { UnitTestDesigner } from '@/components/UnitTestDesigner'
import { JSONFlaskDesigner } from '@/components/JSONFlaskDesigner'
import { ProjectSettingsDesigner } from '@/components/ProjectSettingsDesigner'
import { ErrorPanel } from '@/components/ErrorPanel'
import { DocumentationView } from '@/components/DocumentationView'
import { SassStylesShowcase } from '@/components/SassStylesShowcase'
import { FeatureToggleSettings } from '@/components/FeatureToggleSettings'
import { PWASettings } from '@/components/PWASettings'
import { FaviconDesigner } from '@/components/FaviconDesigner'
import { FeatureIdeaCloud } from '@/components/FeatureIdeaCloud'
import { JSONUIShowcase } from '@/components/JSONUIShowcase'

export const ComponentRegistry: Record<string, ComponentType<any>> = {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Textarea,
  
  ProjectDashboard,
  CodeEditor,
  JSONModelDesigner,
  ComponentTreeBuilder,
  JSONComponentTreeManager,
  JSONWorkflowDesigner,
  JSONLambdaDesigner,
  JSONStyleDesigner,
  FileExplorer,
  PlaywrightDesigner,
  StorybookDesigner,
  UnitTestDesigner,
  JSONFlaskDesigner,
  ProjectSettingsDesigner,
  ErrorPanel,
  DocumentationView,
  SassStylesShowcase,
  FeatureToggleSettings,
  PWASettings,
  FaviconDesigner,
  FeatureIdeaCloud,
  JSONUIShowcase,
}

export function getComponent(name: string): ComponentType<any> | null {
  return ComponentRegistry[name] || null
}
