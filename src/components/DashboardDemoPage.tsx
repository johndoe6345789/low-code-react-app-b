import { PageRenderer } from '@/lib/json-ui/page-renderer'
import { dashboardSchema } from '@/schemas/dashboard-schema'

export function DashboardDemoPage() {
  return <PageRenderer schema={dashboardSchema} />
}
