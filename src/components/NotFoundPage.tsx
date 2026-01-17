import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  House, 
  ArrowLeft, 
  MagnifyingGlass, 
  Compass,
  Code,
  Cube,
  Lightning,
  ChartBar
} from '@phosphor-icons/react'

export function NotFoundPage() {
  const navigate = useNavigate()

  const quickLinks = [
    { label: 'Dashboard', icon: ChartBar, path: '/dashboard', description: 'Project overview and stats' },
    { label: 'Code Editor', icon: Code, path: '/code', description: 'Edit your source files' },
    { label: 'Components', icon: Lightning, path: '/components', description: 'UI component library' },
    { label: 'Models', icon: Cube, path: '/models', description: 'Data models and schemas' },
  ]

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm mb-4">
            <Compass className="text-primary" size={64} weight="duotone" />
          </div>
          
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="gap-2"
          >
            <House />
            Home
          </Button>
          
          <Button
            onClick={() => {
              const searchBtn = document.querySelector('[data-search-trigger]') as HTMLElement
              searchBtn?.click()
            }}
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            <MagnifyingGlass />
            Search
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground text-center">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Card
                  key={link.path}
                  className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(link.path)}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={24} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{link.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Check the keyboard shortcuts with{' '}
            <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">Ctrl</kbd>
            {' + '}
            <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">/</kbd>
          </p>
        </div>
      </div>
    </div>
  )
}
