import { Code } from '@phosphor-icons/react'

export function AppLogo() {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
      <Code size={20} weight="duotone" className="text-white sm:w-6 sm:h-6" />
    </div>
  )
}
