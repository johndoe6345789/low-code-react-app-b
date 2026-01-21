/**
 * Pure JSON components - no TypeScript wrappers needed
 * Interfaces are defined in src/lib/json-ui/interfaces/
 * JSON definitions are in src/components/json-definitions/
 */
import { createJsonComponent } from './create-json-component'
import { createJsonComponentWithHooks } from './create-json-component-with-hooks'
import type {
  BindingIndicatorProps,
  ButtonGroupProps,
  ChipProps,
  CircularProgressProps,
  CodeProps,
  CommandPaletteProps,
  CompletionCardProps,
  ComponentPaletteItemProps,
  ConfirmButtonProps,
  DataSourceBadgeProps,
  DataTableProps,
  LoadingFallbackProps,
  NavigationItemProps,
  PageHeaderContentProps,
  PageHeaderProps,
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
  BreadcrumbProps,
  ButtonProps,
  CalendarProps,
  CardProps,
  CheckboxProps,
  ContextMenuProps,
  DatePickerProps,
  DetailRowProps,
  DialogProps,
  DividerProps,
  DrawerProps,
  DropdownMenuProps,
  EmptyMessageProps,
  ErrorBadgeProps,
  FileIconProps,
  FormProps,
  FormFieldProps,
  GlowCardProps,
  HeadingProps,
  HelperTextProps,
  HoverCardProps,
  IconProps,
  InputOTPProps,
  LabelProps,
  PaginationProps,
  ProgressProps,
  ProgressBarProps,
  PulseProps,
  QuickActionButtonProps,
  RadioGroupProps,
  RangeSliderProps,
  RatingProps,
  ScrollAreaProps,
  ScrollAreaThumbProps,
  SearchInputProps,
  SeedDataStatusProps,
  SelectProps,
  SeparatorProps,
  SkeletonProps,
  SliderProps,
  SparkleProps,
  SpinnerProps,
  StatusIconProps,
  StepIndicatorProps,
  StepperProps,
  SwitchProps,
  TableProps,
  TabsProps,
  TagProps,
  TextAreaProps,
  TextGradientProps,
  TextHighlightProps,
  TimelineProps,
  TimestampProps,
  ToggleProps,
  TooltipProps,
  TabIconProps,
  TipsCardProps,
  InfoBoxProps,
  KeyValueProps,
  LiveIndicatorProps,
  ListProps,
  ListItemProps,
  LoadingSpinnerProps,
  LoadingStateProps,
  MetricDisplayProps,
  ModalProps,
  NotificationProps,
  NumberInputProps,
} from './interfaces'

