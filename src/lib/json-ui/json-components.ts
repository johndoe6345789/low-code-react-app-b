/**
 * Pure JSON components - no TypeScript wrappers needed
 * Interfaces are defined in src/lib/json-ui/interfaces/
 * JSON definitions are in src/components/json-definitions/
 */
import { createJsonComponent } from './create-json-component'
import { createJsonComponentWithHooks } from './create-json-component-with-hooks'
import type {
  LoadingFallbackProps,
  NavigationItemProps,
  PageHeaderContentProps,
  SaveIndicatorProps,
  LazyBarChartProps,
  LazyLineChartProps,
  LazyD3BarChartProps,
  SeedDataManagerProps,
  StorageSettingsProps,
  GitHubBuildStatusProps,
  ComponentBindingDialogProps,
  DataSourceEditorDialogProps,
  ComponentTreeProps,
  TreeCardProps,
  FilterInputProps,
  CopyButtonProps,
  InputProps,
  PasswordInputProps,
  ImageProps,
  PopoverProps,
  MenuProps,
  FileUploadProps,
  AccordionProps,
  BindingEditorProps,
  AppLayoutProps,
  AppRouterLayoutProps,
  AppMainPanelProps,
  AppDialogsProps,
  DataSourceManagerProps,
  NavigationMenuProps,
  TreeListPanelProps,
  ActionButtonProps,
  ActionCardProps,
  ActionIconProps,
  AlertProps,
  AppLogoProps,
  AvatarProps,
  AvatarGroupProps,
  BadgeProps,
} from './interfaces'

// Import JSON definitions
import loadingFallbackDef from '@/components/json-definitions/loading-fallback.json'
import navigationItemDef from '@/components/json-definitions/navigation-item.json'
import pageHeaderContentDef from '@/components/json-definitions/page-header-content.json'
import componentBindingDialogDef from '@/components/json-definitions/component-binding-dialog.json'
import dataSourceEditorDialogDef from '@/components/json-definitions/data-source-editor-dialog.json'
import githubBuildStatusDef from '@/components/json-definitions/github-build-status.json'
import saveIndicatorDef from '@/components/json-definitions/save-indicator.json'
import componentTreeDef from '@/components/json-definitions/component-tree.json'
import seedDataManagerDef from '@/components/json-definitions/seed-data-manager.json'
import lazyD3BarChartDef from '@/components/json-definitions/lazy-d3-bar-chart.json'
import storageSettingsDef from '@/components/json-definitions/storage-settings.json'
import treeCardDef from '@/components/json-definitions/tree-card.json'
import filterInputDef from '@/components/json-definitions/filter-input.json'
import copyButtonDef from '@/components/json-definitions/copy-button.json'
import inputDef from '@/components/json-definitions/input.json'
import passwordInputDef from '@/components/json-definitions/password-input.json'
import imageDef from '@/components/json-definitions/image.json'
import popoverDef from '@/components/json-definitions/popover.json'
import menuDef from '@/components/json-definitions/menu.json'
import fileUploadDef from '@/components/json-definitions/file-upload.json'
import accordionDef from '@/components/json-definitions/accordion.json'
import bindingEditorDef from '@/components/json-definitions/binding-editor.json'
import appLayoutDef from '@/components/json-definitions/app-layout.json'
import appRouterLayoutDef from '@/components/json-definitions/app-router-layout.json'
import appMainPanelDef from '@/components/json-definitions/app-main-panel.json'
import appDialogsDef from '@/components/json-definitions/app-dialogs.json'
import navigationMenuDef from '@/components/json-definitions/navigation-menu.json'
import dataSourceManagerDef from '@/components/json-definitions/data-source-manager.json'
import treeListPanelDef from '@/components/json-definitions/tree-list-panel.json'
import actionButtonDef from '@/components/json-definitions/action-button.json'
import actionCardDef from '@/components/json-definitions/action-card.json'
import actionIconDef from '@/components/json-definitions/action-icon.json'
import alertDef from '@/components/json-definitions/alert.json'
import appLogoDef from '@/components/json-definitions/app-logo.json'
import avatarDef from '@/components/json-definitions/avatar.json'
import avatarGroupDef from '@/components/json-definitions/avatar-group.json'
import badgeDef from '@/components/json-definitions/badge.json'

// Create pure JSON components (no hooks)
export const LoadingFallback = createJsonComponent<LoadingFallbackProps>(loadingFallbackDef)
export const NavigationItem = createJsonComponent<NavigationItemProps>(navigationItemDef)
export const PageHeaderContent = createJsonComponent<PageHeaderContentProps>(pageHeaderContentDef)
export const ComponentBindingDialog = createJsonComponent<ComponentBindingDialogProps>(componentBindingDialogDef)
export const DataSourceEditorDialog = createJsonComponent<DataSourceEditorDialogProps>(dataSourceEditorDialogDef)
export const GitHubBuildStatus = createJsonComponent<GitHubBuildStatusProps>(githubBuildStatusDef)
export const SeedDataManager = createJsonComponent<SeedDataManagerProps>(seedDataManagerDef)
export const TreeCard = createJsonComponent<TreeCardProps>(treeCardDef)
export const AppDialogs = createJsonComponent<AppDialogsProps>(appDialogsDef)
export const ActionButton = createJsonComponent<ActionButtonProps>(actionButtonDef)
export const ActionCard = createJsonComponent<ActionCardProps>(actionCardDef)
export const ActionIcon = createJsonComponent<ActionIconProps>(actionIconDef)
export const Alert = createJsonComponent<AlertProps>(alertDef)
export const AppLogo = createJsonComponent<AppLogoProps>(appLogoDef)
export const Avatar = createJsonComponent<AvatarProps>(avatarDef)
export const AvatarGroup = createJsonComponent<AvatarGroupProps>(avatarGroupDef)
export const Badge = createJsonComponent<BadgeProps>(badgeDef)

