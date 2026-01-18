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
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { TextArea } from '@/components/atoms/TextArea'
import { List as ListComponent } from '@/components/atoms/List'
import { Grid } from '@/components/atoms/Grid'
import { Stack } from '@/components/atoms/Stack'
import { Flex } from '@/components/atoms/Flex'
import { Container } from '@/components/atoms/Container'
import { Link } from '@/components/atoms/Link'
import { Image } from '@/components/atoms/Image'
import { Avatar as AtomAvatar } from '@/components/atoms/Avatar'
import { Code } from '@/components/atoms/Code'
import { Tag } from '@/components/atoms/Tag'
import { Spinner } from '@/components/atoms/Spinner'
import { Skeleton as AtomSkeleton } from '@/components/atoms/Skeleton'
import { Slider } from '@/components/atoms/Slider'
import { NumberInput } from '@/components/atoms/NumberInput'
import { Radio } from '@/components/atoms/Radio'
import { Alert as AtomAlert } from '@/components/atoms/Alert'
import { InfoBox } from '@/components/atoms/InfoBox'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Table as AtomTable } from '@/components/atoms/Table'
import { KeyValue } from '@/components/atoms/KeyValue'
import { StatCard } from '@/components/atoms/StatCard'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import { DataCard } from '@/components/molecules/DataCard'
import { SearchInput } from '@/components/molecules/SearchInput'
import { ActionBar } from '@/components/molecules/ActionBar'
import { AppBranding } from '@/components/molecules/AppBranding'
import { LabelWithBadge } from '@/components/molecules/LabelWithBadge'
import { EmptyEditorState } from '@/components/molecules/EmptyEditorState'
import { LoadingFallback } from '@/components/molecules/LoadingFallback'
import { LoadingState } from '@/components/molecules/LoadingState'
import { NavigationGroupHeader } from '@/components/molecules/NavigationGroupHeader'
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
  Heading,
  Text,
  TextArea,
  List: ListComponent,
  Grid,
  Stack,
  Flex,
  Container,
  Link,
  Image,
  Avatar: AtomAvatar,
  Code,
  Tag,
  Spinner,
  Skeleton: AtomSkeleton,
  Slider,
  NumberInput,
  Radio,
  Alert: AtomAlert,
  InfoBox,
  EmptyState,
  Table: AtomTable,
  KeyValue,
  StatCard,
  StatusBadge,
}

export const moleculeComponents: UIComponentRegistry = {
  DataCard,
  SearchInput,
  ActionBar,
  AppBranding,
  LabelWithBadge,
  EmptyEditorState,
  LoadingFallback,
  LoadingState,
  NavigationGroupHeader,
}

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
