import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOtp } from '@/components/ui/input-otp'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Carousel } from '@/components/ui/carousel'
import { ChartContainer as Chart } from '@/components/ui/chart'
import { Collapsible } from '@/components/ui/collapsible'
import { Command } from '@/components/ui/command'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Menubar } from '@/components/ui/menubar'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton as ShadcnSkeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Pagination } from '@/components/ui/pagination'
import { ResizablePanelGroup as Resizable } from '@/components/ui/resizable'
import { Sheet } from '@/components/ui/sheet'
import { Sidebar } from '@/components/ui/sidebar'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircularProgress, Divider, ProgressBar } from '@/components/atoms'
import * as AtomComponents from '@/components/atoms'
import * as MoleculeComponents from '@/components/molecules'
import * as OrganismComponents from '@/components/organisms'
import {
  ComponentBindingDialogWrapper,
  ComponentTreeWrapper,
  DataSourceEditorDialogWrapper,
  GitHubBuildStatusWrapper,
  LazyBarChartWrapper,
  LazyD3BarChartWrapper,
  LazyLineChartWrapper,
  SaveIndicatorWrapper,
  SeedDataManagerWrapper,
  StorageSettingsWrapper,
} from '@/lib/json-ui/wrappers'
import jsonComponentsRegistry from '../../../json-components-registry.json'
import { 
  ArrowLeft, ArrowRight, Check, X, Plus, Minus, MagnifyingGlass, 
  Funnel, Download, Upload, PencilSimple, Trash, Eye, EyeClosed, 
  CaretUp, CaretDown, CaretLeft, CaretRight,
  Gear, User, Bell, Envelope, Calendar, Clock, Star,
  Heart, ShareNetwork, LinkSimple, Copy, FloppyDisk, ArrowClockwise, WarningCircle,
  Info, Question, House, List as ListIcon, DotsThreeVertical, DotsThree
} from '@phosphor-icons/react'

export interface UIComponentRegistry {
  [key: string]: ComponentType<any>
}

interface JsonRegistryEntry {
  name?: string
  type?: string
  export?: string
  source?: string
  status?: string
  wrapperRequired?: boolean
  wrapperComponent?: string
  wrapperFor?: string
  deprecated?: DeprecatedComponentInfo
}

interface JsonComponentRegistry {
  components?: JsonRegistryEntry[]
}

export interface DeprecatedComponentInfo {
  replacedBy?: string
  message?: string
}

const jsonRegistry = jsonComponentsRegistry as JsonComponentRegistry

const getRegistryEntryName = (entry: JsonRegistryEntry): string | undefined =>
  entry.export ?? entry.name ?? entry.type

const buildRegistryFromNames = (
  names: string[],
  components: Record<string, ComponentType<any>>
): UIComponentRegistry => {
  return names.reduce<UIComponentRegistry>((registry, name) => {
    const component = components[name]
    if (component) {
      registry[name] = component
    }
    return registry
  }, {})
}

const jsonRegistryEntries = jsonRegistry.components ?? []
const registryEntryByType = new Map(
  jsonRegistryEntries
    .map((entry) => {
      const entryName = getRegistryEntryName(entry)
      return entryName ? [entryName, entry] : null
    })
    .filter((entry): entry is [string, JsonRegistryEntry] => Boolean(entry))
)
const atomComponentMap = AtomComponents as Record<string, ComponentType<any>>
const deprecatedComponentInfo = jsonRegistryEntries.reduce<Record<string, DeprecatedComponentInfo>>(
  (acc, entry) => {
    const entryName = getRegistryEntryName(entry)
    if (!entryName) {
      return acc
    }
    if (entry.status === 'deprecated' || entry.deprecated) {
      acc[entryName] = entry.deprecated ?? {}
    }
    return acc
  },
  {}
)
const atomRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'atoms')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))
const moleculeRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'molecules')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))
const organismRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'organisms')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))
const shadcnRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'ui')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))
const wrapperRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'wrappers')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))
const iconRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'icons')
  .map((entry) => getRegistryEntryName(entry))
  .filter((name): name is string => Boolean(name))

export const primitiveComponents: UIComponentRegistry = {
  div: 'div' as any,
  span: 'span' as any,
  p: 'p' as any,
  h1: 'h1' as any,
  h2: 'h2' as any,
  h3: 'h3' as any,
  h4: 'h4' as any,
  h5: 'h5' as any,
  h6: 'h6' as any,
  section: 'section' as any,
  article: 'article' as any,
  header: 'header' as any,
  footer: 'footer' as any,
  main: 'main' as any,
  aside: 'aside' as any,
  nav: 'nav' as any,
}

const shadcnComponentMap: Record<string, ComponentType<any>> = {
  AlertDialog,
  AspectRatio,
  Button,
  Carousel,
  Chart,
  Collapsible,
  Command,
  DropdownMenu,
  Input,
  InputOtp,
  Textarea,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Separator,
  Alert: ShadcnAlert,
  AlertDescription,
  AlertTitle,
  Switch,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table: ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Menubar,
  NavigationMenu,
  Skeleton: ShadcnSkeleton,
  Pagination,
  Progress,
  Resizable,
  Sheet,
  Sidebar,
  Sonner,
  ToggleGroup,
  Avatar: ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
}

