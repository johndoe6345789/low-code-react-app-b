export const CONNECTION_STYLE = { 
  stroke: '#a78bfa', 
  strokeWidth: 2.5
}

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

export const GROUP_COLORS = {
  default: 'border-purple-400/60 bg-purple-50/80 dark:bg-purple-950/40',
  feature: 'border-green-400/60 bg-green-50/80 dark:bg-green-950/40',
  bug: 'border-red-400/60 bg-red-50/80 dark:bg-red-950/40',
  improvement: 'border-blue-400/60 bg-blue-50/80 dark:bg-blue-950/40',
}

export const CATEGORIES = ['feature', 'bug', 'improvement', 'other'] as const
export const PRIORITIES = ['low', 'medium', 'high'] as const
export const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const
