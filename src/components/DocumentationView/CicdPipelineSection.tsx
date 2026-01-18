import cicdData from '@/data/documentation/cicd-data.json'
import { PipelineStageCard } from './CicdItems'

export function CicdPipelineSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Pipeline Stages</h2>
      <p className="text-foreground/90 leading-relaxed">{cicdData.pipeline.intro}</p>
      <div className="grid gap-3">
        {cicdData.pipeline.stages.map((stage) => (
          <PipelineStageCard
            key={stage.stage}
            stage={stage.stage}
            description={stage.description}
            duration={stage.duration}
          />
        ))}
      </div>
    </div>
  )
}
