import { cn } from '@/lib/utils'
import type { LazyD3BarChartWrapperProps } from './interfaces'

export function LazyD3BarChartWrapper({
  data,
  width = 600,
  height = 300,
  color = '#8884d8',
  className,
}: LazyD3BarChartWrapperProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)
  const maxValue = Math.max(...data.map((item) => item.value), 0)
  const barGap = 8
  const barCount = data.length
  const totalGap = barCount > 1 ? barGap * (barCount - 1) : 0
  const barWidth = barCount > 0 ? Math.max((innerWidth - totalGap) / barCount, 0) : 0

  return (
    <svg width={width} height={height} className={cn('overflow-visible', className)}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((item, index) => {
          const barHeight = maxValue ? (item.value / maxValue) * innerHeight : 0
          const x = index * (barWidth + barGap)
          const y = innerHeight - barHeight

          return (
            <g key={`${item.label}-${index}`}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx={2} />
              <text
                x={x + barWidth / 2}
                y={innerHeight + 16}
                textAnchor="middle"
                fill="currentColor"
                style={{ fontSize: 10 }}
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={Math.max(y - 6, 0)}
                textAnchor="middle"
                fill="currentColor"
                style={{ fontSize: 10 }}
              >
                {item.value}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
