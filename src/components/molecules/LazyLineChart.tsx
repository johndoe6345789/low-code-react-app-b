import { useRecharts } from '@/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Warning } from '@phosphor-icons/react'

interface LazyLineChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  width?: number
  height?: number
  color?: string
}

export function LazyLineChart({ 
  data, 
  xKey, 
  yKey, 
  width = 600, 
  height = 300,
  color = '#8884d8'
}: LazyLineChartProps) {
  const { library: recharts, loading, error } = useRecharts()

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
          Failed to load chart library. Please refresh the page.
        </AlertDescription>
      </Alert>
    )
  }

  if (!recharts) {
    return null
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = recharts

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke={color} />
      </LineChart>
    </ResponsiveContainer>
  )
}
