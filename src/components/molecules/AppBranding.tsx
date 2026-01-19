import { AppLogo, Stack, Heading, Text } from '@/components/atoms'

interface AppBrandingProps {
  title?: string
  subtitle?: string
}

export function AppBranding({ 
  title = 'CodeForge', 
  subtitle = 'Low-Code Next.js App Builder' 
}: AppBrandingProps) {
  return (
    <Stack direction="horizontal" align="center" spacing="sm" className="flex-1 min-w-0">
      <AppLogo />
      <Stack direction="vertical" spacing="none" className="min-w-[100px]">
        <Heading level={1} className="text-base sm:text-xl font-bold whitespace-nowrap">{title}</Heading>
        <Text variant="caption" className="hidden sm:block whitespace-nowrap">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  )
}
