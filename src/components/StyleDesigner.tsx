import { ThemeConfig } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { PaintBrush, Sparkle } from '@phosphor-icons/react'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'

interface StyleDesignerProps {
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig) => void
}

export function StyleDesigner({ theme, onThemeChange }: StyleDesignerProps) {
  const updateTheme = (updates: Partial<ThemeConfig>) => {
    onThemeChange({ ...theme, ...updates })
  }

  const generateThemeWithAI = async () => {
    const description = prompt('Describe the visual style you want (e.g., "modern and professional", "vibrant and playful"):')
    if (!description) return

    try {
      toast.info('Generating theme with AI...')
      const generatedTheme = await AIService.generateThemeFromDescription(description)
      
      if (generatedTheme) {
        onThemeChange({ ...theme, ...generatedTheme })
        toast.success('Theme generated successfully!')
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to generate theme')
      console.error(error)
    }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Material UI Theme Designer</h2>
            <p className="text-muted-foreground">
              Customize your application's visual theme
            </p>
          </div>
          <Button onClick={generateThemeWithAI} variant="outline">
            <Sparkle size={16} className="mr-2" weight="duotone" />
            Generate with AI
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PaintBrush size={20} weight="duotone" />
            Color Palette
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateTheme({ secondaryColor: e.target.value })
                  }
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateTheme({ secondaryColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Error Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.errorColor}
                  onChange={(e) => updateTheme({ errorColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={theme.errorColor}
                  onChange={(e) => updateTheme({ errorColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Warning Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.warningColor}
                  onChange={(e) => updateTheme({ warningColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={theme.warningColor}
                  onChange={(e) => updateTheme({ warningColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Success Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.successColor}
                  onChange={(e) => updateTheme({ successColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={theme.successColor}
                  onChange={(e) => updateTheme({ successColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Typography</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Input
                value={theme.fontFamily}
                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                placeholder="Roboto, Arial, sans-serif"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Small Font Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {theme.fontSize.small}px
                  </span>
                </div>
                <Slider
                  value={[theme.fontSize.small]}
                  onValueChange={([value]) =>
                    updateTheme({
                      fontSize: { ...theme.fontSize, small: value },
                    })
                  }
                  min={10}
                  max={20}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Medium Font Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {theme.fontSize.medium}px
                  </span>
                </div>
                <Slider
                  value={[theme.fontSize.medium]}
                  onValueChange={([value]) =>
                    updateTheme({
                      fontSize: { ...theme.fontSize, medium: value },
                    })
                  }
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Large Font Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {theme.fontSize.large}px
                  </span>
                </div>
                <Slider
                  value={[theme.fontSize.large]}
                  onValueChange={([value]) =>
                    updateTheme({
                      fontSize: { ...theme.fontSize, large: value },
                    })
                  }
                  min={16}
                  max={48}
                  step={1}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spacing & Shape</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Base Spacing Unit</Label>
                <span className="text-sm text-muted-foreground">
                  {theme.spacing}px
                </span>
              </div>
              <Slider
                value={[theme.spacing]}
                onValueChange={([value]) => updateTheme({ spacing: value })}
                min={4}
                max={16}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Material UI multiplies this value (e.g., spacing(2) = {theme.spacing * 2}px)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Border Radius</Label>
                <span className="text-sm text-muted-foreground">
                  {theme.borderRadius}px
                </span>
              </div>
              <Slider
                value={[theme.borderRadius]}
                onValueChange={([value]) =>
                  updateTheme({ borderRadius: value })
                }
                min={0}
                max={24}
                step={1}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-muted">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <div
                className="w-20 h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Primary
              </div>
              <div
                className="w-20 h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: theme.secondaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Secondary
              </div>
              <div
                className="w-20 h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: theme.errorColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Error
              </div>
              <div
                className="w-20 h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: theme.warningColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Warning
              </div>
              <div
                className="w-20 h-20 rounded flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: theme.successColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Success
              </div>
            </div>
            <div
              className="p-4 border"
              style={{
                fontFamily: theme.fontFamily,
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <p style={{ fontSize: `${theme.fontSize.large}px` }}>
                Large Text Sample
              </p>
              <p style={{ fontSize: `${theme.fontSize.medium}px` }}>
                Medium Text Sample
              </p>
              <p style={{ fontSize: `${theme.fontSize.small}px` }}>
                Small Text Sample
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
