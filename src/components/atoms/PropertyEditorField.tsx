import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface PropertyEditorFieldProps {
  label: string
  name: string
  value: any
  type?: 'text' | 'number' | 'boolean' | 'select' | 'textarea'
  options?: Array<{ label: string; value: string }>
  onChange: (name: string, value: any) => void
}

export function PropertyEditorField({
  label,
  name,
  value,
  type = 'text',
  options,
  onChange,
}: PropertyEditorFieldProps) {
  const renderField = () => {
    switch (type) {
      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => onChange(name, checked)}
          />
        )
      
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => onChange(name, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(name, Number(e.target.value))}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            rows={3}
          />
        )
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      {renderField()}
    </div>
  )
}
