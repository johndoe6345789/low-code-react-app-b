import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function AppMinimal() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>CodeForge - Minimal Test</CardTitle>
          <CardDescription>Testing if the basic app loads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">Count: {count}</p>
          <div className="flex gap-2">
            <Button onClick={() => setCount(c => c + 1)}>
              Increment
            </Button>
            <Button variant="outline" onClick={() => toast.success('Toast works!')}>
              Test Toast
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            If you can see this, the basic React app is loading correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AppMinimal
