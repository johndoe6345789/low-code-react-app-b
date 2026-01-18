export function AnimationItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="space-y-1 p-3 border rounded-lg bg-card">
      <code className="text-xs font-mono text-accent">{name}</code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
