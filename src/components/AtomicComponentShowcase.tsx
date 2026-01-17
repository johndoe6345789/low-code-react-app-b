import { useState } from 'react'
import { Heart, Share, User, Envelope, Lock, Gear, House, Trash, Pencil, Check } from '@phosphor-icons/react'
import {
  Heading,
  Text,
  Link,
  ActionButton,
  IconButton,
  StatusBadge,
  Chip,
  Dot,
  Avatar,
  Code,
  Kbd,
  Alert,
  Spinner,
  ProgressBar,
  Skeleton,
  Label,
  HelperText,
  Container,
  Section,
  Stack,
  Spacer,
  Divider,
  Timestamp,
  Tag,
  BreadcrumbNav,
  IconText,
  TextArea,
  Input,
  Toggle,
  RadioGroup,
  Checkbox,
  Slider,
  ColorSwatch,
  Stepper,
  Rating,
  Timeline,
  FileUpload,
  Tabs,
  Accordion,
  Card,
  Notification,
  CopyButton,
  PasswordInput,
  BasicSearchInput,
  Select,
  Table,
} from '@/components/atoms'

export function AtomicComponentShowcase() {
  const [toggleValue, setToggleValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState('md')
  const [sliderValue, setSliderValue] = useState(50)
  const [ratingValue, setRatingValue] = useState(3)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [activeTab, setActiveTab] = useState('typography')
  const [selectedColor, setSelectedColor] = useState('#8b5cf6')

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  ]

  const tabs = [
    { id: 'typography', label: 'Typography', icon: <House /> },
    { id: 'forms', label: 'Forms', icon: <Pencil /> },
    { id: 'display', label: 'Display', icon: <User /> },
  ]

  return (
    <Container size="xl" className="py-8">
      <Stack spacing="xl">
        <Section>
          <Heading level={1}>Atomic Component Library</Heading>
          <Text variant="muted">
            A comprehensive showcase of all available atomic components
          </Text>
        </Section>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

        {activeTab === 'typography' && (
          <Stack spacing="lg">
            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Typography Components</Heading>
                <Divider />
                
                <Stack spacing="sm">
                  <Heading level={3}>Headings</Heading>
                  <Heading level={1}>Heading Level 1</Heading>
                  <Heading level={2}>Heading Level 2</Heading>
                  <Heading level={3}>Heading Level 3</Heading>
                </Stack>

                <Divider />

                <Stack spacing="sm">
                  <Heading level={3}>Text Variants</Heading>
                  <Text variant="body">Body text with default styling</Text>
                  <Text variant="muted">Muted text for less emphasis</Text>
                  <Text variant="caption">Caption text for descriptions</Text>
                  <Text variant="small">Small text for fine print</Text>
                </Stack>

                <Divider />

                <Stack spacing="sm">
                  <Heading level={3}>Links & Code</Heading>
                  <Link href="#" variant="default">Default Link</Link>
                  <Link href="#" variant="accent">Accent Link</Link>
                  <Code inline>npm install react</Code>
                  <div>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search</div>
                </Stack>
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Badges & Indicators</Heading>
                <Divider />

                <Stack spacing="sm">
                  <Heading level={3}>Status Badges</Heading>
                  <Stack direction="horizontal" spacing="sm" wrap>
                    <StatusBadge status="active" />
                    <StatusBadge status="inactive" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="error" />
                    <StatusBadge status="success" />
                    <StatusBadge status="warning" />
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Tags</Heading>
                  <Stack direction="horizontal" spacing="sm" wrap>
                    <Tag variant="default">Default</Tag>
                    <Tag variant="primary">Primary</Tag>
                    <Tag variant="secondary">Secondary</Tag>
                    <Tag variant="accent">Accent</Tag>
                    <Tag variant="destructive">Destructive</Tag>
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Dots</Heading>
                  <Stack direction="horizontal" spacing="sm" align="center">
                    <Dot variant="default" />
                    <Dot variant="primary" />
                    <Dot variant="accent" pulse />
                    <Dot variant="success" />
                    <Dot variant="warning" pulse />
                    <Dot variant="error" />
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Chips</Heading>
                  <Stack direction="horizontal" spacing="sm" wrap>
                    <Chip variant="default">React</Chip>
                    <Chip variant="primary">TypeScript</Chip>
                    <Chip variant="accent">Tailwind</Chip>
                  </Stack>
                </Stack>
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Feedback Components</Heading>
                <Divider />

                <Alert variant="info" title="Information">
                  This is an informational message
                </Alert>
                <Alert variant="success" title="Success">
                  Operation completed successfully
                </Alert>
                <Alert variant="warning" title="Warning">
                  Please review this warning
                </Alert>
                <Alert variant="error" title="Error">
                  Something went wrong
                </Alert>

                <Notification
                  type="success"
                  title="Notification"
                  message="This is a notification with a close button"
                  onClose={() => {}}
                />

                <Stack spacing="sm">
                  <Heading level={3}>Loading States</Heading>
                  <Stack direction="horizontal" spacing="md" align="center">
                    <Spinner size={16} />
                    <Spinner size={24} />
                    <Spinner size={32} />
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Progress Bar</Heading>
                  <ProgressBar value={35} showLabel />
                  <ProgressBar value={65} variant="accent" />
                  <ProgressBar value={85} variant="destructive" />
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Skeleton Loaders</Heading>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rounded" width="100%" height={100} />
                  <Stack direction="horizontal" spacing="sm">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Stack spacing="xs" className="flex-1">
                      <Skeleton variant="text" width="70%" />
                      <Skeleton variant="text" width="40%" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeTab === 'forms' && (
          <Stack spacing="lg">
            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Form Components</Heading>
                <Divider />

                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Envelope size={18} />}
                  helperText="Enter your email address"
                />

                <PasswordInput
                  label="Password"
                  value={passwordValue}
                  onChange={setPasswordValue}
                  helperText="Must be at least 8 characters"
                />

                <BasicSearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search components..."
                />

                <TextArea
                  label="Description"
                  placeholder="Enter a description..."
                  value={textAreaValue}
                  onChange={(e) => setTextAreaValue(e.target.value)}
                  helperText="Optional field"
                />

                <Select
                  label="Framework"
                  value={selectValue}
                  onChange={setSelectValue}
                  options={[
                    { value: 'react', label: 'React' },
                    { value: 'vue', label: 'Vue' },
                    { value: 'angular', label: 'Angular' },
                  ]}
                  placeholder="Select a framework"
                />

                <Divider />

                <Toggle
                  checked={toggleValue}
                  onChange={setToggleValue}
                  label="Enable notifications"
                />

                <Checkbox
                  checked={checkboxValue}
                  onChange={setCheckboxValue}
                  label="I agree to the terms and conditions"
                />

                <RadioGroup
                  name="size"
                  value={radioValue}
                  onChange={setRadioValue}
                  options={[
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ]}
                  orientation="horizontal"
                />

                <Slider
                  label="Volume"
                  value={sliderValue}
                  onChange={setSliderValue}
                  min={0}
                  max={100}
                  showValue
                />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Button Components</Heading>
                <Divider />

                <Stack direction="horizontal" spacing="sm" wrap>
                  <ActionButton label="Default" onClick={() => {}} />
                  <ActionButton label="Primary" variant="default" onClick={() => {}} />
                  <ActionButton label="Outline" variant="outline" onClick={() => {}} />
                  <ActionButton label="Ghost" variant="ghost" onClick={() => {}} />
                  <ActionButton label="Destructive" variant="destructive" onClick={() => {}} />
                </Stack>

                <Stack direction="horizontal" spacing="sm">
                  <ActionButton label="Like" icon={<Heart />} onClick={() => {}} />
                  <ActionButton label="Share" icon={<Share />} variant="outline" onClick={() => {}} />
                </Stack>

                <Stack direction="horizontal" spacing="sm">
                  <IconButton icon={<Heart />} onClick={() => {}} />
                  <IconButton icon={<Share />} variant="outline" onClick={() => {}} />
                  <IconButton icon={<Trash />} variant="destructive" onClick={() => {}} />
                </Stack>

                <CopyButton text="Copy this text" size="md" />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>File Upload</Heading>
                <Divider />
                <FileUpload
                  accept="image/*"
                  multiple
                  onFilesSelected={(files) => console.log(files)}
                />
              </Stack>
            </Card>
          </Stack>
        )}

        {activeTab === 'display' && (
          <Stack spacing="lg">
            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Display Components</Heading>
                <Divider />

                <Stack spacing="sm">
                  <Heading level={3}>Avatar</Heading>
                  <Stack direction="horizontal" spacing="sm" align="center">
                    <Avatar fallback="JD" size="xs" />
                    <Avatar fallback="JD" size="sm" />
                    <Avatar fallback="JD" size="md" />
                    <Avatar fallback="JD" size="lg" />
                    <Avatar fallback="JD" size="xl" />
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Rating</Heading>
                  <Rating value={ratingValue} onChange={setRatingValue} max={5} showValue />
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Color Swatches</Heading>
                  <Stack direction="horizontal" spacing="sm">
                    <ColorSwatch
                      color="#8b5cf6"
                      selected={selectedColor === '#8b5cf6'}
                      onClick={() => setSelectedColor('#8b5cf6')}
                      label="Primary"
                    />
                    <ColorSwatch
                      color="#06b6d4"
                      selected={selectedColor === '#06b6d4'}
                      onClick={() => setSelectedColor('#06b6d4')}
                      label="Accent"
                    />
                    <ColorSwatch
                      color="#ef4444"
                      selected={selectedColor === '#ef4444'}
                      onClick={() => setSelectedColor('#ef4444')}
                      label="Error"
                    />
                  </Stack>
                </Stack>

                <Stack spacing="sm">
                  <Heading level={3}>Timestamp</Heading>
                  <Timestamp date={new Date()} />
                  <Timestamp date={new Date(Date.now() - 3600000)} relative />
                </Stack>
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Stepper</Heading>
                <Divider />
                <Stepper
                  steps={[
                    { label: 'Account', description: 'Create your account' },
                    { label: 'Profile', description: 'Add personal details' },
                    { label: 'Complete', description: 'Finish setup' },
                  ]}
                  currentStep={1}
                />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Timeline</Heading>
                <Divider />
                <Timeline
                  items={[
                    {
                      title: 'Project Created',
                      description: 'Initial setup completed',
                      timestamp: '2 hours ago',
                      status: 'completed',
                    },
                    {
                      title: 'Development',
                      description: 'Currently building features',
                      timestamp: 'now',
                      status: 'current',
                    },
                    {
                      title: 'Testing',
                      description: 'QA phase',
                      status: 'pending',
                    },
                  ]}
                />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Table</Heading>
                <Divider />
                <Table
                  data={tableData}
                  columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'email', header: 'Email' },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (item) => <StatusBadge status={item.status as any} />,
                    },
                  ]}
                  striped
                  hoverable
                />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Accordion</Heading>
                <Divider />
                <Accordion
                  items={[
                    {
                      id: '1',
                      title: 'What is an atomic component?',
                      content: (
                        <Text variant="body">
                          Atomic components are the smallest building blocks in a design system,
                          representing basic UI elements that cannot be broken down further.
                        </Text>
                      ),
                    },
                    {
                      id: '2',
                      title: 'How do I use these components?',
                      content: (
                        <Text variant="body">
                          Import the components from the atoms folder and use them in your React
                          components with full TypeScript support.
                        </Text>
                      ),
                    },
                  ]}
                  type="single"
                  defaultOpen={['1']}
                />
              </Stack>
            </Card>

            <Card variant="bordered" padding="lg">
              <Stack spacing="md">
                <Heading level={2}>Navigation</Heading>
                <Divider />
                <BreadcrumbNav
                  items={[
                    { label: 'Home', onClick: () => {} },
                    { label: 'Components', onClick: () => {} },
                    { label: 'Showcase' },
                  ]}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
