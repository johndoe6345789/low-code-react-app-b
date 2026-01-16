import { useState } from 'react'
import { ThemeConfig, ThemeVariant } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaintBrush, Sparkle, Plus, Trash, Moon, Sun, Palette } from '@phosphor-icons/react'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface StyleDesignerProps {
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig | ((current: ThemeConfig) => ThemeConfig)) => void
}

export function StyleDesigner({ theme, onThemeChange }: StyleDesignerProps) {
  const [newColorName, setNewColorName] = useState('')
  const [newColorValue, setNewColorValue] = useState('#000000')
  const [customColorDialogOpen, setCustomColorDialogOpen] = useState(false)
  const [newVariantDialogOpen, setNewVariantDialogOpen] = useState(false)
  const [newVariantName, setNewVariantName] = useState('')

  if (!theme.variants || theme.variants.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <PaintBrush size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
          <p className="text-muted-foreground">Theme configuration is invalid or missing</p>
        </div>
      </div>
    )
  }

  const activeVariant = theme.variants.find((v) => v.id === theme.activeVariantId) || theme.variants[0]

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    onThemeChange((current) => ({ ...current, ...updates }))
  }

  const updateActiveVariantColors = (colorUpdates: Partial<typeof activeVariant.colors>) => {
    onThemeChange((current) => ({
      ...current,
      variants: (current.variants || []).map((v) =>
        v.id === current.activeVariantId
          ? { ...v, colors: { ...v.colors, ...colorUpdates } }
          : v
      ),
    }))
  }

  const addCustomColor = () => {
    if (!newColorName.trim()) {
      toast.error('Please enter a color name')
      return
    }

    updateActiveVariantColors({
      customColors: {
        ...activeVariant.colors.customColors,
        [newColorName]: newColorValue,
      },
    })

    setNewColorName('')
    setNewColorValue('#000000')
    setCustomColorDialogOpen(false)
    toast.success(`Added custom color: ${newColorName}`)
  }

  const removeCustomColor = (colorName: string) => {
    const { [colorName]: _, ...remainingColors } = activeVariant.colors.customColors
    updateActiveVariantColors({
      customColors: remainingColors,
    })
    toast.success(`Removed custom color: ${colorName}`)
  }

  const addVariant = () => {
    if (!newVariantName.trim()) {
      toast.error('Please enter a variant name')
      return
    }

    const newVariant: ThemeVariant = {
      id: `variant-${Date.now()}`,
      name: newVariantName,
      colors: { ...activeVariant.colors, customColors: {} },
    }

    onThemeChange((current) => ({
      ...current,
      variants: [...(current.variants || []), newVariant],
      activeVariantId: newVariant.id,
    }))

    setNewVariantName('')
    setNewVariantDialogOpen(false)
    toast.success(`Added theme variant: ${newVariantName}`)
  }

  const deleteVariant = (variantId: string) => {
    if (!theme.variants || theme.variants.length <= 1) {
      toast.error('Cannot delete the last theme variant')
      return
    }

    onThemeChange((current) => {
      const remainingVariants = (current.variants || []).filter((v) => v.id !== variantId)
      return {
        ...current,
        variants: remainingVariants,
        activeVariantId: current.activeVariantId === variantId ? remainingVariants[0].id : current.activeVariantId,
      }
    })

    toast.success('Theme variant deleted')
  }

  const duplicateVariant = (variantId: string) => {
    const variantToDuplicate = (theme.variants || []).find((v) => v.id === variantId)
    if (!variantToDuplicate) return

    const newVariant: ThemeVariant = {
      id: `variant-${Date.now()}`,
      name: `${variantToDuplicate.name} Copy`,
      colors: { ...variantToDuplicate.colors, customColors: { ...variantToDuplicate.colors.customColors } },
    }

    onThemeChange((current) => ({
      ...current,
      variants: [...(current.variants || []), newVariant],
    }))

    toast.success('Theme variant duplicated')
  }

  const generateThemeWithAI = async () => {
    const description = prompt('Describe the visual style you want (e.g., "modern and professional", "vibrant and playful"):')
    if (!description) return

    try {
      toast.info('Generating theme with AI...')
      const generatedTheme = await AIService.generateThemeFromDescription(description)

      if (generatedTheme) {
        onThemeChange((current) => ({ ...current, ...generatedTheme }))
        toast.success('Theme generated successfully!')
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to generate theme')
      console.error(error)
    }
  }

  const renderColorInput = (label: string, colorKey: keyof typeof activeVariant.colors, excludeCustom = true) => {
    if (excludeCustom && colorKey === 'customColors') return null
    
    const value = activeVariant.colors[colorKey] as string

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={value}
            onChange={(e) => updateActiveVariantColors({ [colorKey]: e.target.value })}
            className="w-20 h-10 cursor-pointer"
          />
          <Input
            value={value}
            onChange={(e) => updateActiveVariantColors({ [colorKey]: e.target.value })}
            className="flex-1 font-mono"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Theme Designer</h2>
            <p className="text-muted-foreground">
              Create and customize multiple theme variants with custom colors
            </p>
          </div>
          <Button onClick={generateThemeWithAI} variant="outline">
            <Sparkle size={16} className="mr-2" weight="duotone" />
            Generate with AI
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette size={20} weight="duotone" />
              Theme Variants
            </h3>
            <Button onClick={() => setNewVariantDialogOpen(true)} size="sm">
              <Plus size={16} className="mr-2" />
              Add Variant
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {theme.variants.map((variant) => (
              <div key={variant.id} className="flex items-center gap-2 group">
                <Button
                  variant={theme.activeVariantId === variant.id ? 'default' : 'outline'}
                  onClick={() => updateTheme({ activeVariantId: variant.id })}
                  className="gap-2"
                >
                  {variant.name === 'Light' && <Sun size={16} weight="duotone" />}
                  {variant.name === 'Dark' && <Moon size={16} weight="duotone" />}
                  {variant.name}
                </Button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => duplicateVariant(variant.id)}
                    title="Duplicate"
                  >
                    <Plus size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteVariant(variant.id)}
                    disabled={theme.variants.length <= 1}
                    title="Delete"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="standard" className="w-full">
            <TabsList>
              <TabsTrigger value="standard">Standard Colors</TabsTrigger>
              <TabsTrigger value="extended">Extended Colors</TabsTrigger>
              <TabsTrigger value="custom">Custom Colors ({Object.keys(activeVariant.colors.customColors).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                {renderColorInput('Primary Color', 'primaryColor')}
                {renderColorInput('Secondary Color', 'secondaryColor')}
                {renderColorInput('Error Color', 'errorColor')}
                {renderColorInput('Warning Color', 'warningColor')}
                {renderColorInput('Success Color', 'successColor')}
              </div>
            </TabsContent>

            <TabsContent value="extended" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                {renderColorInput('Background', 'background')}
                {renderColorInput('Surface', 'surface')}
                {renderColorInput('Text', 'text')}
                {renderColorInput('Text Secondary', 'textSecondary')}
                {renderColorInput('Border', 'border')}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Add custom colors for your specific needs
                </p>
                <Button onClick={() => setCustomColorDialogOpen(true)} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Custom Color
                </Button>
              </div>

              {Object.keys(activeVariant.colors.customColors).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Palette size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
                  <p className="text-muted-foreground mb-4">No custom colors yet</p>
                  <Button onClick={() => setCustomColorDialogOpen(true)} variant="outline">
                    <Plus size={16} className="mr-2" />
                    Add Your First Custom Color
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(activeVariant.colors.customColors).map(([name, value]) => (
                    <div key={name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="capitalize">{name}</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomColor(name)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            updateActiveVariantColors({
                              customColors: {
                                ...activeVariant.colors.customColors,
                                [name]: e.target.value,
                              },
                            })
                          }
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateActiveVariantColors({
                              customColors: {
                                ...activeVariant.colors.customColors,
                                [name]: e.target.value,
                              },
                            })
                          }
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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

        <Card className="p-6" style={{ backgroundColor: activeVariant.colors.background }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: activeVariant.colors.text }}>
            Preview - {activeVariant.name} Mode
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <div
                className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm"
                style={{
                  backgroundColor: activeVariant.colors.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Primary
              </div>
              <div
                className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm"
                style={{
                  backgroundColor: activeVariant.colors.secondaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Secondary
              </div>
              <div
                className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm"
                style={{
                  backgroundColor: activeVariant.colors.errorColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Error
              </div>
              <div
                className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm"
                style={{
                  backgroundColor: activeVariant.colors.warningColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Warning
              </div>
              <div
                className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm"
                style={{
                  backgroundColor: activeVariant.colors.successColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Success
              </div>
              {Object.entries(activeVariant.colors.customColors).map(([name, color]) => (
                <div
                  key={name}
                  className="w-24 h-24 rounded flex flex-col items-center justify-center text-white font-semibold text-sm capitalize"
                  style={{
                    backgroundColor: color,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
            <div
              className="p-6"
              style={{
                fontFamily: theme.fontFamily,
                borderRadius: `${theme.borderRadius}px`,
                backgroundColor: activeVariant.colors.surface,
                color: activeVariant.colors.text,
                border: `1px solid ${activeVariant.colors.border}`,
              }}
            >
              <p style={{ fontSize: `${theme.fontSize.large}px`, marginBottom: '8px' }}>
                Large Text Sample
              </p>
              <p style={{ fontSize: `${theme.fontSize.medium}px`, marginBottom: '8px' }}>
                Medium Text Sample
              </p>
              <p style={{ fontSize: `${theme.fontSize.small}px`, color: activeVariant.colors.textSecondary }}>
                Small Text Sample (Secondary)
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={customColorDialogOpen} onOpenChange={setCustomColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Color</DialogTitle>
            <DialogDescription>
              Create a custom color for your theme variant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Color Name</Label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="e.g., accent, highlight, brand"
              />
            </div>
            <div className="space-y-2">
              <Label>Color Value</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomColorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCustomColor}>Add Color</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newVariantDialogOpen} onOpenChange={setNewVariantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Theme Variant</DialogTitle>
            <DialogDescription>
              Create a new theme variant based on the current one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Variant Name</Label>
              <Input
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                placeholder="e.g., High Contrast, Colorblind Friendly"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewVariantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addVariant}>Add Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
