import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash, 
  Download, 
  CircleNotch,
  Square,
  Triangle,
  Star,
  Heart,
  Polygon,
  TextT,
  Image as ImageIcon,
  ArrowCounterClockwise,
  Copy,
  FloppyDisk,
  PencilSimple,
  Eraser
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface FaviconElement {
  id: string
  type: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'polygon' | 'text' | 'emoji' | 'freehand'
  x: number
  y: number
  width: number
  height: number
  color: string
  rotation: number
  text?: string
  fontSize?: number
  fontWeight?: string
  emoji?: string
  paths?: Array<{ x: number; y: number }>
  strokeWidth?: number
}

interface FaviconDesign {
  id: string
  name: string
  size: number
  backgroundColor: string
  elements: FaviconElement[]
  createdAt: number
  updatedAt: number
}

const PRESET_SIZES = [16, 32, 48, 64, 128, 256, 512]
const ELEMENT_TYPES = [
  { value: 'circle', label: 'Circle', icon: CircleNotch },
  { value: 'square', label: 'Square', icon: Square },
  { value: 'triangle', label: 'Triangle', icon: Triangle },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'polygon', label: 'Polygon', icon: Polygon },
  { value: 'text', label: 'Text', icon: TextT },
  { value: 'emoji', label: 'Emoji', icon: ImageIcon },
]

