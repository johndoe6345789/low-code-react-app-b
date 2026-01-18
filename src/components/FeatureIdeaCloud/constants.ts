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

// Missing exports for GROUP_COLORS, CATEGORIES, PRIORITIES, STATUSES
export const GROUP_COLORS = {
  default: '#a78bfa',
  primary: '#60a5fa',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
}

export const CATEGORIES = ['feature', 'enhancement', 'bug', 'documentation', 'other'] as const
export const PRIORITIES = ['low', 'medium', 'high'] as const
export const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const
