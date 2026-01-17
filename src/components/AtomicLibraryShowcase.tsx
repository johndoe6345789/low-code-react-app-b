import { useState } from 'react'
import {
  Button,
  Badge,
  Switch,
  Separator,
  HoverCard,
  Calendar,
  ButtonGroup,
  DatePicker,
  RangeSlider,
  InfoPanel,
  ResponsiveGrid,
  Flex,
  CircularProgress,
  AvatarGroup,
  Heading,
  Text,
  Stack,
  Card,
  Chip,
  Dot,
  Tooltip,
  Alert,
  ProgressBar,
  Skeleton,
  Code,
  Kbd,
  Avatar,
  Link,
  Container,
  Section,
  Spacer,
  Rating,
  ColorSwatch,
  MetricCard,
  CountBadge,
  FilterInput,
  BasicPageHeader,
  IconButton,
  ActionButton,
  StatusBadge,
  NumberInput,
  TextGradient,
  Pulse,
  QuickActionButton,
  PanelHeader,
  LiveIndicator,
  Sparkle,
  GlowCard,
} from '@/components/atoms'
import { 
  Heart, 
  Star, 
  Plus, 
  Trash, 
  Download,
  ShoppingCart,
  User,
  Bell,
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
  Rocket,
  Code as CodeIcon,
} from '@phosphor-icons/react'