// Import JSON definitions
import bindingIndicatorDef from '@/components/json-definitions/binding-indicator.json'
import buttonGroupDef from '@/components/json-definitions/button-group.json'
import chipDef from '@/components/json-definitions/chip.json'
import circularProgressDef from '@/components/json-definitions/circular-progress.json'
import codeDef from '@/components/json-definitions/code.json'
import commandPaletteDef from '@/components/json-definitions/command-palette.json'
import completionCardDef from '@/components/json-definitions/completion-card.json'
import componentPaletteItemDef from '@/components/json-definitions/component-palette-item.json'
import confirmButtonDef from '@/components/json-definitions/confirm-button.json'
import dataSourceBadgeDef from '@/components/json-definitions/data-source-badge.json'
import dataTableDef from '@/components/json-definitions/data-table.json'
import loadingFallbackDef from '@/components/json-definitions/loading-fallback.json'
import navigationItemDef from '@/components/json-definitions/navigation-item.json'
import pageHeaderContentDef from '@/components/json-definitions/page-header-content.json'
import pageHeaderDef from '@/components/json-definitions/page-header.json'
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
import breadcrumbDef from '@/components/json-definitions/breadcrumb.json'
import buttonDef from '@/components/json-definitions/button.json'
import calendarDef from '@/components/json-definitions/calendar.json'
import cardDef from '@/components/json-definitions/card.json'
import checkboxDef from '@/components/json-definitions/checkbox.json'
import contextMenuDef from '@/components/json-definitions/context-menu.json'
import dialogDef from '@/components/json-definitions/dialog.json'
import drawerDef from '@/components/json-definitions/drawer.json'
import datePickerDef from '@/components/json-definitions/date-picker.json'
import detailRowDef from '@/components/json-definitions/detail-row.json'
import dividerDef from '@/components/json-definitions/divider.json'
import emptyMessageDef from '@/components/json-definitions/empty-message.json'
import errorBadgeDef from '@/components/json-definitions/error-badge.json'
import fileIconDef from '@/components/json-definitions/file-icon.json'
import formDef from '@/components/json-definitions/form.json'
import glowCardDef from '@/components/json-definitions/glow-card.json'
import helperTextDef from '@/components/json-definitions/helper-text.json'
import dropdownMenuDef from '@/components/json-definitions/dropdown-menu.json'
import formDef from '@/components/json-definitions/form.json'
import formFieldDef from '@/components/json-definitions/form-field.json'
import headingDef from '@/components/json-definitions/heading.json'
import hoverCardDef from '@/components/json-definitions/hover-card.json'
import iconDef from '@/components/json-definitions/icon.json'
import inputOtpDef from '@/components/json-definitions/input-otp.json'
import labelDef from '@/components/json-definitions/label.json'
import paginationDef from '@/components/json-definitions/pagination.json'
import progressDef from '@/components/json-definitions/progress.json'
import progressBarDef from '@/components/json-definitions/progress-bar.json'
import pulseDef from '@/components/json-definitions/pulse.json'
import quickActionButtonDef from '@/components/json-definitions/quick-action-button.json'
import radioGroupDef from '@/components/json-definitions/radio-group.json'
import rangeSliderDef from '@/components/json-definitions/range-slider.json'
import ratingDef from '@/components/json-definitions/rating.json'
import scrollAreaDef from '@/components/json-definitions/scroll-area.json'
import scrollAreaThumbDef from '@/components/json-definitions/scroll-area-thumb.json'
import searchInputDef from '@/components/json-definitions/search-input.json'
import seedDataStatusDef from '@/components/json-definitions/seed-data-status.json'
import selectDef from '@/components/json-definitions/select.json'
import separatorDef from '@/components/json-definitions/separator.json'
import skeletonDef from '@/components/json-definitions/skeleton.json'
import sliderDef from '@/components/json-definitions/slider.json'
import sparkleDef from '@/components/json-definitions/sparkle.json'
import spinnerDef from '@/components/json-definitions/spinner.json'
import statusIconDef from '@/components/json-definitions/status-icon.json'
import stepIndicatorDef from '@/components/json-definitions/step-indicator.json'
import stepperDef from '@/components/json-definitions/stepper.json'
import switchDef from '@/components/json-definitions/switch.json'
import tableDef from '@/components/json-definitions/table.json'
import tabsDef from '@/components/json-definitions/tabs.json'
import tagDef from '@/components/json-definitions/tag.json'
import textareaDef from '@/components/json-definitions/textarea.json'
import textGradientDef from '@/components/json-definitions/text-gradient.json'
import textHighlightDef from '@/components/json-definitions/text-highlight.json'
import timelineDef from '@/components/json-definitions/timeline.json'
import timestampDef from '@/components/json-definitions/timestamp.json'
import toggleDef from '@/components/json-definitions/toggle.json'
import tooltipDef from '@/components/json-definitions/tooltip.json'
import tabIconDef from '@/components/json-definitions/tab-icon.json'
import tipsCardDef from '@/components/json-definitions/tips-card.json'
import infoBoxDef from '@/components/json-definitions/info-box.json'
import keyValueDef from '@/components/json-definitions/key-value.json'
import liveIndicatorDef from '@/components/json-definitions/live-indicator.json'
import listDef from '@/components/json-definitions/list.json'
import listItemDef from '@/components/json-definitions/list-item.json'
import loadingSpinnerDef from '@/components/json-definitions/loading-spinner.json'
import loadingStateDef from '@/components/json-definitions/loading-state.json'
import metricDisplayDef from '@/components/json-definitions/metric-display.json'
import modalDef from '@/components/json-definitions/modal.json'
import notificationDef from '@/components/json-definitions/notification.json'
import numberInputDef from '@/components/json-definitions/number-input.json'

