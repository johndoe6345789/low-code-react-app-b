import { AppBranding, Breadcrumb, SaveIndicator } from '@/components/molecules'
import { NavigationMenu } from '@/components/organisms/NavigationMenu'
import { ToolbarActions } from '@/components/organisms/ToolbarActions'
import { ProjectManager } from '@/components/ProjectManager'
import { FeatureToggles, Project } from '@/types/project'
import { Flex, Stack, Separator, Container } from '@/components/atoms'

interface AppHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  featureToggles: FeatureToggles
  errorCount: number
  lastSaved: number | null
  currentProject: Project
  onProjectLoad: (project: Project) => void
  onSearch: () => void
  onShowShortcuts: () => void
  onGenerateAI: () => void
  onExport: () => void
  onPreview?: () => void
  onShowErrors: () => void
}

export function AppHeader({
  activeTab,
  onTabChange,
  featureToggles,
  errorCount,
  lastSaved,
  currentProject,
  onProjectLoad,
  onSearch,
  onShowShortcuts,
  onGenerateAI,
  onExport,
  onPreview,
  onShowErrors,
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <Stack direction="vertical" spacing="none">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <Flex justify="between" align="center" gap="sm">
            <Flex align="center" gap="sm" className="flex-1 min-w-0">
              <NavigationMenu
                activeTab={activeTab}
                onTabChange={onTabChange}
                featureToggles={featureToggles}
                errorCount={errorCount}
              />
              <AppBranding />
              <SaveIndicator lastSaved={lastSaved} />
            </Flex>
            <Flex gap="xs" shrink className="shrink-0">
              <ProjectManager
                currentProject={currentProject}
                onProjectLoad={onProjectLoad}
              />
              <ToolbarActions
                onSearch={onSearch}
                onShowShortcuts={onShowShortcuts}
                onGenerateAI={onGenerateAI}
                onExport={onExport}
                onPreview={onPreview}
                onShowErrors={onShowErrors}
                errorCount={errorCount}
                showErrorButton={featureToggles.errorRepair && errorCount > 0}
              />
            </Flex>
          </Flex>
        </div>
        <Separator className="opacity-50" />
        <div className="px-4 sm:px-6 py-2">
          <Breadcrumb />
        </div>
      </Stack>
    </header>
  )
}
