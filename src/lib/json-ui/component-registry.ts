import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { List as ListComponent } from '@/components/atoms/List'
import { Grid } from '@/components/atoms/Grid'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import { DataCard } from '@/components/molecules/DataCard'
import { SearchInput } from '@/components/molecules/SearchInput'
import { ActionBar } from '@/components/molecules/ActionBar'
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
  Alert,
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
  Table,
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
  Skeleton,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
}

export const customComponents: UIComponentRegistry = {
  Heading,
  Text,
  List: ListComponent,
  Grid,
  StatusBadge,
  DataCard,
  SearchInput,
  ActionBar,
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
  ...customComponents,
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
