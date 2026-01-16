import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Cloud, Sparkle, ArrowsClockwise, Eye } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface FeatureIdea {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planned' | 'in-progress' | 'completed'
  createdAt: number
  x: number
  y: number
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
    x: 10,
    y: 15,
  },
  {
    id: 'idea-2',
    title: 'Real-time Collaboration',
    description: 'Allow multiple developers to work on the same project simultaneously',
    category: 'Collaboration',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 9000000,
    x: 60,
    y: 25,
  },
  {
    id: 'idea-3',
    title: 'Component Marketplace',
    description: 'A marketplace where users can share and download pre-built components',
    category: 'Community',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 8000000,
    x: 25,
    y: 55,
  },
  {
    id: 'idea-4',
    title: 'Visual Git Integration',
    description: 'Git operations through a visual interface with branch visualization',
    category: 'DevOps',
    priority: 'high',
    status: 'planned',
    createdAt: Date.now() - 7000000,
    x: 70,
    y: 60,
  },
  {
    id: 'idea-5',
    title: 'API Mock Server',
    description: 'Built-in mock server for testing API integrations',
    category: 'Testing',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 6000000,
    x: 15,
    y: 80,
  },
  {
    id: 'idea-6',
    title: 'Performance Profiler',
    description: 'Analyze and optimize application performance with visual metrics',
    category: 'Performance',
    priority: 'medium',
    status: 'idea',
    createdAt: Date.now() - 5000000,
    x: 80,
    y: 35,
  },
  {
    id: 'idea-7',
    title: 'Theme Presets',
    description: 'Pre-designed theme templates for quick project setup',
    category: 'Design',
    priority: 'low',
    status: 'completed',
    createdAt: Date.now() - 4000000,
    x: 45,
    y: 10,
  },
  {
    id: 'idea-8',
    title: 'Database Schema Migrations',
    description: 'Visual tool for creating and managing database migrations',
    category: 'Database',
    priority: 'high',
    status: 'in-progress',
    createdAt: Date.now() - 3000000,
    x: 30,
    y: 40,
  },
  {
    id: 'idea-9',
    title: 'Mobile App Preview',
    description: 'Live preview on actual mobile devices or simulators',
    category: 'Mobile',
    priority: 'medium',
    status: 'planned',
    createdAt: Date.now() - 2000000,
    x: 55,
    y: 75,
  },
  {
    id: 'idea-10',
    title: 'Accessibility Checker',
    description: 'Automated accessibility testing and suggestions',
    category: 'Accessibility',
    priority: 'high',
    status: 'idea',
    createdAt: Date.now() - 1000000,
    x: 85,
    y: 50,
  },
  {
    id: 'idea-11',
    title: 'Code Templates',
    description: 'Reusable code snippets and patterns library',
    category: 'Productivity',
    priority: 'medium',
    status: 'completed',
    createdAt: Date.now() - 900000,
    x: 40,
    y: 85,
  },
  {
    id: 'idea-12',
    title: 'Webhook Testing',
    description: 'Test and debug webhooks locally with request inspection',
    category: 'DevOps',
    priority: 'low',
    status: 'idea',
    createdAt: Date.now() - 800000,
    x: 65,
    y: 45,
  },
]

const CATEGORIES = ['AI/ML', 'Collaboration', 'Community', 'DevOps', 'Testing', 'Performance', 'Design', 'Database', 'Mobile', 'Accessibility', 'Productivity', 'Security', 'Analytics', 'Other']
const PRIORITIES = ['low', 'medium', 'high'] as const
const STATUSES = ['idea', 'planned', 'in-progress', 'completed'] as const

const STATUS_COLORS = {
  idea: 'bg-muted text-muted-foreground',
  planned: 'bg-accent text-accent-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
  completed: 'bg-green-600 text-white',
}

const PRIORITY_COLORS = {
  low: 'border-blue-400 bg-blue-50 dark:bg-blue-950',
  medium: 'border-amber-400 bg-amber-50 dark:bg-amber-950',
  high: 'border-red-400 bg-red-50 dark:bg-red-950',
}