// Create pure JSON components (no hooks)
export const BindingIndicator = createJsonComponent<BindingIndicatorProps>(bindingIndicatorDef)
export const ButtonGroup = createJsonComponent<ButtonGroupProps>(buttonGroupDef)
export const Chip = createJsonComponent<ChipProps>(chipDef)
export const CircularProgress = createJsonComponent<CircularProgressProps>(circularProgressDef)
export const Code = createJsonComponent<CodeProps>(codeDef)
export const CommandPalette = createJsonComponent<CommandPaletteProps>(commandPaletteDef)
export const CompletionCard = createJsonComponent<CompletionCardProps>(completionCardDef)
export const ComponentPaletteItem = createJsonComponent<ComponentPaletteItemProps>(componentPaletteItemDef)
export const ConfirmButton = createJsonComponent<ConfirmButtonProps>(confirmButtonDef)
export const DataSourceBadge = createJsonComponent<DataSourceBadgeProps>(dataSourceBadgeDef)
export const DataTable = createJsonComponent<DataTableProps<any>>(dataTableDef)
export const LoadingFallback = createJsonComponent<LoadingFallbackProps>(loadingFallbackDef)
export const NavigationItem = createJsonComponent<NavigationItemProps>(navigationItemDef)
export const PageHeaderContent = createJsonComponent<PageHeaderContentProps>(pageHeaderContentDef)
export const PageHeader = createJsonComponent<PageHeaderProps>(pageHeaderDef)
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
export const Breadcrumb = createJsonComponent<BreadcrumbProps>(breadcrumbDef)
export const Button = createJsonComponent<ButtonProps>(buttonDef)
export const Calendar = createJsonComponent<CalendarProps>(calendarDef)
export const Card = createJsonComponent<CardProps>(cardDef)
export const Checkbox = createJsonComponent<CheckboxProps>(checkboxDef)
export const ContextMenu = createJsonComponent<ContextMenuProps>(contextMenuDef)
export const DatePicker = createJsonComponent<DatePickerProps>(datePickerDef)
export const DetailRow = createJsonComponent<DetailRowProps>(detailRowDef)
export const Dialog = createJsonComponent<DialogProps>(dialogDef)
export const Drawer = createJsonComponent<DrawerProps>(drawerDef)
export const Divider = createJsonComponent<DividerProps>(dividerDef)
export const DropdownMenu = createJsonComponent<DropdownMenuProps>(dropdownMenuDef)
export const EmptyMessage = createJsonComponent<EmptyMessageProps>(emptyMessageDef)
export const ErrorBadge = createJsonComponent<ErrorBadgeProps>(errorBadgeDef)
export const FileIcon = createJsonComponent<FileIconProps>(fileIconDef)
export const Form = createJsonComponent<FormProps>(formDef)
export const FormField = createJsonComponent<FormFieldProps>(formFieldDef)
export const GlowCard = createJsonComponent<GlowCardProps>(glowCardDef)
export const Heading = createJsonComponent<HeadingProps>(headingDef)
export const HelperText = createJsonComponent<HelperTextProps>(helperTextDef)
export const HoverCard = createJsonComponent<HoverCardProps>(hoverCardDef)
export const Icon = createJsonComponent<IconProps>(iconDef)
export const InputOTP = createJsonComponent<InputOTPProps>(inputOtpDef)
export const Label = createJsonComponent<LabelProps>(labelDef)
export const Pagination = createJsonComponent<PaginationProps>(paginationDef)
export const Progress = createJsonComponent<ProgressProps>(progressDef)
export const ProgressBar = createJsonComponent<ProgressBarProps>(progressBarDef)
export const Pulse = createJsonComponent<PulseProps>(pulseDef)
export const QuickActionButton = createJsonComponent<QuickActionButtonProps>(quickActionButtonDef)
export const RadioGroup = createJsonComponent<RadioGroupProps>(radioGroupDef)
export const Sparkle = createJsonComponent<SparkleProps>(sparkleDef)
export const RangeSlider = createJsonComponent<RangeSliderProps>(rangeSliderDef)
export const Rating = createJsonComponent<RatingProps>(ratingDef)
export const ScrollArea = createJsonComponent<ScrollAreaProps>(scrollAreaDef)
export const ScrollAreaThumb = createJsonComponent<ScrollAreaThumbProps>(scrollAreaThumbDef)
export const SearchInput = createJsonComponent<SearchInputProps>(searchInputDef)
export const SeedDataStatus = createJsonComponent<SeedDataStatusProps>(seedDataStatusDef)
export const Select = createJsonComponent<SelectProps>(selectDef)
export const Separator = createJsonComponent<SeparatorProps>(separatorDef)
export const Skeleton = createJsonComponent<SkeletonProps>(skeletonDef)
export const Slider = createJsonComponent<SliderProps>(sliderDef)
export const Spinner = createJsonComponent<SpinnerProps>(spinnerDef)
export const StatusIcon = createJsonComponent<StatusIconProps>(statusIconDef)
export const StepIndicator = createJsonComponent<StepIndicatorProps>(stepIndicatorDef)
export const Stepper = createJsonComponent<StepperProps>(stepperDef)
export const Switch = createJsonComponent<SwitchProps>(switchDef)
export const Table = createJsonComponent<TableProps>(tableDef)
export const Tabs = createJsonComponent<TabsProps>(tabsDef)
export const Tag = createJsonComponent<TagProps>(tagDef)
export const TextArea = createJsonComponent<TextAreaProps>(textareaDef)
export const TextGradient = createJsonComponent<TextGradientProps>(textGradientDef)
export const TextHighlight = createJsonComponent<TextHighlightProps>(textHighlightDef)
export const Timeline = createJsonComponent<TimelineProps>(timelineDef)
export const Timestamp = createJsonComponent<TimestampProps>(timestampDef)
export const Toggle = createJsonComponent<ToggleProps>(toggleDef)
export const Tooltip = createJsonComponent<TooltipProps>(tooltipDef)
export const TabIcon = createJsonComponent<TabIconProps>(tabIconDef)
export const TipsCard = createJsonComponent<TipsCardProps>(tipsCardDef)
export const InfoBox = createJsonComponent<InfoBoxProps>(infoBoxDef)
export const KeyValue = createJsonComponent<KeyValueProps>(keyValueDef)
export const LiveIndicator = createJsonComponent<LiveIndicatorProps>(liveIndicatorDef)
export const List = createJsonComponent<ListProps<any>>(listDef)
export const ListItem = createJsonComponent<ListItemProps>(listItemDef)
export const LoadingSpinner = createJsonComponent<LoadingSpinnerProps>(loadingSpinnerDef)
export const LoadingState = createJsonComponent<LoadingStateProps>(loadingStateDef)
export const MetricDisplay = createJsonComponent<MetricDisplayProps>(metricDisplayDef)
export const Modal = createJsonComponent<ModalProps>(modalDef)
export const Notification = createJsonComponent<NotificationProps>(notificationDef)
export const NumberInput = createJsonComponent<NumberInputProps>(numberInputDef)

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
