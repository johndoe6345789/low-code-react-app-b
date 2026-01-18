export function SassComponentItem({ name, classes, description }: { name: string; classes: string[]; description: string }) {
  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="space-y-1">
        {classes.map((cls, idx) => (
          <code key={idx} className="text-xs font-mono text-accent block">{cls}</code>
        ))}
      </div>
    </div>
  )
}
