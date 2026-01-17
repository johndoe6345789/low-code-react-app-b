import { useStorage } from '@/hooks/use-storage'
import { useIndexedDB, useIndexedDBCollection } from '@/hooks/use-indexed-db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Database } from '@phosphor-icons/react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function StorageExample() {
  const [newTodoText, setNewTodoText] = useState('')
  
  const [todos, setTodos] = useStorage<Todo[]>('example-todos', [])
  const [counter, setCounter] = useStorage<number>('example-counter', 0)

  const addTodo = () => {
    if (!newTodoText.trim()) return

    setTodos((current) => [
      ...current,
      {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false,
        createdAt: Date.now(),
      },
    ])
    setNewTodoText('')
  }

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  const incrementCounter = () => {
    setCounter((current) => current + 1)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database size={32} />
          Storage Example
        </h1>
        <p className="text-muted-foreground">
          Demonstrates IndexedDB + Spark KV hybrid storage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Counter (useStorage)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-4xl py-4 px-8">
                {counter}
              </Badge>
            </div>
            <Button onClick={incrementCounter} className="w-full" size="lg">
              Increment
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This counter persists across page refreshes using hybrid storage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Todo List (useStorage)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Enter todo..."
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              />
              <Button onClick={addTodo}>Add</Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No todos yet. Add one above!
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 p-2 rounded border"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Todos are stored in IndexedDB with Spark KV fallback
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Primary: IndexedDB</h3>
              <p className="text-sm text-muted-foreground">
                Data is first saved to IndexedDB for fast, structured storage with indexes
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2. Fallback: Spark KV</h3>
              <p className="text-sm text-muted-foreground">
                If IndexedDB fails or is unavailable, Spark KV is used automatically
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3. Sync Both</h3>
              <p className="text-sm text-muted-foreground">
                Data is kept in sync between both storage systems for redundancy
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Code Example:</h4>
            <pre className="text-xs overflow-x-auto">
              {`import { useStorage } from '@/hooks/use-storage'

// Replaces useKV from Spark
const [todos, setTodos] = useStorage('todos', [])

// Use functional updates for safety
setTodos((current) => [...current, newTodo])`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
