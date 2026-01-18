import { FileCode, CheckCircle } from '@phosphor-icons/react'

export function AgentFileItem({ filename, path, description, features }: {
  filename: string
  path: string
  description: string
  features: string[]
}) {
  return (
    <div className="space-y-3 border-l-2 border-accent pl-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-accent" />
          <code className="text-sm font-semibold text-accent">{filename}</code>
        </div>
        <p className="text-xs text-muted-foreground font-mono">{path}</p>
        <p className="text-sm text-foreground/90">{description}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features:</p>
        <ul className="space-y-1">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
              <CheckCircle size={14} weight="fill" className="text-accent mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
