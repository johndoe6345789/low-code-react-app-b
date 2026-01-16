import { AppLogo } from '@/components/atoms'

interface AppBrandingProps {
  title?: string
  subtitle?: string
}

export function AppBranding({ 
  title = 'CodeForge', 
  subtitle = 'Low-Code Next.js App Builder' 
}: AppBrandingProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <AppLogo />
      <div className="flex flex-col min-w-[100px]">
        <h1 className="text-base sm:text-xl font-bold whitespace-nowrap">{title}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
