import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import type { LazyLineChartWrapperProps } from './interfaces'

export function LazyLineChartWrapper({
  data,
  xKey,
  yKey,
  width = '100%',
  height = 300,
  color = '#8884d8',
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  className,
}: LazyLineChartWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Line type="monotone" dataKey={yKey} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
