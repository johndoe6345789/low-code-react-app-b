import { FeatureIdea } from './types'

export const SEED_IDEAS: FeatureIdea[] = [
  {
    id: 'idea-1',
    title: 'AI Code Assistant',
    description: 'Integrate an AI assistant that can suggest code improvements and answer questions',
    category: 'AI/ML',
    priority: 'high',
    status: 'completed',
    createdAt: Date.now() - 10000000,
  },
  {
    id: 'idea-2',
    title: 'Real-time Collaboration',
    description: 'Allow multiple developers to work on the same project simultaneously',
    category: 'Collaboration',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 9000000,
  },
  {
    id: 'idea-3',
    title: 'Component Marketplace',
    description: 'A marketplace where users can share and download pre-built components',
    category: 'Community',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 8000000,
  },
  {
    id: 'idea-4',
    title: 'Visual Git Integration',
    description: 'Git operations through a visual interface with branch visualization',
    category: 'DevOps',
    priority: 'high',
    status: 'planned',
    createdAt: Date.now() - 7000000,
  },
  {
    id: 'idea-5',
    title: 'API Mock Server',
    description: 'Built-in mock server for testing API integrations',
    category: 'Testing',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 6000000,
  },
  {
    id: 'idea-6',
    title: 'Performance Profiler',
    description: 'Analyze and optimize application performance with visual metrics',
    category: 'Performance',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 5000000,
  },
  {
    id: 'idea-7',
    title: 'Theme Presets',
    description: 'Pre-designed theme templates for quick project setup',
    category: 'Design',
    priority: 'low',
    status: 'completed',
    createdAt: Date.now() - 4000000,
  },
  {
    id: 'idea-8',
    title: 'Database Schema Migrations',
    description: 'Visual tool for creating and managing database migrations',
    category: 'Database',
    priority: 'high',
    status: 'in-progress',
    createdAt: Date.now() - 3000000,
  },
  {
    id: 'idea-9',
    title: 'Mobile App Preview',
    description: 'Live preview on actual mobile devices or simulators',
    category: 'Mobile',
    priority: 'medium',
    status: 'planned',
    createdAt: Date.now() - 2000000,
  },
  {
    id: 'idea-10',
    title: 'Accessibility Checker',
    description: 'Automated accessibility testing and suggestions',
    category: 'Accessibility',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 1000000,
  },
]

export const CONNECTION_STYLE = { 
  stroke: '#a78bfa', 
  strokeWidth: 2.5
}

export const CATEGORIES = [
  'AI/ML',
  'Collaboration',
  'Community',
  'DevOps',
  'Testing',
  'Performance',
  'Design',
  'Database',
  'Mobile',
  'Accessibility',
  'Productivity',
  'Security',
  'Analytics',
  'Other'
]

export const PRIORITIES = ['low', 'medium', 'high'] as const

export const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const

export const STATUS_COLORS = {
  idea: 'bg-muted text-muted-foreground',
  planned: 'bg-accent text-accent-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
  completed: 'bg-green-600 text-white',
}

export const PRIORITY_COLORS = {
  low: 'border-blue-400/60 bg-blue-50/80 dark:bg-blue-950/40',
  medium: 'border-amber-400/60 bg-amber-50/80 dark:bg-amber-950/40',
  high: 'border-red-400/60 bg-red-50/80 dark:bg-red-950/40',
}

export const GROUP_COLORS = [
  { name: 'Blue', value: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Purple', value: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)' },
  { name: 'Green', value: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Red', value: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.3)' },
  { name: 'Orange', value: '#f97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.3)' },
  { name: 'Pink', value: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.3)' },
  { name: 'Cyan', value: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.3)' },
  { name: 'Amber', value: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.3)' },
]
