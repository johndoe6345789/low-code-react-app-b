import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface LazyBarChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  width?: number | string
  height?: number
  color?: string
  showLegend?: boolean
  showGrid?: boolean
}

export function LazyBarChart({
  data,
  xKey,
  yKey,
  width = 600,
  height = 300,
  color = '#8884d8',
  showLegend = true,
  showGrid = true,
}: LazyBarChartProps) {
  if (!data?.length) {
    return null
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        <Bar dataKey={yKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  )
}
