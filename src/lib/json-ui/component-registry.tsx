import { ComponentType } from '@/types/json-ui'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { TextArea } from '@/components/atoms/TextArea'
import { List } from '@/components/atoms/List'
import { Grid } from '@/components/atoms/Grid'
import { Stack } from '@/components/atoms/Stack'
import { Flex } from '@/components/atoms/Flex'
import { Container } from '@/components/atoms/Container'
import { Link } from '@/components/atoms/Link'
import { Image } from '@/components/atoms/Image'
import { Avatar } from '@/components/atoms/Avatar'
import { Code } from '@/components/atoms/Code'
import { Tag } from '@/components/atoms/Tag'
import { Spinner } from '@/components/atoms/Spinner'
import { Skeleton } from '@/components/atoms/Skeleton'
import { Slider } from '@/components/atoms/Slider'
import { NumberInput } from '@/components/atoms/NumberInput'
import { Radio } from '@/components/atoms/Radio'
import { Alert } from '@/components/atoms/Alert'
import { InfoBox } from '@/components/atoms/InfoBox'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Table } from '@/components/atoms/Table'
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

export const componentRegistry: Record<ComponentType, any> = {
  'div': 'div',
  'section': 'section',
  'article': 'article',
  'header': 'header',
  'footer': 'footer',
  'main': 'main',
  'Button': Button,
  'Card': Card,
  'Input': Input,
  'TextArea': TextArea,
  'Select': Select,
  'Checkbox': Checkbox,
  'Radio': Radio,
  'Switch': Switch,
  'Slider': Slider,
  'NumberInput': NumberInput,
  'Badge': Badge,
  'Tag': Tag,
  'Progress': Progress,
  'Separator': Separator,
  'Tabs': Tabs,
  'Dialog': 'div',
  'Text': Text,
  'Heading': Heading,
  'Label': Label,
  'Link': Link,
  'Image': Image,
  'Avatar': Avatar,
  'Code': Code,
  'Spinner': Spinner,
  'Skeleton': Skeleton,
  'List': List,
  'Grid': Grid,
  'Stack': Stack,
  'Flex': Flex,
  'Container': Container,
  'Alert': Alert,
  'InfoBox': InfoBox,
  'EmptyState': EmptyState,
  'StatusBadge': StatusBadge,
  'Table': Table,
  'KeyValue': KeyValue,
  'StatCard': StatCard,
  'DataCard': DataCard,
  'SearchInput': SearchInput,
  'ActionBar': ActionBar,
  'AppBranding': AppBranding,
  'LabelWithBadge': LabelWithBadge,
  'EmptyEditorState': EmptyEditorState,
  'LoadingFallback': LoadingFallback,
  'LoadingState': LoadingState,
  'NavigationGroupHeader': NavigationGroupHeader,
}

export const cardSubComponents = {
  'CardHeader': CardHeader,
  'CardTitle': CardTitle,
  'CardDescription': CardDescription,
  'CardContent': CardContent,
  'CardFooter': CardFooter,
}

export const tabsSubComponents = {
  'TabsContent': TabsContent,
  'TabsList': TabsList,
  'TabsTrigger': TabsTrigger,
}

export const customComponents = {
  'StatusBadge': StatusBadge,
  'DataCard': DataCard,
  'SearchInput': SearchInput,
  'ActionBar': ActionBar,
  'StatCard': StatCard,
  'KeyValue': KeyValue,
  'Table': Table,
  'Alert': Alert,
  'InfoBox': InfoBox,
  'EmptyState': EmptyState,
  'AppBranding': AppBranding,
  'LabelWithBadge': LabelWithBadge,
  'EmptyEditorState': EmptyEditorState,
  'LoadingFallback': LoadingFallback,
  'LoadingState': LoadingState,
  'NavigationGroupHeader': NavigationGroupHeader,
}

export function getComponent(type: ComponentType | string): any {
  if (type in componentRegistry) {
    return componentRegistry[type as ComponentType]
  }
  
  if (type in cardSubComponents) {
    return cardSubComponents[type as keyof typeof cardSubComponents]
  }
  
  if (type in tabsSubComponents) {
    return tabsSubComponents[type as keyof typeof tabsSubComponents]
  }
  
  if (type in customComponents) {
    return customComponents[type as keyof typeof customComponents]
  }
  
  return 'div'
}

export const getUIComponent = getComponent

