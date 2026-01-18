import { AppLogo } from '@/components/atoms'

export function AppBranding() {
  return (
    <div className="flex items-center gap-2">
      <AppLogo size="sm" />
      <span className="font-semibold text-lg">Spark</span>
    </div>
  )
}
