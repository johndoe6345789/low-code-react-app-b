import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Code, Database, Tree, PaintBrush, Flask, Play, Cube, Wrench, Gear, Rocket, Lightbulb, CheckCircle } from '@phosphor-icons/react'
import { AIFeatureCard } from './AIFeatureCard'
import { FeatureItem } from './FeatureItem'
import readmeData from '@/data/documentation/readme-data.json'

const Sparkle = ({ size }: { size: number }) => <span style={{ fontSize: size }}>✨</span>

const iconMap: Record<string, any> = {
  Code, Database, Tree, PaintBrush, Flask, Play, Cube, Wrench, Gear, Sparkle
}

export function ReadmeTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Code size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{readmeData.title}</h1>
            <p className="text-lg text-muted-foreground">{readmeData.subtitle}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{readmeData.sections.overviewTitle}</h2>
          <p className="text-foreground/90 leading-relaxed">{readmeData.overview}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket size={20} weight="duotone" />
              {readmeData.sections.featuresTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {readmeData.features.map((feature, idx) => {
              const Icon = iconMap[feature.icon] || Code
              return (
                <FeatureItem
                  key={idx}
                  icon={<Icon size={18} />}
                  title={feature.title}
                  description={feature.description}
                />
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{readmeData.sections.gettingStartedTitle}</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              {readmeData.gettingStarted.map((step) => (
                <div key={step.step} className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                      {step.step}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground ml-8">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{readmeData.sections.aiFeaturesTitle}</h2>
          <p className="text-foreground/90 leading-relaxed">
            {readmeData.sections.aiFeaturesDescription}
          </p>
          <div className="grid gap-3">
            {readmeData.aiFeatures.map((feature, idx) => (
              <AIFeatureCard key={idx} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{readmeData.sections.techStackTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{readmeData.sections.techStackFrontendTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {readmeData.techStack.frontend.map((tech, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} weight="fill" className="text-accent" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{readmeData.sections.techStackBackendTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {readmeData.techStack.backend.map((tech, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} weight="fill" className="text-accent" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={20} weight="duotone" className="text-accent" />
              {readmeData.sections.proTipsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {readmeData.proTips.map((tip, idx) => (
              <p key={idx}>{tip}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
