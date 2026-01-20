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
  NavigationMenuProps,
  TextGradientProps,
  ErrorBadgeProps,
  AppLogoProps,
  DotProps,
  SpacerProps,
  LiveIndicatorProps,
  ActionIconProps,
  DividerProps,
  KbdProps,
  HelperTextProps,
  CodeProps,
  InfoBoxProps,
  AlertProps,
  BadgeProps,
  PulseProps,
  MetricDisplayProps,
  SeparatorProps,
  TextProps,
  HeadingProps,
  ContainerProps,
  StackProps,
  LabelProps,
  LinkProps,
  ChipProps,
  TagProps,
  SpinnerProps,
  IconWrapperProps,
  IconTextProps,
  EmptyMessageProps,
  SkeletonProps,
  LoadingSpinnerProps,
  CountBadgeProps,
  DetailRowProps,
  KeyValueProps,
  StatusIconProps,
  ProgressBarProps,
  PropertyEditorHeaderProps,
  PropertyEditorEmptyStateProps,
  PropertyEditorSectionProps,
  KvSourceFieldsProps,
  ComponentTreeEmptyStateProps,
  ComponentTreeNodesProps,
  ComponentTreeHeaderProps,
  DataSourceIdFieldProps,
  StaticSourceFieldsProps,
  FlexLayoutProps,
  IconRendererProps,
  ConditionalWrapperProps,
  DataCardProps,
  PanelProps,
  DynamicTextProps,
  GridLayoutProps,
  RepeatWrapperProps,
  DataSourceGroupSectionProps,
  DataSourceManagerProps,
  DataSourceManagerHeaderProps,
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
import navigationMenuDef from '@/components/json-definitions/navigation-menu.json'
import textGradientDef from '@/components/json-definitions/text-gradient.json'
import errorBadgeDef from '@/components/json-definitions/error-badge.json'
import appLogoDef from '@/components/json-definitions/app-logo.json'
import dotDef from '@/components/json-definitions/dot.json'
import spacerDef from '@/components/json-definitions/spacer.json'
import liveIndicatorDef from '@/components/json-definitions/live-indicator.json'
import actionIconDef from '@/components/json-definitions/action-icon.json'
import dividerDef from '@/components/json-definitions/divider.json'
import kbdDef from '@/components/json-definitions/kbd.json'
import helperTextDef from '@/components/json-definitions/helper-text.json'
import codeDef from '@/components/json-definitions/code.json'
import infoBoxDef from '@/components/json-definitions/info-box.json'
import alertDef from '@/components/json-definitions/alert.json'
import badgeDef from '@/components/json-definitions/badge.json'
import pulseDef from '@/components/json-definitions/pulse.json'
import metricDisplayDef from '@/components/json-definitions/metric-display.json'
import separatorDef from '@/components/json-definitions/separator.json'
import textDef from '@/components/json-definitions/text.json'
import headingDef from '@/components/json-definitions/heading.json'
import containerDef from '@/components/json-definitions/container.json'
import stackDef from '@/components/json-definitions/stack.json'
import labelDef from '@/components/json-definitions/label.json'
import linkDef from '@/components/json-definitions/link.json'
import chipDef from '@/components/json-definitions/chip.json'
import tagDef from '@/components/json-definitions/tag.json'
import spinnerDef from '@/components/json-definitions/spinner.json'
import iconWrapperDef from '@/components/json-definitions/icon-wrapper.json'
import iconTextDef from '@/components/json-definitions/icon-text.json'
import emptyMessageDef from '@/components/json-definitions/empty-message.json'
import skeletonDef from '@/components/json-definitions/skeleton.json'
import loadingSpinnerDef from '@/components/json-definitions/loading-spinner.json'
import countBadgeDef from '@/components/json-definitions/count-badge.json'
import detailRowDef from '@/components/json-definitions/detail-row.json'
import keyValueDef from '@/components/json-definitions/key-value.json'
import statusIconDef from '@/components/json-definitions/status-icon.json'
import progressBarDef from '@/components/json-definitions/progress-bar.json'
import propertyEditorHeaderDef from '@/components/json-definitions/property-editor-header.json'
import propertyEditorEmptyStateDef from '@/components/json-definitions/property-editor-empty-state.json'
import propertyEditorSectionDef from '@/components/json-definitions/property-editor-section.json'
import kvSourceFieldsDef from '@/components/json-definitions/kv-source-fields.json'
import componentTreeEmptyStateDef from '@/components/json-definitions/component-tree-empty-state.json'
import componentTreeNodesDef from '@/components/json-definitions/component-tree-nodes.json'
import componentTreeHeaderDef from '@/components/json-definitions/component-tree-header.json'
import dataSourceIdFieldDef from '@/components/json-definitions/data-source-id-field.json'
import staticSourceFieldsDef from '@/components/json-definitions/static-source-fields.json'
import flexLayoutDef from '@/components/json-definitions/flex-layout.json'
import iconRendererDef from '@/components/json-definitions/icon-renderer.json'
import conditionalWrapperDef from '@/components/json-definitions/conditional-wrapper.json'
import dataCardDef from '@/components/json-definitions/data-card.json'
import panelDef from '@/components/json-definitions/panel.json'
import dynamicTextDef from '@/components/json-definitions/dynamic-text.json'
import gridLayoutDef from '@/components/json-definitions/grid-layout.json'
import repeatWrapperDef from '@/components/json-definitions/repeat-wrapper.json'
import dataSourceGroupSectionDef from '@/components/json-definitions/data-source-group-section.json'
import dataSourceManagerDef from '@/components/json-definitions/data-source-manager.json'
import dataSourceManagerHeaderDef from '@/components/json-definitions/data-source-manager-header.json'

