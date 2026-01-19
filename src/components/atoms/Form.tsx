import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { ReactNode } from 'react'

interface FormProps {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void | Promise<void>
  children: ReactNode
  className?: string
}

export function Form({ form, onSubmit, children, className }: FormProps) {
  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </ShadcnForm>
  )
}

export { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage }
