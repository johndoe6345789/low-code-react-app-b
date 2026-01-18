import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton as ShadcnSkeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import * as AtomComponents from '@/components/atoms'
import * as MoleculeComponents from '@/components/molecules'
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
}

interface JsonComponentRegistry {
  components?: JsonRegistryEntry[]
}

const jsonRegistry = jsonComponentsRegistry as JsonComponentRegistry

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
const atomRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'atoms')
  .map((entry) => entry.export ?? entry.name ?? entry.type)
  .filter((name): name is string => Boolean(name))
const moleculeRegistryNames = jsonRegistryEntries
  .filter((entry) => entry.source === 'molecules')
  .map((entry) => entry.export ?? entry.name ?? entry.type)
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

export const shadcnComponents: UIComponentRegistry = {
  Button,
  Input,
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
  Skeleton: ShadcnSkeleton,
  Progress,
  Avatar: ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
}

export const atomComponents: UIComponentRegistry = {
  ...buildRegistryFromNames(
    atomRegistryNames,
    AtomComponents as Record<string, ComponentType<any>>
  ),
  DataList: (AtomComponents as Record<string, ComponentType<any>>).DataList,
  DataTable: (AtomComponents as Record<string, ComponentType<any>>).DataTable,
  MetricCard: (AtomComponents as Record<string, ComponentType<any>>).MetricCard,
  Timeline: (AtomComponents as Record<string, ComponentType<any>>).Timeline,
}

const breadcrumbComponent = AtomComponents.Breadcrumb ?? AtomComponents.BreadcrumbNav
if (breadcrumbComponent) {
  atomComponents.Breadcrumb = breadcrumbComponent as ComponentType<any>
}

export const moleculeComponents: UIComponentRegistry = buildRegistryFromNames(
  moleculeRegistryNames,
  MoleculeComponents as Record<string, ComponentType<any>>
)

export const iconComponents: UIComponentRegistry = {
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

export const uiComponentRegistry: UIComponentRegistry = {
  ...primitiveComponents,
  ...shadcnComponents,
  ...atomComponents,
  ...moleculeComponents,
  ...iconComponents,
}

export function registerComponent(name: string, component: ComponentType<any>) {
  uiComponentRegistry[name] = component
}

export function getUIComponent(type: string): ComponentType<any> | string | null {
  return uiComponentRegistry[type] || null
}

export function hasComponent(type: string): boolean {
  return type in uiComponentRegistry
}
