import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { useCRUD, useSearch } from '@/hooks/data'
import { useDialog } from '@/hooks/ui'
import { SearchBar } from '@/components/molecules/SearchBar'
import { DataList, ActionButton, IconButton } from '@/components/atoms'
import { Plus, Trash, Check, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export function ComprehensiveDemoPage() {
  const { items: todos, create, update, remove } = useCRUD<Todo>({
    key: 'json-demo-todos',
    defaultValue: [],
    persist: true,
  })

  const { query, setQuery, filtered } = useSearch({
    items: todos,
    searchFields: ['text' as keyof Todo],
  })

  const newTodoDialog = useDialog()
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    completionRate: todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0,
  }

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      create({
        id: Date.now(),
        text: newTodoText,
        completed: false,
        priority: newTodoPriority,
        createdAt: new Date().toISOString(),
      })
      setNewTodoText('')
      setNewTodoPriority('medium')
      newTodoDialog.close()
      toast.success('Task added successfully!')
    }
  }

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      update(id, { completed: !todo.completed })
      toast.success(todo.completed ? 'Task marked as pending' : 'Task completed!')
    }
  }

  const handleDeleteTodo = (id: number) => {
    remove(id)
    toast.success('Task deleted')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  return (
    <div className="h-full overflow-auto p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Advanced Task Manager
          </h1>
          <p className="text-muted-foreground">
            Demonstrating atomic components, custom hooks, and reactive state management
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5 backdrop-blur border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Check className="text-green-600" size={24} weight="duotone" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 backdrop-blur border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <Clock className="text-blue-600" size={24} weight="duotone" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 backdrop-blur border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-3xl font-bold text-primary">{Math.round(stats.completionRate)}%</p>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>Manage your tasks with advanced features</CardDescription>
              </div>
              <ActionButton
                icon={<Plus size={16} weight="bold" />}
                label="Add Task"
                onClick={newTodoDialog.open}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search tasks..."
            />

            <Separator />

            {/* Task List */}
            <DataList
              items={filtered}
              emptyMessage={query ? 'No tasks match your search' : 'No tasks yet. Click "Add Task" to get started!'}
              renderItem={(todo) => (
                <Card className="bg-card/50 backdrop-blur hover:bg-card transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium',
                          todo.completed && 'line-through text-muted-foreground'
                        )}>
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                            {todo.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <IconButton
                        icon={<Trash size={16} />}
                        onClick={() => handleDeleteTodo(todo.id)}
                        variant="ghost"
                        title="Delete task"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </CardContent>
        </Card>

        {/* Architecture Info */}
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle>Architecture Highlights</CardTitle>
            <CardDescription>What makes this demo special</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="text-accent mt-1" size={16} weight="bold" />
              <div>
                <p className="font-medium">Custom Hooks</p>
                <p className="text-sm text-muted-foreground">
                  useCRUD for data management, useSearch for filtering, useDialog for modals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-accent mt-1" size={16} weight="bold" />
              <div>
                <p className="font-medium">Atomic Components</p>
                <p className="text-sm text-muted-foreground">
                  ActionButton, IconButton, DataList, SearchBar - all under 150 LOC
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-accent mt-1" size={16} weight="bold" />
              <div>
                <p className="font-medium">KV Persistence</p>
                <p className="text-sm text-muted-foreground">
                  All data persists between sessions using the Spark KV store
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-accent mt-1" size={16} weight="bold" />
              <div>
                <p className="font-medium">Reactive State</p>
                <p className="text-sm text-muted-foreground">
                  Computed stats update automatically when todos change
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Todo Dialog */}
      {newTodoDialog.isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new task with priority</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Description</label>
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="What needs to be done?"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Button
                      key={priority}
                      variant={newTodoPriority === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewTodoPriority(priority)}
                      className="flex-1"
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddTodo} className="flex-1" disabled={!newTodoText.trim()}>
                  Add Task
                </Button>
                <Button onClick={newTodoDialog.close} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Missing import
import { useState } from 'react'
