export interface FeatureIdea {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planned' | 'in-progress' | 'completed'
  createdAt: number
  parentGroup?: string
}

export interface IdeaGroup {
  id: string
  label: string
  color: string
  createdAt: number
}

export interface IdeaEdgeData {
  label?: string
}
