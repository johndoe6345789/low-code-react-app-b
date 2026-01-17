import { JSONUIShowcase } from '@/components/organisms/JSONUIShowcase'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <div className="h-screen bg-background text-foreground">
      <JSONUIShowcase />
      <Toaster />
    </div>
  )
}
