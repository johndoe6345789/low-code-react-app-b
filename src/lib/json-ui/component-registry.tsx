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
  'Select': Select,
  'Checkbox': Checkbox,
  'Switch': Switch,
  'Badge': Badge,
  'Progress': Progress,
  'Separator': Separator,
  'Tabs': Tabs,
  'Dialog': 'div',
  'Text': 'p',
  'Heading': 'h2',
  'Label': Label,
  'List': 'ul',
  'Grid': 'div',
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
  
  return 'div'
}
