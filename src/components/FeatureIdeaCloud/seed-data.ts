import { Edge, MarkerType } from 'reactflow'
import seedData from '@/data/feature-idea-cloud.json'
import { FeatureIdea, IdeaEdgeData } from './types'
import { CONNECTION_STYLE } from './constants'

type SeedIdea = Omit<FeatureIdea, 'createdAt'> & { createdAtOffset: number }

type SeedEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label: string
}

export const buildSeedIdeas = (): FeatureIdea[] => {
  const now = Date.now()
  return (seedData.ideas as SeedIdea[]).map((idea) => ({
    ...idea,
    createdAt: now + idea.createdAtOffset,
  }))
}

export const buildSeedEdges = (): Edge<IdeaEdgeData>[] =>
  (seedData.edges as SeedEdge[]).map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    type: 'default',
    animated: false,
    data: { label: edge.label },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: CONNECTION_STYLE.stroke,
      width: 20,
      height: 20,
    },
    style: {
      stroke: CONNECTION_STYLE.stroke,
      strokeWidth: CONNECTION_STYLE.strokeWidth,
    },
  }))
