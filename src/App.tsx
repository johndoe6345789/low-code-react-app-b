import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { List, Stack, House, Wrench } from '@phosphor-icons/react'
import { DockerBuildDebugger } from '@/components/DockerBuildDebugger'
import { motion } from 'framer-motion'

type View = 'home' | 'docker-debugger'

function App() {
  const [currentView, setCurrentView] = useKV<View>('current-view', 'home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavigation = (view: View) => {
    setCurrentView(view)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative">
          <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Stack size={28} weight="bold" className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">DevTools Hub</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Your developer toolkit</p>
                  </div>
                </div>

                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="gap-2">
                      <List size={20} weight="bold" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <nav className="mt-6 space-y-2">
                      <Button
                        variant={currentView === 'home' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-3"
                        onClick={() => handleNavigation('home')}
                      >
                        <House size={20} weight="bold" />
                        Home
                      </Button>
                      <Button
                        variant={currentView === 'docker-debugger' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-3"
                        onClick={() => handleNavigation('docker-debugger')}
                      >
                        <Wrench size={20} weight="bold" />
                        Docker Build Debugger
                      </Button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 sm:px-6 py-8">
            {currentView === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to DevTools Hub</h2>
                  <p className="text-muted-foreground">
                    Select a tool from the menu to get started
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card 
                    className="border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all"
                    onClick={() => handleNavigation('docker-debugger')}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                          <Wrench size={24} weight="bold" className="text-accent" />
                        </div>
                        <CardTitle>Docker Build Debugger</CardTitle>
                      </div>
                      <CardDescription>
                        Analyze Docker build errors and get instant solutions with an intelligent knowledge base
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Paste your build logs and get detailed error analysis with recommended fixes
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {currentView === 'docker-debugger' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Docker Build Debugger</h2>
                  <p className="text-muted-foreground">
                    Analyze errors and get instant solutions
                  </p>
                </div>
                <DockerBuildDebugger />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