export function AtomicLibraryShowcase() {
  const [switchChecked, setSwitchChecked] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80])
  const [filterValue, setFilterValue] = useState('')
  const [rating, setRating] = useState(3)
  const [numberValue, setNumberValue] = useState(10)

  return (
    <Container size="xl" className="py-8">
      <BasicPageHeader
        title="Atomic Component Library"
        description="Comprehensive collection of reusable atomic components"
      />

      <Stack direction="vertical" spacing="xl">
        <Section spacing="lg">
          <Heading level={2}>Buttons & Actions</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Button Variants</Text>
              <Flex gap="md" wrap="wrap">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="default" loading>Loading</Button>
                <Button variant="default" leftIcon={<Plus />}>With Icon</Button>
                <Button variant="default" rightIcon={<Download />}>Download</Button>
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Button Group</Text>
              <ButtonGroup>
                <Button variant="outline" size="sm">Left</Button>
                <Button variant="outline" size="sm">Middle</Button>
                <Button variant="outline" size="sm">Right</Button>
              </ButtonGroup>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Icon Buttons</Text>
              <Flex gap="sm">
                <IconButton icon={<Heart />} variant="default" />
                <IconButton icon={<Star />} variant="secondary" />
                <IconButton icon={<Plus />} variant="outline" />
                <IconButton icon={<Trash />} variant="destructive" />
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Action Buttons</Text>
              <Flex gap="md" wrap="wrap">
                <ActionButton 
                  icon={<Heart />} 
                  label="Like" 
                  onClick={() => {}} 
                  tooltip="Like this item"
                />
                <ActionButton 
                  icon={<Star />} 
                  label="Favorite" 
                  onClick={() => {}} 
                  variant="outline"
                />
              </Flex>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Badges & Indicators</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Badges</Text>
              <Flex gap="sm" wrap="wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge icon={<Star />}>With Icon</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="lg">Large</Badge>
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Status Badges</Text>
              <Flex gap="sm" wrap="wrap">
                <StatusBadge status="active" />
                <StatusBadge status="inactive" />
                <StatusBadge status="pending" />
                <StatusBadge status="error" />
                <StatusBadge status="success" />
                <StatusBadge status="warning" />
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Chips</Text>
              <Flex gap="sm" wrap="wrap">
                <Chip variant="primary">React</Chip>
                <Chip variant="accent">TypeScript</Chip>
                <Chip variant="muted">Tailwind</Chip>
                <Chip variant="default" onRemove={() => {}}>Removable</Chip>
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Dots</Text>
              <Flex gap="md" align="center">
                <Dot variant="default" />
                <Dot variant="primary" />
                <Dot variant="accent" />
                <Dot variant="success" pulse />
                <Dot variant="warning" pulse />
                <Dot variant="error" pulse />
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Count Badge</Text>
              <Flex gap="md">
                <div className="flex items-center">
                  <Text>Notifications</Text>
                  <CountBadge count={5} />
                </div>
                <div className="flex items-center">
                  <Text>Messages</Text>
                  <CountBadge count={99} max={99} variant="destructive" />
                </div>
              </Flex>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Typography</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Headings</Text>
              <Stack direction="vertical" spacing="sm">
                <Heading level={1}>Heading 1</Heading>
                <Heading level={2}>Heading 2</Heading>
                <Heading level={3}>Heading 3</Heading>
                <Heading level={4}>Heading 4</Heading>
                <Heading level={5}>Heading 5</Heading>
                <Heading level={6}>Heading 6</Heading>
              </Stack>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Text Variants</Text>
              <Stack direction="vertical" spacing="sm">
                <Text variant="body">Body text - regular content</Text>
                <Text variant="caption">Caption text - smaller descriptive text</Text>
                <Text variant="muted">Muted text - less important information</Text>
                <Text variant="small">Small text - compact information</Text>
              </Stack>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Inline Elements</Text>
              <Stack direction="vertical" spacing="sm">
                <Text>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search</Text>
                <Text>Run <Code inline>npm install</Code> to get started</Text>
                <Text>Visit <Link href="#">our documentation</Link> to learn more</Text>
              </Stack>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Form Controls</Heading>
          <Separator />
          <ResponsiveGrid columns={2} gap="lg">
            <div>
              <Text variant="muted" className="mb-2">Switch</Text>
              <Switch 
                checked={switchChecked} 
                onCheckedChange={setSwitchChecked}
                label="Enable notifications"
                description="Receive updates about your account"
              />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Date Picker</Text>
              <DatePicker 
                value={selectedDate} 
                onChange={setSelectedDate}
                placeholder="Select a date"
              />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Filter Input</Text>
              <FilterInput
                value={filterValue}
                onChange={setFilterValue}
                placeholder="Filter items..."
              />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Rating</Text>
              <Rating value={rating} onChange={setRating} />
            </div>
          </ResponsiveGrid>

          <Spacer size="md" axis="vertical" />

          <div>
            <Text variant="muted" className="mb-2">Range Slider</Text>
            <RangeSlider
              value={rangeValue}
              onChange={setRangeValue}
              label="Price Range"
              showValue
            />
          </div>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Progress & Loading</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Progress Bar</Text>
              <ProgressBar value={65} showLabel />
              <Spacer size="sm" axis="vertical" />
              <ProgressBar value={80} variant="accent" size="sm" />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Circular Progress</Text>
              <Flex gap="lg">
                <CircularProgress value={25} size="sm" />
                <CircularProgress value={50} size="md" />
                <CircularProgress value={75} size="lg" />
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Skeleton Loading</Text>
              <Stack direction="vertical" spacing="sm">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rounded" width="100%" height={100} />
              </Stack>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Feedback</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <Alert variant="info" title="Information">
              This is an informational alert message.
            </Alert>
            <Alert variant="success" title="Success">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review your input before submitting.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>

            <Spacer size="sm" axis="vertical" />

            <ResponsiveGrid columns={2} gap="md">
              <InfoPanel variant="info" title="Info Panel" icon={<Info />}>
                This is an informational panel with helpful content.
              </InfoPanel>
              <InfoPanel variant="success" title="Success Panel" icon={<CheckCircle />}>
                Operation completed successfully!
              </InfoPanel>
              <InfoPanel variant="warning" title="Warning Panel" icon={<WarningCircle />}>
                Please proceed with caution.
              </InfoPanel>
              <InfoPanel variant="error" title="Error Panel" icon={<XCircle />}>
                An error has occurred.
              </InfoPanel>
            </ResponsiveGrid>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Avatars & User Elements</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Avatar Sizes</Text>
              <Flex gap="md" align="center">
                <Avatar fallback="XS" size="xs" />
                <Avatar fallback="SM" size="sm" />
                <Avatar fallback="MD" size="md" />
                <Avatar fallback="LG" size="lg" />
                <Avatar fallback="XL" size="xl" />
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Avatar Group</Text>
              <AvatarGroup
                avatars={[
                  { fallback: 'JD', alt: 'John Doe' },
                  { fallback: 'AS', alt: 'Alice Smith' },
                  { fallback: 'BJ', alt: 'Bob Jones' },
                  { fallback: 'MK', alt: 'Mary Kay' },
                  { fallback: 'TW', alt: 'Tom Wilson' },
                  { fallback: 'SB', alt: 'Sarah Brown' },
                  { fallback: 'PG', alt: 'Paul Green' },
                ]}
                max={5}
              />
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Cards & Metrics</Heading>
          <Separator />
          <ResponsiveGrid columns={3} gap="lg">
            <MetricCard
              label="Total Users"
              value="12,345"
              icon={<User size={24} />}
              trend={{ value: 12, direction: 'up' }}
            />
            <MetricCard
              label="Orders"
              value="1,234"
              icon={<ShoppingCart size={24} />}
              trend={{ value: 5, direction: 'up' }}
            />
            <MetricCard
              label="Notifications"
              value="45"
              icon={<Bell size={24} />}
            />
          </ResponsiveGrid>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Interactive Elements</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Hover Card</Text>
              <HoverCard
                trigger={
                  <Button variant="outline">Hover over me</Button>
                }
              >
                <Stack direction="vertical" spacing="sm">
                  <Heading level={5}>Additional Information</Heading>
                  <Text variant="muted">
                    This is extra content shown in a hover card.
                  </Text>
                </Stack>
              </HoverCard>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Tooltip</Text>
              <Tooltip content="This is a helpful tooltip">
                <Button variant="outline">Hover for tooltip</Button>
              </Tooltip>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Color Swatches</Text>
              <Flex gap="sm">
                <ColorSwatch color="#8b5cf6" label="Primary" />
                <ColorSwatch color="#10b981" label="Success" />
                <ColorSwatch color="#ef4444" label="Error" />
                <ColorSwatch color="#f59e0b" label="Warning" />
              </Flex>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Layout Components</Heading>
          <Separator />
          <Stack direction="vertical" spacing="md">
            <div>
              <Text variant="muted" className="mb-2">Responsive Grid</Text>
              <ResponsiveGrid columns={4} gap="md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card key={i} className="p-4 text-center">
                    <Text>Item {i}</Text>
                  </Card>
                ))}
              </ResponsiveGrid>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Flex Layout</Text>
              <Flex justify="between" align="center" className="p-4 border rounded-md">
                <Text>Left Content</Text>
                <Badge>Center</Badge>
                <Button size="sm">Right Action</Button>
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Stack Layout</Text>
              <Stack direction="vertical" spacing="sm" className="p-4 border rounded-md">
                <Text>Stacked Item 1</Text>
                <Text>Stacked Item 2</Text>
                <Text>Stacked Item 3</Text>
              </Stack>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg">
          <Heading level={2}>Enhanced Components</Heading>
          <Separator />
          <Stack direction="vertical" spacing="lg">
            <div>
              <PanelHeader
                title="Panel Header Component"
                subtitle="A reusable header with optional icon and actions"
                icon={<Rocket size={24} weight="duotone" />}
                actions={
                  <Button size="sm" variant="outline">Action</Button>
                }
              />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Number Input</Text>
              <NumberInput
                label="Quantity"
                value={numberValue}
                onChange={setNumberValue}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div>
              <Text variant="muted" className="mb-2">Text Gradient</Text>
              <Heading level={2}>
                <TextGradient from="from-primary" to="to-accent">
                  Beautiful Gradient Text
                </TextGradient>
              </Heading>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Status Indicators</Text>
              <Flex gap="lg" align="center">
                <Flex gap="sm" align="center">
                  <Pulse variant="success" />
                  <Text variant="small">Active</Text>
                </Flex>
                <LiveIndicator />
                <Flex gap="sm" align="center">
                  <Sparkle variant="gold" />
                  <Text variant="small">Featured</Text>
                </Flex>
              </Flex>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Quick Action Buttons</Text>
              <ResponsiveGrid columns={4} gap="md">
                <QuickActionButton
                  icon={<CodeIcon size={32} weight="duotone" />}
                  label="Code"
                  description="Edit files"
                  variant="primary"
                  onClick={() => alert('Code clicked')}
                />
                <QuickActionButton
                  icon={<Rocket size={32} weight="duotone" />}
                  label="Deploy"
                  description="Launch app"
                  variant="accent"
                  onClick={() => alert('Deploy clicked')}
                />
                <QuickActionButton
                  icon={<Star size={32} weight="duotone" />}
                  label="Favorite"
                  description="Save for later"
                  variant="default"
                  onClick={() => alert('Favorite clicked')}
                />
                <QuickActionButton
                  icon={<ShoppingCart size={32} weight="duotone" />}
                  label="Shop"
                  description="Browse items"
                  variant="muted"
                  onClick={() => alert('Shop clicked')}
                />
              </ResponsiveGrid>
            </div>

            <div>
              <Text variant="muted" className="mb-2">Glow Cards</Text>
              <ResponsiveGrid columns={3} gap="md">
                <GlowCard glowColor="primary" intensity="medium">
                  <div className="p-4">
                    <Heading level={4}>Primary Glow</Heading>
                    <Text variant="muted" className="mt-2">
                      Card with primary glow effect
                    </Text>
                  </div>
                </GlowCard>
                <GlowCard glowColor="accent" intensity="high">
                  <div className="p-4">
                    <Heading level={4}>Accent Glow</Heading>
                    <Text variant="muted" className="mt-2">
                      Card with accent glow effect
                    </Text>
                  </div>
                </GlowCard>
                <GlowCard glowColor="success" intensity="medium">
                  <div className="p-4">
                    <Heading level={4}>Success Glow</Heading>
                    <Text variant="muted" className="mt-2">
                      Card with success glow effect
                    </Text>
                  </div>
                </GlowCard>
              </ResponsiveGrid>
            </div>
          </Stack>
        </Section>

        <Section spacing="lg" className="pb-12">
          <Heading level={2}>Summary</Heading>
          <Separator />
          <InfoPanel variant="success" icon={<CheckCircle />}>
            <Heading level={5} className="mb-2">Atomic Component Library Complete!</Heading>
            <Text>
              The atomic component library includes 60+ production-ready components covering buttons, 
              badges, typography, forms, progress indicators, feedback, avatars, cards, enhanced inputs,
              gradient effects, and layout utilities. All components are fully typed, accessible, and follow the design system.
            </Text>
          </InfoPanel>
        </Section>
      </Stack>
    </Container>
  )
}
