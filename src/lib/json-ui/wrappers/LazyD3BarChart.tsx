import { max, scaleBand, scaleLinear } from 'd3'

export interface LazyD3BarChartProps {
  data: Array<{ label: string; value: number }>
  width?: number
  height?: number
  color?: string
  showAxes?: boolean
  showGrid?: boolean
}

export function LazyD3BarChart({
  data,
  width = 600,
  height = 300,
  color = '#8884d8',
  showAxes = true,
  showGrid = true,
}: LazyD3BarChartProps) {
  if (!data?.length) {
    return null
  }

  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartWidth = Math.max(width - margin.left - margin.right, 0)
  const chartHeight = Math.max(height - margin.top - margin.bottom, 0)

  const maxValue = max(data, (d) => d.value) ?? 0
  const xScale = scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, chartWidth])
    .padding(0.1)

  const yScale = scaleLinear()
    .domain([0, maxValue])
    .nice()
    .range([chartHeight, 0])

  const yTicks = yScale.ticks(4)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {showGrid &&
          yTicks.map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={0}
              x2={chartWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="currentColor"
              opacity={0.1}
            />
          ))}

        {data.map((entry) => (
          <rect
            key={entry.label}
            x={xScale(entry.label) ?? 0}
            y={yScale(entry.value)}
            width={xScale.bandwidth()}
            height={chartHeight - yScale(entry.value)}
            fill={color}
          />
        ))}

        {showAxes && (
          <>
            <line x1={0} x2={chartWidth} y1={chartHeight} y2={chartHeight} stroke="currentColor" />
            <line x1={0} x2={0} y1={0} y2={chartHeight} stroke="currentColor" />
            {yTicks.map((tick) => (
              <g key={`tick-${tick}`} transform={`translate(0,${yScale(tick)})`}>
                <line x1={-4} x2={0} y1={0} y2={0} stroke="currentColor" />
                <text x={-8} y={4} textAnchor="end" className="text-[10px] fill-muted-foreground">
                  {tick}
                </text>
              </g>
            ))}
            {data.map((entry) => (
              <text
                key={`label-${entry.label}`}
                x={(xScale(entry.label) ?? 0) + xScale.bandwidth() / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
              >
                {entry.label}
              </text>
            ))}
          </>
        )}
      </g>
    </svg>
  )
}