export const shadcnComponents: UIComponentRegistry = buildRegistryFromNames(
  shadcnRegistryNames,
  shadcnComponentMap
)

export const atomComponents: UIComponentRegistry = {
  ...buildRegistryFromNames(
    atomRegistryNames,
    atomComponentMap
  ),
  DatePicker: atomComponentMap.DatePicker,
  FileUpload: atomComponentMap.FileUpload,
  CircularProgress,
  Divider,
  ProgressBar,
  DataList: (AtomComponents as Record<string, ComponentType<any>>).DataList,
  DataTable: (AtomComponents as Record<string, ComponentType<any>>).DataTable,
  ListItem: (AtomComponents as Record<string, ComponentType<any>>).ListItem,
  MetricCard: (AtomComponents as Record<string, ComponentType<any>>).MetricCard,
  Timeline: (AtomComponents as Record<string, ComponentType<any>>).Timeline,
}

const breadcrumbComponent = AtomComponents.Breadcrumb ?? AtomComponents.BreadcrumbNav
if (breadcrumbComponent) {
  atomComponents.Breadcrumb = breadcrumbComponent as ComponentType<any>
}

export const moleculeComponents: UIComponentRegistry = {
  ...buildRegistryFromNames(
    moleculeRegistryNames,
    MoleculeComponents as Record<string, ComponentType<any>>
  ),
  AppBranding: (MoleculeComponents as Record<string, ComponentType<any>>).AppBranding,
  LabelWithBadge: (MoleculeComponents as Record<string, ComponentType<any>>).LabelWithBadge,
  NavigationGroupHeader: (MoleculeComponents as Record<string, ComponentType<any>>).NavigationGroupHeader,
}

export const organismComponents: UIComponentRegistry = buildRegistryFromNames(
  organismRegistryNames,
  OrganismComponents as Record<string, ComponentType<any>>
)

const wrapperComponentMap: Record<string, ComponentType<any>> = {
  ComponentBindingDialogWrapper,
  ComponentTreeWrapper,
  DataSourceEditorDialogWrapper,
  GitHubBuildStatusWrapper,
  SaveIndicatorWrapper,
  LazyBarChartWrapper,
  LazyLineChartWrapper,
  LazyD3BarChartWrapper,
  SeedDataManagerWrapper,
  StorageSettingsWrapper,
}

export const jsonWrapperComponents: UIComponentRegistry = buildRegistryFromNames(
  wrapperRegistryNames,
  wrapperComponentMap
)

const iconComponentMap: Record<string, ComponentType<any>> = {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Plus,
  Minus,
  Search: MagnifyingGlass,
  Filter: Funnel,
  Download,
  Upload,
  Edit: PencilSimple,
  Trash,
  Eye,
  EyeOff: EyeClosed,
  ChevronUp: CaretUp,
  ChevronDown: CaretDown,
  ChevronLeft: CaretLeft,
  ChevronRight: CaretRight,
  Settings: Gear,
  User,
  Bell,
  Mail: Envelope,
  Calendar,
  Clock,
  Star,
  Heart,
  Share: ShareNetwork,
  Link: LinkSimple,
  Copy,
  Save: FloppyDisk,
  RefreshCw: ArrowClockwise,
  AlertCircle: WarningCircle,
  Info,
  HelpCircle: Question,
  Home: House,
  Menu: ListIcon,
  MoreVertical: DotsThreeVertical,
  MoreHorizontal: DotsThree,
}

export const iconComponents: UIComponentRegistry = buildRegistryFromNames(
  iconRegistryNames,
  iconComponentMap
)

export const uiComponentRegistry: UIComponentRegistry = {
  ...primitiveComponents,
  ...shadcnComponents,
  ...atomComponents,
  ...moleculeComponents,
  ...organismComponents,
  ...jsonWrapperComponents,
  ...iconComponents,
}

export function registerComponent(name: string, component: ComponentType<any>) {
  uiComponentRegistry[name] = component
}

const resolveWrapperComponent = (type: string): ComponentType<any> | null => {
  const entry = registryEntryByType.get(type)
  if (entry?.wrapperRequired && entry.wrapperComponent) {
    return uiComponentRegistry[entry.wrapperComponent] || null
  }
  return null
}

export function getUIComponent(type: string): ComponentType<any> | string | null {
  return resolveWrapperComponent(type) ?? uiComponentRegistry[type] ?? null
}

export function hasComponent(type: string): boolean {
  return Boolean(resolveWrapperComponent(type) ?? uiComponentRegistry[type])
}

export function getDeprecatedComponentInfo(type: string): DeprecatedComponentInfo | null {
  return deprecatedComponentInfo[type] ?? null
}
