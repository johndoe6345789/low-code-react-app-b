import { Sparkle } from '@phosphor-icons/react'

export function IntegrationPoint({ component, capabilities }: { component: string; capabilities: string[] }) {
  return (
    <div className="space-y-2 border rounded-lg p-4 bg-card">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Sparkle size={16} weight="duotone" className="text-accent" />
        {component}
      </h4>
      <ul className="space-y-1">
        {capabilities.map((capability, idx) => (
          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>{capability}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
