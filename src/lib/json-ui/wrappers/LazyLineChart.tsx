import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface LazyLineChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  width?: number | string
  height?: number
  color?: string
  showLegend?: boolean
  showGrid?: boolean
}

export function LazyLineChart({
  data,
  xKey,
  yKey,
  width = 600,
  height = 300,
  color = '#8884d8',
  showLegend = true,
  showGrid = true,
}: LazyLineChartProps) {
  if (!data?.length) {
    return null
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        <Line type="monotone" dataKey={yKey} stroke={color} />
      </LineChart>
    </ResponsiveContainer>
  )
}