// Create pure JSON components (no hooks)
export const LoadingFallback = createJsonComponent<LoadingFallbackProps>(loadingFallbackDef)
export const NavigationItem = createJsonComponent<NavigationItemProps>(navigationItemDef)
export const PageHeaderContent = createJsonComponent<PageHeaderContentProps>(pageHeaderContentDef)
export const ComponentBindingDialog = createJsonComponent<ComponentBindingDialogProps>(componentBindingDialogDef)
export const DataSourceEditorDialog = createJsonComponent<DataSourceEditorDialogProps>(dataSourceEditorDialogDef)
export const GitHubBuildStatus = createJsonComponent<GitHubBuildStatusProps>(githubBuildStatusDef)
export const SeedDataManager = createJsonComponent<SeedDataManagerProps>(seedDataManagerDef)
export const TreeCard = createJsonComponent<TreeCardProps>(treeCardDef)

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

export const NavigationMenu = createJsonComponentWithHooks<NavigationMenuProps>(navigationMenuDef, {
  hooks: {
    menuState: {
      hookName: 'useNavigationMenu',
      args: (props) => [props.activeTab, props.onTabChange, props.featureToggles, props.errorCount ?? 0]
    }
  }
})

// Batch 1 - Simple stateless components
export const TextGradient = createJsonComponent<TextGradientProps>(textGradientDef)
export const ErrorBadge = createJsonComponent<ErrorBadgeProps>(errorBadgeDef)
export const AppLogo = createJsonComponent<AppLogoProps>(appLogoDef)
export const Dot = createJsonComponent<DotProps>(dotDef)
export const Spacer = createJsonComponent<SpacerProps>(spacerDef)
export const LiveIndicator = createJsonComponent<LiveIndicatorProps>(liveIndicatorDef)

// Batch 2 - Additional stateless components
export const ActionIcon = createJsonComponent<ActionIconProps>(actionIconDef)
export const Divider = createJsonComponent<DividerProps>(dividerDef)
export const Kbd = createJsonComponent<KbdProps>(kbdDef)
export const HelperText = createJsonComponent<HelperTextProps>(helperTextDef)
export const Code = createJsonComponent<CodeProps>(codeDef)
export const InfoBox = createJsonComponent<InfoBoxProps>(infoBoxDef)
export const Alert = createJsonComponent<AlertProps>(alertDef)
export const Badge = createJsonComponent<BadgeProps>(badgeDef)
export const Pulse = createJsonComponent<PulseProps>(pulseDef)
export const MetricDisplay = createJsonComponent<MetricDisplayProps>(metricDisplayDef)