// Create JSON components with hooks
export const SaveIndicator = createJsonComponentWithHooks<SaveIndicatorProps>(saveIndicatorDef, {
  hooks: {
    hookData: {
      hookName: 'useSaveIndicator',
      args: (props) => [props.lastSaved ?? null]
    }
  }
})

export const ComponentTree = createJsonComponentWithHooks<ComponentTreeProps>(componentTreeDef, {
  hooks: {
    treeData: {
      hookName: 'useComponentTree',
      args: (props) => [props.components || [], props.selectedId || null]
    }
  }
})

export const LazyD3BarChart = createJsonComponentWithHooks<LazyD3BarChartProps>(lazyD3BarChartDef, {
  hooks: {
    chartData: {
      hookName: 'useD3BarChart',
      args: (props) => [props.data, props.width, props.height]
    }
  }
})

export const StorageSettings = createJsonComponentWithHooks<StorageSettingsProps>(storageSettingsDef, {
  hooks: {
    backendInfo: {
      hookName: 'useStorageBackendInfo',
      args: (props) => [props.backend || null]
    }
  }
})

export const FilterInput = createJsonComponentWithHooks<FilterInputProps>(filterInputDef, {
  hooks: {
    focusState: {
      hookName: 'useFocusState',
      args: () => []
    }
  }
})

export const CopyButton = createJsonComponentWithHooks<CopyButtonProps>(copyButtonDef, {
  hooks: {
    copyState: {
      hookName: 'useCopyState',
      args: (props) => [props.text]
    }
  }
})

export const Input = createJsonComponent<InputProps>(inputDef)

export const PasswordInput = createJsonComponentWithHooks<PasswordInputProps>(passwordInputDef, {
  hooks: {
    visibility: {
      hookName: 'usePasswordVisibility',
      args: () => []
    }
  }
})

export const Image = createJsonComponentWithHooks<ImageProps>(imageDef, {
  hooks: {
    imageState: {
      hookName: 'useImageState',
      args: (props) => [props.onLoad, props.onError]
    }
  }
})

export const Popover = createJsonComponentWithHooks<PopoverProps>(popoverDef, {
  hooks: {
    state: {
      hookName: 'usePopoverState',
      args: () => []
    }
  }
})

export const Menu = createJsonComponentWithHooks<MenuProps>(menuDef, {
  hooks: {
    menuState: {
      hookName: 'useMenuState',
      args: () => []
    }
  }
})

export const FileUpload = createJsonComponentWithHooks<FileUploadProps>(fileUploadDef, {
  hooks: {
    uploadState: {
      hookName: 'useFileUpload',
      args: (props) => [props.onFilesSelected, props.maxSize, props.disabled]
    }
  }
})

export const Accordion = createJsonComponentWithHooks<AccordionProps>(accordionDef, {
  hooks: {
    accordionState: {
      hookName: 'useAccordion',
      args: (props) => [props.type || 'single', props.defaultOpen || []]
    }
  }
})

export const BindingEditor = createJsonComponentWithHooks<BindingEditorProps>(bindingEditorDef, {
  hooks: {
    editorState: {
      hookName: 'useBindingEditor',
      args: (props) => [props.bindings, props.onChange]
    }
  }
})

export const AppLayout = createJsonComponentWithHooks<AppLayoutProps>(appLayoutDef, {
  hooks: {
    hookData: {
      hookName: 'useAppLayout',
      args: (props) => [props]
    }
  }
})

export const AppRouterLayout = createJsonComponentWithHooks<AppRouterLayoutProps>(appRouterLayoutDef, {
  hooks: {
    hookData: {
      hookName: 'useAppRouterLayout',
      args: (props) => [props]
    }
  }
})

export const AppMainPanel = createJsonComponent<AppMainPanelProps>(appMainPanelDef)

export const DataSourceManager = createJsonComponentWithHooks<DataSourceManagerProps>(dataSourceManagerDef, {
  hooks: {
    managerState: {
      hookName: 'useDataSourceManagerState',
      args: (props) => [props.dataSources || [], props.onChange || (() => {})]
    }
  }
})

export const NavigationMenu = createJsonComponentWithHooks<NavigationMenuProps>(navigationMenuDef, {
  hooks: {
    menuState: {
      hookName: 'useNavigationMenu',
      args: (props) => [props.featureToggles, props.errorCount || 0]
    }
  }
})

export const TreeListPanel = createJsonComponent<TreeListPanelProps>(treeListPanelDef)

// All components converted to pure JSON! 🎉
