export function SassComponentItem({ name, classes, description }: { name: string; classes: string[]; description: string }) {
  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="space-y-1">
        {classes.map((cls) => (
          <code key={cls} className="text-xs font-mono text-accent block">{cls}</code>
        ))}
      </div>
    </div>
  )
}

export function AnimationItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="space-y-1 p-3 border rounded-lg bg-card">
      <code className="text-xs font-mono text-accent">{name}</code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
