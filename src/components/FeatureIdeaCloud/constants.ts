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
