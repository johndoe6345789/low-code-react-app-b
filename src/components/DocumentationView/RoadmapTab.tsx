import { Separator } from '@/components/ui/separator'
import { CheckCircle, Clock, MapPin } from '@phosphor-icons/react'
import roadmapData from '@/data/documentation/roadmap-data.json'
import { RoadmapItem } from './RoadmapItem'

const sections = [
  {
    key: 'completed',
    title: roadmapData.sections.completedTitle,
    icon: <CheckCircle size={24} weight="fill" className="text-green-500" />,
    items: roadmapData.completed
  },
  {
    key: 'planned',
    title: roadmapData.sections.plannedTitle,
    icon: <Clock size={24} weight="duotone" className="text-accent" />,
    items: roadmapData.planned
  }
]

export function RoadmapTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <MapPin size={36} weight="duotone" className="text-accent" />
          {roadmapData.title}
        </h1>
        <p className="text-lg text-muted-foreground">{roadmapData.subtitle}</p>

        <Separator />

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.key}>
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <div className="space-y-3 ml-9">
                {section.items.map((item) => (
                  <RoadmapItem
                    key={`${section.key}-${item.title}`}
                    status={section.key === 'completed' ? 'completed' : 'planned'}
                    title={item.title}
                    description={item.description}
                    version={item.version}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