const DEFAULT_DESIGN: FaviconDesign = {
  id: 'default',
  name: 'My Favicon',
  size: 128,
  backgroundColor: '#7c3aed',
  elements: [
    {
      id: '1',
      type: 'text',
      x: 64,
      y: 64,
      width: 100,
      height: 100,
      color: '#ffffff',
      rotation: 0,
      text: 'CF',
      fontSize: 48,
      fontWeight: 'bold',
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

export function FaviconDesigner() {
  const [designs, setDesigns] = useKV<FaviconDesign[]>('favicon-designs', [DEFAULT_DESIGN])
  const [activeDesignId, setActiveDesignId] = useState<string>(DEFAULT_DESIGN.id)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState<'select' | 'draw' | 'erase'>('select')
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState('#ffffff')
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)

  const safeDesigns = designs || [DEFAULT_DESIGN]
  const activeDesign = safeDesigns.find((d) => d.id === activeDesignId) || DEFAULT_DESIGN
  const selectedElement = activeDesign.elements.find((e) => e.id === selectedElementId)

  useEffect(() => {
    drawCanvas()
  }, [activeDesign])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = activeDesign.size
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = activeDesign.backgroundColor
    ctx.fillRect(0, 0, size, size)

    activeDesign.elements.forEach((element) => {
      ctx.save()
      
      if (element.type === 'freehand' && element.paths && element.paths.length > 0) {
        ctx.strokeStyle = element.color
        ctx.lineWidth = element.strokeWidth || 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        ctx.beginPath()
        ctx.moveTo(element.paths[0].x, element.paths[0].y)
        for (let i = 1; i < element.paths.length; i++) {
          ctx.lineTo(element.paths[i].x, element.paths[i].y)
        }
        ctx.stroke()
      } else {
        ctx.translate(element.x, element.y)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.fillStyle = element.color

        switch (element.type) {
          case 'circle':
            ctx.beginPath()
            ctx.arc(0, 0, element.width / 2, 0, Math.PI * 2)
            ctx.fill()
            break
          case 'square':
            ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
            break
          case 'triangle':
            ctx.beginPath()
            ctx.moveTo(0, -element.height / 2)
            ctx.lineTo(element.width / 2, element.height / 2)
            ctx.lineTo(-element.width / 2, element.height / 2)
            ctx.closePath()
            ctx.fill()
            break
          case 'star':
            drawStar(ctx, 0, 0, 5, element.width / 2, element.width / 4)
            break
          case 'heart':
            drawHeart(ctx, 0, 0, element.width)
            break
          case 'polygon':
            drawPolygon(ctx, 0, 0, 6, element.width / 2)
            break
          case 'text':
            ctx.fillStyle = element.color
            ctx.font = `${element.fontWeight || 'bold'} ${element.fontSize || 32}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(element.text || '', 0, 0)
            break
          case 'emoji':
            ctx.font = `${element.fontSize || 32}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(element.emoji || '😀', 0, 0)
            break
        }
      }

      ctx.restore()
    })
  }

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
  }

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const topCurveHeight = size * 0.3
    ctx.beginPath()
    ctx.moveTo(x, y + topCurveHeight)
    ctx.bezierCurveTo(x, y, x - size / 2, y - topCurveHeight, x - size / 2, y + topCurveHeight)
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size)
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight)
    ctx.bezierCurveTo(x + size / 2, y - topCurveHeight, x, y, x, y + topCurveHeight)
    ctx.closePath()
    ctx.fill()
  }

  const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, sides: number, radius: number) => {
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  const handleAddElement = (type: FaviconElement['type']) => {
    const newElement: FaviconElement = {
      id: `element-${Date.now()}`,
      type,
      x: activeDesign.size / 2,
      y: activeDesign.size / 2,
      width: type === 'text' || type === 'emoji' ? 100 : 40,
      height: type === 'text' || type === 'emoji' ? 100 : 40,
      color: '#ffffff',
      rotation: 0,
      ...(type === 'text' && { text: 'A', fontSize: 32, fontWeight: 'bold' }),
      ...(type === 'emoji' && { emoji: '😀', fontSize: 40 }),
    }

    setDesigns((current) =>
      (current || []).map((d) =>
        d.id === activeDesignId
          ? { ...d, elements: [...d.elements, newElement], updatedAt: Date.now() }
          : d
      )
    )
    setSelectedElementId(newElement.id)
  }

  const handleUpdateElement = (updates: Partial<FaviconElement>) => {
    if (!selectedElementId) return

    setDesigns((current) =>
      (current || []).map((d) =>
        d.id === activeDesignId
          ? {
              ...d,
              elements: d.elements.map((e) => (e.id === selectedElementId ? { ...e, ...updates } : e)),
              updatedAt: Date.now(),
            }
          : d
      )
    )
  }

  const handleDeleteElement = (elementId: string) => {
    setDesigns((current) =>
      (current || []).map((d) =>
        d.id === activeDesignId
          ? { ...d, elements: d.elements.filter((e) => e.id !== elementId), updatedAt: Date.now() }
          : d
      )
    )
    setSelectedElementId(null)
  }

  const handleUpdateDesign = (updates: Partial<FaviconDesign>) => {
    setDesigns((current) =>
      (current || []).map((d) => (d.id === activeDesignId ? { ...d, ...updates, updatedAt: Date.now() } : d))
    )
  }

  const handleNewDesign = () => {
    const newDesign: FaviconDesign = {
      id: `design-${Date.now()}`,
      name: `Favicon ${safeDesigns.length + 1}`,
      size: 128,
      backgroundColor: '#7c3aed',
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setDesigns((current) => [...(current || []), newDesign])
    setActiveDesignId(newDesign.id)
    setSelectedElementId(null)
  }

  const handleDuplicateDesign = () => {
    const newDesign: FaviconDesign = {
      ...activeDesign,
      id: `design-${Date.now()}`,
      name: `${activeDesign.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setDesigns((current) => [...(current || []), newDesign])
    setActiveDesignId(newDesign.id)
    toast.success('Design duplicated')
  }

  const handleDeleteDesign = () => {
    if (safeDesigns.length === 1) {
      toast.error('Cannot delete the last design')
      return
    }

    const filteredDesigns = safeDesigns.filter((d) => d.id !== activeDesignId)
    setDesigns(filteredDesigns)
    setActiveDesignId(filteredDesigns[0].id)
    setSelectedElementId(null)
    toast.success('Design deleted')
  }

  const handleExport = (format: 'png' | 'ico' | 'svg', size?: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (format === 'png') {
      const exportSize = size || activeDesign.size
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = exportSize
      tempCanvas.height = exportSize
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportSize, exportSize)

      tempCanvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeDesign.name}-${exportSize}x${exportSize}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success(`Exported as ${exportSize}x${exportSize} PNG`)
      })
    } else if (format === 'ico') {
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeDesign.name}.ico`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Exported as ICO')
      })
    } else if (format === 'svg') {
      const svg = generateSVG()
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeDesign.name}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Exported as SVG')
    }
  }

  const generateSVG = (): string => {
    const size = activeDesign.size
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
    svg += `<rect width="${size}" height="${size}" fill="${activeDesign.backgroundColor}"/>`

    activeDesign.elements.forEach((element) => {
      const transform = `translate(${element.x},${element.y}) rotate(${element.rotation})`

      switch (element.type) {
        case 'circle':
          svg += `<circle cx="0" cy="0" r="${element.width / 2}" fill="${element.color}" transform="${transform}"/>`
          break
        case 'square':
          svg += `<rect x="${-element.width / 2}" y="${-element.height / 2}" width="${element.width}" height="${element.height}" fill="${element.color}" transform="${transform}"/>`
          break
        case 'text':
          svg += `<text x="0" y="0" fill="${element.color}" font-size="${element.fontSize}" font-weight="${element.fontWeight}" text-anchor="middle" dominant-baseline="middle" transform="${transform}">${element.text}</text>`
          break
      }
    })

    svg += '</svg>'
    return svg
  }

  const handleExportAll = () => {
    PRESET_SIZES.forEach((size) => {
      setTimeout(() => handleExport('png', size), size * 10)
    })
    toast.success('Exporting all sizes...')
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = activeDesign.size / rect.width
    const scaleY = activeDesign.size / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawMode === 'select') return

    setIsDrawing(true)
    const coords = getCanvasCoordinates(e)
    setCurrentPath([coords])
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawMode === 'select') return

    const coords = getCanvasCoordinates(e)
    setCurrentPath((prev) => [...prev, coords])

    const canvas = drawingCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (drawMode === 'draw') {
      ctx.strokeStyle = brushColor
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (currentPath.length > 0) {
        const prevPoint = currentPath[currentPath.length - 1]
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
      }
    } else if (drawMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (currentPath.length > 0) {
        const prevPoint = currentPath[currentPath.length - 1]
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  const handleCanvasMouseUp = () => {
    if (!isDrawing || drawMode === 'select') return

    setIsDrawing(false)

    if (drawMode === 'draw' && currentPath.length > 1) {
      const newElement: FaviconElement = {
        id: `element-${Date.now()}`,
        type: 'freehand',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: brushColor,
        rotation: 0,
        paths: currentPath,
        strokeWidth: brushSize,
      }

      setDesigns((current) =>
        (current || []).map((d) =>
          d.id === activeDesignId
            ? { ...d, elements: [...d.elements, newElement], updatedAt: Date.now() }
            : d
        )
      )
    } else if (drawMode === 'erase') {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const imageData = ctx.getImageData(0, 0, activeDesign.size, activeDesign.size)
      
      const filteredElements = activeDesign.elements.filter((element) => {
        if (element.type !== 'freehand' || !element.paths) return true

        return !element.paths.some((point) =>
          currentPath.some((erasePoint) => {
            const distance = Math.sqrt(
              Math.pow(point.x - erasePoint.x, 2) + Math.pow(point.y - erasePoint.y, 2)
            )
            return distance < brushSize * 2
          })
        )
      })

      if (filteredElements.length !== activeDesign.elements.length) {
        setDesigns((current) =>
          (current || []).map((d) =>
            d.id === activeDesignId
              ? { ...d, elements: filteredElements, updatedAt: Date.now() }
              : d
          )
        )
      }
    }

    setCurrentPath([])
    drawCanvas()
  }

  const handleCanvasMouseLeave = () => {
    if (isDrawing) {
      handleCanvasMouseUp()
    }
  }

  useEffect(() => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = activeDesign.size
    canvas.height = activeDesign.size

    ctx.clearRect(0, 0, activeDesign.size, activeDesign.size)
  }, [activeDesign, drawMode])


  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border bg-card px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleNewDesign}>
              <Plus size={16} className="mr-2" />
              New Design
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicateDesign}>
              <Copy size={16} className="mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeleteDesign} disabled={safeDesigns.length === 1}>
              <Trash size={16} className="mr-2" />
              Delete
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={drawMode === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setDrawMode('select')
                setSelectedElementId(null)
              }}
            >
              Select
            </Button>
            <Button
              variant={drawMode === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setDrawMode('draw')
                setSelectedElementId(null)
              }}
            >
              <PencilSimple size={16} className="mr-2" />
              Draw
            </Button>
            <Button
              variant={drawMode === 'erase' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setDrawMode('erase')
                setSelectedElementId(null)
              }}
            >
              <Eraser size={16} className="mr-2" />
              Erase
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_400px]">
          <div className="border-r border-border p-6 flex flex-col items-center justify-center bg-muted/20">
            <Card className="p-8 mb-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="border-2 border-border rounded-lg shadow-xl absolute top-0 left-0"
                      style={{
                        width: '400px',
                        height: '400px',
                        imageRendering: 'pixelated',
                        pointerEvents: 'none',
                      }}
                    />
                    <canvas
                      ref={drawingCanvasRef}
                      className="border-2 border-border rounded-lg shadow-xl relative z-10"
                      style={{
                        width: '400px',
                        height: '400px',
                        imageRendering: 'pixelated',
                        cursor: drawMode === 'draw' ? 'crosshair' : drawMode === 'erase' ? 'not-allowed' : 'default',
                      }}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseLeave}
                    />
                  </div>
                  <Badge className="absolute -top-3 -right-3">
                    {activeDesign.size}x{activeDesign.size}
                  </Badge>
                  {drawMode !== 'select' && (
                    <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent">
                      {drawMode === 'draw' ? `Brush: ${brushSize}px` : `Eraser: ${brushSize * 2}px`}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap justify-center">
                  {PRESET_SIZES.map((size) => (
                    <div
                      key={size}
                      className="flex flex-col items-center gap-1 p-2 rounded border border-border hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleExport('png', size)}
                      title={`Export ${size}x${size}`}
                    >
                      <canvas
                        width={size}
                        height={size}
                        ref={(canvas) => {
                          if (!canvas) return
                          const ctx = canvas.getContext('2d')
                          if (!ctx || !canvasRef.current) return
                          ctx.drawImage(canvasRef.current, 0, 0, size, size)
                        }}
                        className="border border-border rounded"
                        style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
                      />
                      <span className="text-xs text-muted-foreground">{size}px</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => handleExport('png')}>
                <Download size={16} className="mr-2" />
                Export PNG
              </Button>
              <Button onClick={() => handleExport('svg')} variant="outline">
                <Download size={16} className="mr-2" />
                Export SVG
              </Button>
              <Button onClick={handleExportAll} variant="outline">
                <Download size={16} className="mr-2" />
                Export All Sizes
              </Button>
            </div>
          </div>

          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <Label>Design Name</Label>
                <Input
                  value={activeDesign.name}
                  onChange={(e) => handleUpdateDesign({ name: e.target.value })}
                  placeholder="My Favicon"
                />
              </div>

              <div>
                <Label>Select Design</Label>
                <Select value={activeDesignId} onValueChange={setActiveDesignId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {safeDesigns.map((design) => (
                      <SelectItem key={design.id} value={design.id}>
                        {design.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Canvas Size</Label>
                <Select
                  value={String(activeDesign.size)}
                  onValueChange={(value) => handleUpdateDesign({ size: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_SIZES.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}x{size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={activeDesign.backgroundColor}
                    onChange={(e) => handleUpdateDesign({ backgroundColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={activeDesign.backgroundColor}
                    onChange={(e) => handleUpdateDesign({ backgroundColor: e.target.value })}
                    placeholder="#7c3aed"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-3 block">Add Elements</Label>
                <div className="grid grid-cols-4 gap-2">
                  {ELEMENT_TYPES.map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddElement(value as FaviconElement['type'])}
                      className="flex flex-col gap-1 h-auto py-2"
                      disabled={drawMode !== 'select'}
                    >
                      <Icon size={20} />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
                {drawMode !== 'select' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Switch to Select mode to add elements
                  </p>
                )}
              </div>

              {drawMode !== 'select' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      {drawMode === 'draw' ? 'Brush Settings' : 'Eraser Settings'}
                    </Label>

                    {drawMode === 'draw' && (
                      <div>
                        <Label>Brush Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>
                        {drawMode === 'draw' ? 'Brush' : 'Eraser'} Size: {brushSize}px
                      </Label>
                      <Slider
                        value={[brushSize]}
                        onValueChange={([value]) => setBrushSize(value)}
                        min={1}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="mb-3 block">
                  Elements ({activeDesign.elements.length})
                </Label>
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {activeDesign.elements.map((element) => (
                      <div
                        key={element.id}
                        className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                          selectedElementId === element.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-accent/50'
                        }`}
                        onClick={() => {
                          if (drawMode === 'select') {
                            setSelectedElementId(element.id)
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {element.type === 'freehand' ? (
                            <PencilSimple size={16} />
                          ) : (
                            ELEMENT_TYPES.find((t) => t.value === element.type)?.icon && (
                              <span>
                                {(() => {
                                  const Icon = ELEMENT_TYPES.find((t) => t.value === element.type)!.icon
                                  return <Icon size={16} />
                                })()}
                              </span>
                            )
                          )}
                          <span className="text-sm capitalize">{element.type}</span>
                          {element.text && <span className="text-xs text-muted-foreground">"{element.text}"</span>}
                          {element.emoji && <span className="text-xs">{element.emoji}</span>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteElement(element.id)
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    ))}
                    {activeDesign.elements.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No elements yet. Add some or start drawing!
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {selectedElement && drawMode === 'select' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Edit Element</Label>

                    {selectedElement.type === 'freehand' && (
                      <>
                        <div>
                          <Label>Stroke Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedElement.color}
                              onChange={(e) => handleUpdateElement({ color: e.target.value })}
                              className="w-20 h-10"
                            />
                            <Input
                              value={selectedElement.color}
                              onChange={(e) => handleUpdateElement({ color: e.target.value })}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Stroke Width: {selectedElement.strokeWidth || 3}px</Label>
                          <Slider
                            value={[selectedElement.strokeWidth || 3]}
                            onValueChange={([value]) => handleUpdateElement({ strokeWidth: value })}
                            min={1}
                            max={20}
                            step={1}
                          />
                        </div>
                      </>
                    )}

                    {(selectedElement.type === 'text' || selectedElement.type === 'emoji') && (
                      <>
                        {selectedElement.type === 'text' && (
                          <div>
                            <Label>Text</Label>
                            <Input
                              value={selectedElement.text || ''}
                              onChange={(e) => handleUpdateElement({ text: e.target.value })}
                              placeholder="Enter text"
                            />
                          </div>
                        )}

                        {selectedElement.type === 'emoji' && (
                          <div>
                            <Label>Emoji</Label>
                            <Input
                              value={selectedElement.emoji || ''}
                              onChange={(e) => handleUpdateElement({ emoji: e.target.value })}
                              placeholder="😀"
                            />
                          </div>
                        )}

                        <div>
                          <Label>Font Size: {selectedElement.fontSize}px</Label>
                          <Slider
                            value={[selectedElement.fontSize || 32]}
                            onValueChange={([value]) => handleUpdateElement({ fontSize: value })}
                            min={12}
                            max={200}
                            step={1}
                          />
                        </div>

                        {selectedElement.type === 'text' && (
                          <div>
                            <Label>Font Weight</Label>
                            <Select
                              value={selectedElement.fontWeight || 'bold'}
                              onValueChange={(value) => handleUpdateElement({ fontWeight: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="lighter">Light</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}

                    {selectedElement.type !== 'text' && selectedElement.type !== 'emoji' && selectedElement.type !== 'freehand' && (
                      <>
                        <div>
                          <Label>Width: {selectedElement.width}px</Label>
                          <Slider
                            value={[selectedElement.width]}
                            onValueChange={([value]) => handleUpdateElement({ width: value })}
                            min={10}
                            max={activeDesign.size}
                            step={1}
                          />
                        </div>

                        <div>
                          <Label>Height: {selectedElement.height}px</Label>
                          <Slider
                            value={[selectedElement.height]}
                            onValueChange={([value]) => handleUpdateElement({ height: value })}
                            min={10}
                            max={activeDesign.size}
                            step={1}
                          />
                        </div>
                      </>
                    )}

                    {selectedElement.type !== 'freehand' && (
                      <>
                        <div>
                          <Label>X Position: {selectedElement.x}px</Label>
                          <Slider
                            value={[selectedElement.x]}
                            onValueChange={([value]) => handleUpdateElement({ x: value })}
                            min={0}
                            max={activeDesign.size}
                            step={1}
                          />
                        </div>

                        <div>
                          <Label>Y Position: {selectedElement.y}px</Label>
                          <Slider
                            value={[selectedElement.y]}
                            onValueChange={([value]) => handleUpdateElement({ y: value })}
                            min={0}
                            max={activeDesign.size}
                            step={1}
                          />
                        </div>

                        <div>
                          <Label>Rotation: {selectedElement.rotation}°</Label>
                          <Slider
                            value={[selectedElement.rotation]}
                            onValueChange={([value]) => handleUpdateElement({ rotation: value })}
                            min={0}
                            max={360}
                            step={1}
                          />
                        </div>
                      </>
                    )}

                    {selectedElement.type !== 'freehand' && (
                      <div>
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElement.color}
                            onChange={(e) => handleUpdateElement({ color: e.target.value })}
                            className="w-20 h-10"
                          />
                          <Input
                            value={selectedElement.color}
                            onChange={(e) => handleUpdateElement({ color: e.target.value })}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
