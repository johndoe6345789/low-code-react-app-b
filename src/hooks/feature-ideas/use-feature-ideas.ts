import { useCallback } from 'react'
import { useKV } from '@/hooks/use-kv'

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

const SEED_IDEAS: FeatureIdea[] = [
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
]

export function useFeatureIdeas() {
  const [ideas, setIdeas] = useKV<FeatureIdea[]>('feature-ideas', SEED_IDEAS)

  const addIdea = useCallback((idea: FeatureIdea) => {
    setIdeas((current) => [...(current || []), idea])
  }, [setIdeas])

  const updateIdea = useCallback((id: string, updates: Partial<FeatureIdea>) => {
    setIdeas((current) => 
      (current || []).map(idea => 
        idea.id === id ? { ...idea, ...updates } : idea
      )
    )
  }, [setIdeas])

  const deleteIdea = useCallback((id: string) => {
    setIdeas((current) => (current || []).filter(idea => idea.id !== id))
  }, [setIdeas])

  const saveIdea = useCallback((idea: FeatureIdea) => {
    setIdeas((current) => {
      const existing = (current || []).find(i => i.id === idea.id)
      if (existing) {
        return (current || []).map(i => i.id === idea.id ? idea : i)
      } else {
        return [...(current || []), idea]
      }
    })
  }, [setIdeas])

  return {
    ideas: ideas || SEED_IDEAS,
    addIdea,
    updateIdea,
    deleteIdea,
    saveIdea,
    setIdeas,
  }
}
