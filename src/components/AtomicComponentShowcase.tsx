import {
  ActionButton,
  IconButton,
  Text,
  Heading,
  Link,
  Divider,
  Avatar,
  Chip,
  Code,
  Kbd,
  ProgressBar,
  Skeleton,
  Tooltip,
  Alert,
  Spinner,
  Dot,
  Image,
  Label,
  HelperText,
  Container,
  Section,
  Stack,
  Spacer,
  Timestamp,
  ScrollArea,
  StatusBadge,
  LoadingSpinner,
  EmptyState,
} from '@/components/atoms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Download, 
  Trash,
  Heart,
  Star,
  GitBranch,
} from '@phosphor-icons/react'

export function AtomicComponentShowcase() {
  return (
    <ScrollArea maxHeight="100vh">
      <Container size="xl" className="py-8">
        <Stack spacing="xl">
          <div>
            <Heading level={1}>Atomic Component Library</Heading>
            <Text variant="muted">
              Comprehensive collection of reusable atomic components for CodeForge
            </Text>
          </div>

          <Divider />

          <Section>
            <Stack spacing="lg">
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Text elements and headings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <div>
                      <Heading level={1}>Heading Level 1</Heading>
                      <Heading level={2}>Heading Level 2</Heading>
                      <Heading level={3}>Heading Level 3</Heading>
                      <Heading level={4}>Heading Level 4</Heading>
                      <Heading level={5}>Heading Level 5</Heading>
                      <Heading level={6}>Heading Level 6</Heading>
                    </div>
                    <Divider />
                    <div>
                      <Text variant="body">Body text - Default paragraph text</Text>
                      <Text variant="muted">Muted text - For less important information</Text>
                      <Text variant="caption">Caption text - Small descriptive text</Text>
                      <Text variant="small">Small text - Compact information</Text>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Action buttons and icon buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack direction="horizontal" spacing="md" wrap>
                    <ActionButton label="Primary" onClick={() => {}} variant="default" />
                    <ActionButton label="Outline" onClick={() => {}} variant="outline" />
                    <ActionButton label="Ghost" onClick={() => {}} variant="ghost" />
                    <ActionButton label="Destructive" onClick={() => {}} variant="destructive" />
                    <ActionButton 
                      icon={<Plus />} 
                      label="With Icon" 
                      onClick={() => {}} 
                    />
                    <ActionButton 
                      icon={<Download />} 
                      label="Tooltip" 
                      onClick={() => {}} 
                      tooltip="Download file"
                    />
                  </Stack>
                  <Spacer size="md" />
                  <Stack direction="horizontal" spacing="md">
                    <IconButton icon={<Plus />} />
                    <IconButton icon={<Download />} variant="default" />
                    <IconButton icon={<Trash />} variant="destructive" />
                    <IconButton icon={<Heart />} variant="outline" />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                  <CardDescription>Text links with variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Link href="#" variant="default">Default Link</Link>
                    <Link href="#" variant="muted">Muted Link</Link>
                    <Link href="#" variant="accent">Accent Link</Link>
                    <Link href="#" variant="destructive">Destructive Link</Link>
                    <Link href="https://example.com" variant="default" external>
                      External Link
                    </Link>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges & Chips</CardTitle>
                  <CardDescription>Status indicators and removable tags</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <Stack direction="horizontal" spacing="sm" wrap>
                      <StatusBadge status="active" />
                      <StatusBadge status="inactive" />
                      <StatusBadge status="pending" />
                      <StatusBadge status="error" />
                      <StatusBadge status="success" />
                      <StatusBadge status="warning" />
                    </Stack>
                    <Stack direction="horizontal" spacing="sm" wrap>
                      <Chip variant="default">Default</Chip>
                      <Chip variant="primary">Primary</Chip>
                      <Chip variant="accent">Accent</Chip>
                      <Chip variant="muted">Muted</Chip>
                      <Chip variant="default" size="sm">Small</Chip>
                      <Chip variant="primary" onRemove={() => {}}>Removable</Chip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dots & Indicators</CardTitle>
                  <CardDescription>Status dots with pulse animation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack direction="horizontal" spacing="lg" align="center">
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Dot variant="default" />
                      <Text variant="caption">Default</Text>
                    </Stack>
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Dot variant="primary" />
                      <Text variant="caption">Primary</Text>
                    </Stack>
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Dot variant="success" pulse />
                      <Text variant="caption">Success (pulse)</Text>
                    </Stack>
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Dot variant="warning" pulse />
                      <Text variant="caption">Warning (pulse)</Text>
                    </Stack>
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Dot variant="error" pulse />
                      <Text variant="caption">Error (pulse)</Text>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>User avatars with fallbacks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack direction="horizontal" spacing="md" align="center">
                    <Avatar size="xs" fallback="XS" />
                    <Avatar size="sm" fallback="SM" />
                    <Avatar size="md" fallback="MD" />
                    <Avatar size="lg" fallback="LG" />
                    <Avatar size="xl" fallback="XL" />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code & Keyboard</CardTitle>
                  <CardDescription>Code snippets and keyboard shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <div>
                      <Text variant="body">
                        Use <Code>npm install</Code> to install dependencies.
                      </Text>
                    </div>
                    <Code inline={false}>
{`function hello() {
  console.log("Hello, world!");
}`}
                    </Code>
                    <Stack direction="horizontal" spacing="sm" align="center">
                      <Text variant="body">Press</Text>
                      <Kbd>Ctrl</Kbd>
                      <Text variant="body">+</Text>
                      <Kbd>K</Kbd>
                      <Text variant="body">to search</Text>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Bars</CardTitle>
                  <CardDescription>Progress indicators with variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <div>
                      <Label>Default Progress</Label>
                      <ProgressBar value={65} showLabel />
                    </div>
                    <div>
                      <Label>Accent Progress</Label>
                      <ProgressBar value={80} variant="accent" showLabel />
                    </div>
                    <div>
                      <Label>Error Progress</Label>
                      <ProgressBar value={25} variant="destructive" showLabel />
                    </div>
                    <div>
                      <Label>Small Size</Label>
                      <ProgressBar value={50} size="sm" />
                    </div>
                    <div>
                      <Label>Large Size</Label>
                      <ProgressBar value={90} size="lg" />
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                  <CardDescription>Spinners and skeletons</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <Stack direction="horizontal" spacing="lg" align="center">
                      <LoadingSpinner size="sm" />
                      <LoadingSpinner size="md" />
                      <LoadingSpinner size="lg" />
                      <Spinner size={16} />
                      <Spinner size={24} />
                      <Spinner size={32} />
                    </Stack>
                    <Divider />
                    <Stack spacing="sm">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="rounded" width="100%" height={100} />
                      <Stack direction="horizontal" spacing="sm">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Stack spacing="xs" className="flex-1">
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="40%" />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>Contextual feedback messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <Alert variant="info" title="Information">
                      This is an informational message with useful context.
                    </Alert>
                    <Alert variant="success" title="Success">
                      Your changes have been saved successfully.
                    </Alert>
                    <Alert variant="warning" title="Warning">
                      Please review your input before continuing.
                    </Alert>
                    <Alert variant="error" title="Error">
                      An error occurred while processing your request.
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                  <CardDescription>Labels and helper text</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <div>
                      <Label htmlFor="example-input">Email Address</Label>
                      <HelperText variant="default">
                        We'll never share your email with anyone else.
                      </HelperText>
                    </div>
                    <div>
                      <Label htmlFor="required-input" required>
                        Required Field
                      </Label>
                      <HelperText variant="error">
                        This field is required.
                      </HelperText>
                    </div>
                    <div>
                      <Label htmlFor="success-input">Username</Label>
                      <HelperText variant="success">
                        This username is available!
                      </HelperText>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timestamps</CardTitle>
                  <CardDescription>Date and time formatting</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Stack direction="horizontal" spacing="sm">
                      <Text variant="body">Absolute:</Text>
                      <Timestamp date={new Date()} />
                    </Stack>
                    <Stack direction="horizontal" spacing="sm">
                      <Text variant="body">Relative:</Text>
                      <Timestamp date={new Date(Date.now() - 1000 * 60 * 30)} relative />
                    </Stack>
                    <Stack direction="horizontal" spacing="sm">
                      <Text variant="body">Custom format:</Text>
                      <Timestamp date={new Date()} formatString="EEEE, MMMM do, yyyy" />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tooltips</CardTitle>
                  <CardDescription>Hover to see tooltips</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack direction="horizontal" spacing="md">
                    <Tooltip content="This is a tooltip" side="top">
                      <ActionButton label="Top" onClick={() => {}} />
                    </Tooltip>
                    <Tooltip content="This is a tooltip" side="right">
                      <ActionButton label="Right" onClick={() => {}} />
                    </Tooltip>
                    <Tooltip content="This is a tooltip" side="bottom">
                      <ActionButton label="Bottom" onClick={() => {}} />
                    </Tooltip>
                    <Tooltip content="This is a tooltip" side="left">
                      <ActionButton label="Left" onClick={() => {}} />
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layout Components</CardTitle>
                  <CardDescription>Stack and spacing utilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <div>
                      <Label>Horizontal Stack</Label>
                      <Stack direction="horizontal" spacing="sm">
                        <div className="p-4 bg-primary text-primary-foreground rounded">1</div>
                        <div className="p-4 bg-primary text-primary-foreground rounded">2</div>
                        <div className="p-4 bg-primary text-primary-foreground rounded">3</div>
                      </Stack>
                    </div>
                    <div>
                      <Label>Vertical Stack with Large Spacing</Label>
                      <Stack direction="vertical" spacing="lg">
                        <div className="p-4 bg-accent text-accent-foreground rounded">A</div>
                        <div className="p-4 bg-accent text-accent-foreground rounded">B</div>
                        <div className="p-4 bg-accent text-accent-foreground rounded">C</div>
                      </Stack>
                    </div>
                    <div>
                      <Label>Justified Between</Label>
                      <Stack direction="horizontal" justify="between" align="center">
                        <IconButton icon={<Star />} />
                        <Text variant="body">Center Content</Text>
                        <IconButton icon={<GitBranch />} />
                      </Stack>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Empty States</CardTitle>
                  <CardDescription>Placeholder for empty content</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<GitBranch size={48} />}
                    title="No items found"
                    description="Get started by creating your first item"
                  />
                </CardContent>
              </Card>
            </Stack>
          </Section>
        </Stack>
      </Container>
    </ScrollArea>
  )
}
