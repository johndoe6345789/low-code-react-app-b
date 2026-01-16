import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

import { ProjectDashboard } from '@/components/ProjectDashboard'
import { CodeEditor } from '@/components/CodeEditor'
import { ModelDesigner } from '@/components/ModelDesigner'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { StyleDesigner } from '@/components/StyleDesigner'
import { FeatureIdeaCloud } from '@/components/FeatureIdeaCloud'

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
  ModelDesigner,
  ComponentTreeBuilder,
  StyleDesigner,
  FeatureIdeaCloud,
}

export function getComponent(name: string): ComponentType<any> | null {
  return ComponentRegistry[name] || null
}