// Batch 3 - Layout and text components (Jan 2026)
export const Separator = createJsonComponent<SeparatorProps>(separatorDef)
export const Text = createJsonComponent<TextProps>(textDef)
export const Heading = createJsonComponent<HeadingProps>(headingDef)
export const Container = createJsonComponent<ContainerProps>(containerDef)
export const Stack = createJsonComponent<StackProps>(stackDef)
export const Label = createJsonComponent<LabelProps>(labelDef)
export const Link = createJsonComponent<LinkProps>(linkDef)
export const Chip = createJsonComponent<ChipProps>(chipDef)
export const Tag = createJsonComponent<TagProps>(tagDef)
export const Spinner = createJsonComponent<SpinnerProps>(spinnerDef)
export const IconWrapper = createJsonComponent<IconWrapperProps>(iconWrapperDef)
export const IconText = createJsonComponent<IconTextProps>(iconTextDef)
export const EmptyMessage = createJsonComponent<EmptyMessageProps>(emptyMessageDef)
export const Skeleton = createJsonComponent<SkeletonProps>(skeletonDef)
export const LoadingSpinner = createJsonComponent<LoadingSpinnerProps>(loadingSpinnerDef)
export const CountBadge = createJsonComponent<CountBadgeProps>(countBadgeDef)
export const DetailRow = createJsonComponent<DetailRowProps>(detailRowDef)
export const KeyValue = createJsonComponent<KeyValueProps>(keyValueDef)
export const StatusIcon = createJsonComponent<StatusIconProps>(statusIconDef)
export const ProgressBar = createJsonComponent<ProgressBarProps>(progressBarDef)

// All components converted to pure JSON! 🎉
export const PropertyEditorHeader = createJsonComponent<PropertyEditorHeaderProps>(propertyEditorHeaderDef)
export const PropertyEditorEmptyState = createJsonComponent<PropertyEditorEmptyStateProps>(propertyEditorEmptyStateDef)
export const PropertyEditorSection = createJsonComponent<PropertyEditorSectionProps>(propertyEditorSectionDef)
export const KvSourceFields = createJsonComponent<KvSourceFieldsProps>(kvSourceFieldsDef)
export const ComponentTreeEmptyState = createJsonComponent<ComponentTreeEmptyStateProps>(componentTreeEmptyStateDef)
export const ComponentTreeNodes = createJsonComponentWithHooks<ComponentTreeNodesProps>(componentTreeNodesDef, {
  hooks: {
    data: {
      hookName: "useComponentTreeNodes",
      args: (props) => [props.expandedIds]
    }
  }
})
export const ComponentTreeHeader = createJsonComponent<ComponentTreeHeaderProps>(componentTreeHeaderDef)
export const DataSourceIdField = createJsonComponent<DataSourceIdFieldProps>(dataSourceIdFieldDef)
export const StaticSourceFields = createJsonComponentWithHooks<StaticSourceFieldsProps>(staticSourceFieldsDef, {
  hooks: {
    handleChange: {
      hookName: 'useStaticSourceFields',
      args: (props) => [props.onUpdateField]
    }
  }
});
export const FlexLayout = createJsonComponent<FlexLayoutProps>(flexLayoutDef)
export const IconRenderer = createJsonComponent<IconRendererProps>(iconRendererDef)
export const ConditionalWrapper = createJsonComponent<ConditionalWrapperProps>(conditionalWrapperDef);
export const DataCard = createJsonComponent<DataCardProps>(dataCardDef)
export const Panel = createJsonComponent<PanelProps>(panelDef)
export const DynamicText = createJsonComponentWithHooks<DynamicTextProps>(dynamicTextDef, {
  hooks: {
    data: {
      hookName: 'useDynamicText',
      args: (props) => [props.value, props.format, props.currency, props.locale]
    }
  }
});
export const GridLayout = createJsonComponent<GridLayoutProps>(gridLayoutDef);
export const RepeatWrapper = createJsonComponent<RepeatWrapperProps>(repeatWrapperDef)
export const DataSourceGroupSection = createJsonComponent<DataSourceGroupSectionProps>(dataSourceGroupSectionDef)
export const DataSourceManager = createJsonComponentWithHooks<DataSourceManagerProps>(dataSourceManagerDef, { hooks: { hookData: { hookName: 'useDataSourceManager', args: (props) => [props.dataSources] } } })
export const DataSourceManagerHeader = createJsonComponent<DataSourceManagerHeaderProps>(dataSourceManagerHeaderDef)
