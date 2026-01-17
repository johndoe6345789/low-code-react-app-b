import { useD3 } from '@/hooks'
import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Warning } from '@phosphor-icons/react'

interface LazyD3ChartProps {
  data: Array<{ label: string; value: number }>
  width?: number
  height?: number
  color?: string
}

export function LazyD3BarChart({ 
  data, 
  width = 600, 
  height = 300,
  color = '#8884d8'
}: LazyD3ChartProps) {
  const { library: d3, loading, error } = useD3()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!d3 || !svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand()
      .range([0, chartWidth])
      .padding(0.1)
      .domain(data.map(d => d.label))

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, d => d.value) || 0])

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => chartHeight - y(d.value))
      .attr('fill', color)

  }, [d3, data, width, height, color])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Warning className="h-4 w-4" />
        <AlertDescription>
          Failed to load D3 library. Please refresh the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <svg ref={svgRef} width={width} height={height} />
  )
}
