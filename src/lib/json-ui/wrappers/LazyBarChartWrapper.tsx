import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import type { LazyBarChartWrapperProps } from './interfaces'

export function LazyBarChartWrapper({
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
}: LazyBarChartWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width={width} height={height}>
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Bar dataKey={yKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
