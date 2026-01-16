import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, Palette, Sparkle, CheckCircle } from '@phosphor-icons/react'

export function SassStylesShowcase() {
  return (
    <div className="h-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom Material UI Sass Styles</h1>
        <p className="text-muted-foreground">
          Non-standard Material UI CSS components built with Sass
        </p>
      </div>

      <Tabs defaultValue="buttons" className="flex-1">
        <TabsList>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="chips">Chips</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Button Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 flex-wrap">
                  <button className="mui-custom-button mui-custom-button--primary">
                    Primary Button
                  </button>
                  <button className="mui-custom-button mui-custom-button--secondary">
                    Secondary Button
                  </button>
                  <button className="mui-custom-button mui-custom-button--accent">
                    Accent Button
                  </button>
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  <button className="mui-custom-button mui-custom-button--outline">
                    Outline Button
                  </button>
                  <button className="mui-custom-button mui-custom-button--ghost">
                    Ghost Button
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<button className="mui-custom-button mui-custom-button--primary">
  Primary Button
</button>

<button className="mui-custom-button mui-custom-button--accent">
  Accent Button
</button>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Input Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Default input" 
                  className="mui-custom-input w-full"
                />
                <input 
                  type="text" 
                  placeholder="Error state" 
                  className="mui-custom-input mui-custom-input--error w-full"
                />
                <input 
                  type="text" 
                  placeholder="Success state" 
                  className="mui-custom-input mui-custom-input--success w-full"
                />
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<input 
  className="mui-custom-input" 
  placeholder="Your input" 
/>

<input 
  className="mui-custom-input mui-custom-input--error" 
  placeholder="Error state" 
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Card Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mui-custom-card p-6">
                  <h3 className="font-bold mb-2">Standard Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic card with elevation and hover effect
                  </p>
                </div>
                
                <div className="mui-custom-card mui-custom-card--gradient p-6">
                  <h3 className="font-bold mb-2">Gradient Card</h3>
                  <p className="text-sm opacity-90">
                    Card with gradient background
                  </p>
                </div>
                
                <div className="mui-custom-card mui-custom-card--glass p-6">
                  <h3 className="font-bold mb-2">Glass Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Glassmorphism effect card
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<div className="mui-custom-card">
  Standard Card
</div>

<div className="mui-custom-card mui-custom-card--gradient">
  Gradient Card
</div>

<div className="mui-custom-card mui-custom-card--glass">
  Glass Card
</div>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Chip/Badge Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className="mui-custom-chip mui-custom-chip--primary">
                  Primary
                </span>
                <span className="mui-custom-chip mui-custom-chip--secondary">
                  Secondary
                </span>
                <span className="mui-custom-chip mui-custom-chip--accent">
                  Accent
                </span>
                <span className="mui-custom-chip mui-custom-chip--success">
                  <CheckCircle size={14} weight="fill" />
                  Success
                </span>
                <span className="mui-custom-chip mui-custom-chip--error">
                  Error
                </span>
                <span className="mui-custom-chip mui-custom-chip--warning">
                  Warning
                </span>
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<span className="mui-custom-chip mui-custom-chip--primary">
  Primary
</span>

<span className="mui-custom-chip mui-custom-chip--success">
  <CheckCircle size={14} />
  Success
</span>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className="custom-mui-tag">Default</span>
                <span className="custom-mui-tag custom-mui-tag--sm">Small</span>
                <span className="custom-mui-tag custom-mui-tag--lg">Large</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Layout Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Custom Stack</h3>
                <div className="custom-mui-stack custom-mui-stack--gap-3">
                  <div className="p-4 bg-card border rounded">Item 1</div>
                  <div className="p-4 bg-card border rounded">Item 2</div>
                  <div className="p-4 bg-card border rounded">Item 3</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Custom Grid (Responsive)</h3>
                <div className="custom-mui-grid custom-mui-grid--responsive">
                  <div className="p-4 bg-card border rounded">Grid 1</div>
                  <div className="p-4 bg-card border rounded">Grid 2</div>
                  <div className="p-4 bg-card border rounded">Grid 3</div>
                  <div className="p-4 bg-card border rounded">Grid 4</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Custom Surface</h3>
                <div className="custom-mui-surface custom-mui-surface--interactive">
                  <p>Interactive surface with hover effects</p>
                </div>
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<div className="custom-mui-stack custom-mui-stack--gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div className="custom-mui-grid custom-mui-grid--responsive">
  <div>Grid Item</div>
</div>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card border rounded animate-fade-in">
                  Fade In
                </div>
                <div className="p-4 bg-card border rounded animate-slide-in-up">
                  Slide Up
                </div>
                <div className="p-4 bg-card border rounded animate-scale-in">
                  Scale In
                </div>
                <div className="p-4 bg-card border rounded animate-pulse">
                  Pulse
                </div>
                <div className="p-4 bg-card border rounded animate-bounce">
                  Bounce
                </div>
                <div className="p-4 bg-card border rounded animate-float">
                  Float
                </div>
              </div>

              <div className="mt-4">
                <pre className="custom-mui-code-block">
{`<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-in-up">Slide Up</div>
<div className="animate-pulse">Pulse</div>
<div className="animate-bounce">Bounce</div>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="mui-custom-skeleton mui-custom-skeleton--text" />
                <div className="mui-custom-skeleton mui-custom-skeleton--text" />
                <div className="mui-custom-skeleton mui-custom-skeleton--rect" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