export function FeatureIdeaCloud() {
  const [ideas, setIdeas] = useKV<FeatureIdea[]>('feature-ideas', SEED_IDEAS)
  const [selectedIdea, setSelectedIdea] = useState<FeatureIdea | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  const safeIdeas = ideas || SEED_IDEAS

  useEffect(() => {
    if (!ideas || ideas.length === 0) {
      setIdeas(SEED_IDEAS)
    }
  }, [ideas, setIdeas])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleAddIdea = () => {
    const newIdea: FeatureIdea = {
      id: `idea-${Date.now()}`,
      title: '',
      description: '',
      category: 'Other',
      priority: 'medium',
      status: 'idea',
      createdAt: Date.now(),
      x: Math.random() * 80,
      y: Math.random() * 80,
    }
    setSelectedIdea(newIdea)
    setEditDialogOpen(true)
  }

  const handleEditIdea = (idea: FeatureIdea) => {
    setSelectedIdea(idea)
    setEditDialogOpen(true)
  }

  const handleViewIdea = (idea: FeatureIdea) => {
    setSelectedIdea(idea)
    setViewDialogOpen(true)
  }

  const handleSaveIdea = () => {
    if (!selectedIdea || !selectedIdea.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIdeas((currentIdeas) => {
      const existing = (currentIdeas || []).find(i => i.id === selectedIdea.id)
      if (existing) {
        return (currentIdeas || []).map(i => i.id === selectedIdea.id ? selectedIdea : i)
      } else {
        return [...(currentIdeas || []), selectedIdea]
      }
    })

    setEditDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea saved!')
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas((currentIdeas) => (currentIdeas || []).filter(i => i.id !== id))
    setEditDialogOpen(false)
    setViewDialogOpen(false)
    setSelectedIdea(null)
    toast.success('Idea deleted')
  }

  const handleGenerateIdeas = async () => {
    toast.info('Generating ideas with AI...')
    
    try {
      const promptText = `Generate 3 innovative feature ideas for a low-code application builder. Each idea should be practical and valuable. Return as JSON with this structure:
{
  "ideas": [
    {
      "title": "Feature Name",
      "description": "Brief description",
      "category": "${CATEGORIES.join('|')}",
      "priority": "low|medium|high"
    }
  ]
}`
      
      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const result = JSON.parse(response)
      
      if (result.ideas && Array.isArray(result.ideas)) {
        const newIdeas: FeatureIdea[] = result.ideas.map((idea: any, index: number) => ({
          id: `idea-ai-${Date.now()}-${index}`,
          title: idea.title,
          description: idea.description,
          category: idea.category || 'Other',
          priority: idea.priority || 'medium',
          status: 'idea' as const,
          createdAt: Date.now(),
          x: 20 + (index * 20),
          y: 20 + (index * 15),
        }))
        
        setIdeas((currentIdeas) => [...(currentIdeas || []), ...newIdeas])
        toast.success(`Generated ${newIdeas.length} new ideas!`)
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error)
      toast.error('Failed to generate ideas')
    }
  }

  const handleRandomizePositions = () => {
    setIdeas((currentIdeas) => 
      (currentIdeas || []).map(idea => ({
        ...idea,
        x: Math.random() * 80,
        y: Math.random() * 80,
      }))
    )
    toast.success('Positions randomized!')
  }

  const filteredIdeas = safeIdeas.filter(idea => {
    if (filterCategory !== 'all' && idea.category !== filterCategory) return false
    if (filterStatus !== 'all' && idea.status !== filterStatus) return false
    if (filterPriority !== 'all' && idea.priority !== filterPriority) return false
    return true
  })

  const categoryStats = safeIdeas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusStats = safeIdeas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-card">
      <div className="p-4 sm:p-6 border-b border-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Cloud size={32} weight="duotone" className="text-primary" />
              Feature Idea Cloud
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Brainstorm and visualize your app features
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRandomizePositions} variant="outline" size="sm">
              <ArrowsClockwise size={16} className="mr-2" />
              Shuffle
            </Button>
            <Button onClick={handleGenerateIdeas} variant="outline" size="sm">
              <Sparkle size={16} weight="duotone" className="mr-2" />
              AI Generate
            </Button>
            <Button onClick={handleAddIdea}>
              <Plus size={16} className="mr-2" />
              Add Idea
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Categories ({safeIdeas.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({categoryStats[cat] || 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="idea">Idea ({statusStats.idea || 0})</option>
              <option value="planned">Planned ({statusStats.planned || 0})</option>
              <option value="in-progress">In Progress ({statusStats['in-progress'] || 0})</option>
              <option value="completed">Completed ({statusStats.completed || 0})</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterCategory('all')
                setFilterStatus('all')
                setFilterPriority('all')
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        <AnimatePresence>
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: `${idea.x}%`,
                y: `${idea.y}%`,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="absolute cursor-pointer"
              style={{
                left: 0,
                top: 0,
              }}
              onClick={() => handleViewIdea(idea)}
            >
              <Card className={`p-3 sm:p-4 shadow-lg hover:shadow-xl transition-shadow border-2 ${PRIORITY_COLORS[idea.priority]} max-w-[200px] sm:max-w-[240px]`}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{idea.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {idea.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {idea.category}
                    </Badge>
                    <Badge className={`text-xs ${STATUS_COLORS[idea.status]}`}>
                      {idea.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredIdeas.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Cloud size={64} className="mx-auto text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No ideas match your filters</p>
              <Button onClick={handleAddIdea} variant="outline">
                <Plus size={16} className="mr-2" />
                Add Your First Idea
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedIdea?.title ? 'Edit Idea' : 'New Idea'}
            </DialogTitle>
            <DialogDescription>
              Create or modify a feature idea for your app
            </DialogDescription>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={selectedIdea.title}
                  onChange={(e) => setSelectedIdea({ ...selectedIdea, title: e.target.value })}
                  placeholder="Feature name..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={selectedIdea.description}
                  onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
                  placeholder="Describe the feature..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select
                    value={selectedIdea.category}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, category: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <select
                    value={selectedIdea.priority}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, priority: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select
                    value={selectedIdea.status}
                    onChange={(e) => setSelectedIdea({ ...selectedIdea, status: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {selectedIdea && ideas?.find(i => i.id === selectedIdea.id) && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteIdea(selectedIdea.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveIdea}>
                  Save Idea
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedIdea?.title}</DialogTitle>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedIdea.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <p className="text-sm font-medium">{selectedIdea.category}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <p className="text-sm font-medium capitalize">{selectedIdea.priority}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Badge className={`${STATUS_COLORS[selectedIdea.status]} mt-1`}>
                  {selectedIdea.status}
                </Badge>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false)
              handleEditIdea(selectedIdea!)
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
