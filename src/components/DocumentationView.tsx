import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { BookOpen, GitBranch, MagnifyingGlass, MapPin, Sparkle, PaintBrush, Rocket } from '@phosphor-icons/react'
import { AgentsTab } from './DocumentationView/AgentsTab'
import { CicdTab } from './DocumentationView/CicdTab'
import { PwaTab } from './DocumentationView/PwaTab'
import { ReadmeTab } from './DocumentationView/ReadmeTab'
import { RoadmapTab } from './DocumentationView/RoadmapTab'
import { SassTab } from './DocumentationView/SassTab'

const tabs = [
  { value: 'readme', label: 'README', icon: <BookOpen size={16} /> },
  { value: 'roadmap', label: 'Roadmap', icon: <MapPin size={16} /> },
  { value: 'agents', label: 'Agents', icon: <Sparkle size={16} /> },
  { value: 'pwa', label: 'PWA', icon: <Rocket size={16} /> },
  { value: 'sass', label: 'Sass', icon: <PaintBrush size={16} /> },
  { value: 'cicd', label: 'CI/CD', icon: <GitBranch size={16} /> }
]

export function DocumentationView() {
  const [activeTab, setActiveTab] = useState('readme')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6 py-3 space-y-3">
          <TabsList className="bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-8">
            <TabsContent value="readme" className="m-0 space-y-6">
              <ReadmeTab />
            </TabsContent>
            <TabsContent value="roadmap" className="m-0 space-y-6">
              <RoadmapTab />
            </TabsContent>
            <TabsContent value="agents" className="m-0 space-y-6">
              <AgentsTab />
            </TabsContent>
            <TabsContent value="pwa" className="m-0 space-y-6">
              <PwaTab />
            </TabsContent>
            <TabsContent value="sass" className="m-0 space-y-6">
              <SassTab />
            </TabsContent>
            <TabsContent value="cicd" className="m-0 space-y-6">
              <CicdTab />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
