# Agora Conversational AI UI Kit

React component library for building voice AI user interfaces with Agora.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Voice Components](#voice-components)
  - [MicButton](#micbutton)
  - [AgentVisualizer](#agentvisualizer)
  - [AudioVisualizer](#audiovisualizer)
  - [SimpleVisualizer](#simplevisualizer)
  - [LiveWaveform](#livewaveform)
  - [MicButtonWithVisualizer](#micbuttonwithvisualizer)
  - [MicSelector](#micselector)
- [Chat Components](#chat-components)
  - [Conversation](#conversation)
  - [Message](#message)
  - [Response](#response)
  - [ConvoTextStream](#convotextstream)
- [Video Components](#video-components)
  - [LocalVideoPreview](#localvideopreview)
  - [AvatarVideoDisplay](#avatarvideodisplay)
  - [Avatar](#avatar)
- [UI Primitives](#ui-primitives)
  - [Button](#button)
  - [IconButton](#iconbutton)
  - [Card](#card)
  - [Chip](#chip)
  - [ValuePicker](#valuepicker)
- [Usage Patterns](#usage-patterns)
  - [Voice Chat Interface](#voice-chat-interface)
  - [Mobile-Responsive Layout](#mobile-responsive-layout)
  - [Audio Visualization](#audio-visualization)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Performance](#performance)

---

## Features

- **Voice AI Components** - MicButton, AgentVisualizer, audio visualizations
- **Conversation UI** - Message bubbles, avatars, streaming text
- **Audio Visualizations** - Waveforms, frequency bars, PTS-synced animations
- **Tailwind CSS** - Full Tailwind support with customization via cn() utility
- **TypeScript** - Comprehensive type definitions
- **Accessible** - ARIA attributes and keyboard navigation
- **Mobile-Responsive** - Touch-friendly sizing and layouts

---

## Usage in Sample Projects

This UI Kit is part of the agora-convoai-samples pnpm workspace. Sample
applications consume it as a workspace package:

```json
{
  "dependencies": {
    "@agora/ui-kit": "workspace:*"
  }
}
```

Import components in your application:

```typescript
import { MicButton, AgentVisualizer, Conversation } from "@agora/ui-kit"
```

---

## Architecture

```
/client-ui-kit
├── index.ts                         # Main exports
├── README.md                        # This file
├── lib/
│   └── utils.ts                     # cn() utility
└── components/
    ├── voice/                       # Voice AI components
    │   ├── mic-button.tsx
    │   ├── agent-visualizer.tsx
    │   ├── audio-visualizer.tsx
    │   ├── simple-visualizer.tsx
    │   ├── live-waveform.tsx
    │   ├── mic-button-with-visualizer.tsx
    │   └── mic-selector.tsx
    ├── chat/                        # Chat components
    │   ├── conversation.tsx
    │   ├── message.tsx
    │   ├── response.tsx
    │   └── convo-text-stream.tsx
    ├── video/                       # Video components
    │   └── avatar.tsx
    └── primitives/                  # UI primitives
        ├── button.tsx
        ├── icon-button.tsx
        ├── card.tsx
        ├── chip.tsx
        ├── value-picker.tsx
        ├── dropdown-menu.tsx
        ├── command.tsx
        ├── popover.tsx
        └── hello-world.tsx
```

**Component Organization:**

Components are organized into category subfolders:

- **voice/** - Audio controls, visualizations, agent state
- **chat/** - Conversation, messages, text streaming
- **video/** - Avatar (local/remote video components coming in future)
- **primitives/** - Buttons, cards, form controls

---

## Installation

### Workspace Setup

From the repository root:

```bash
pnpm install
```

This installs all dependencies and links workspace packages automatically.

### Dependencies

```bash
pnpm add lucide-react class-variance-authority clsx tailwind-merge @lottiefiles/dotlottie-react
```

---

## Running Tests

The UI Kit includes a comprehensive test suite using Vitest and React Testing
Library.

**Run all tests:**

```bash
pnpm test
```

**Run tests in watch mode:**

```bash
pnpm test:watch
```

**Run tests with UI:**

```bash
pnpm test:ui
```

**Run with coverage:**

```bash
pnpm test:coverage
```

**Test Structure:**

The test suite focuses on component API contract validation, verifying that
components accept documented props and export correct types.

```
components/
├── chat/
│   └── __tests__/
│       ├── conversation.test.tsx  # Conversation component tests
│       ├── message.test.tsx       # Message component tests
│       └── response.test.tsx      # Response component tests
└── voice/
    └── __tests__/
        ├── agent-visualizer.test.tsx  # AgentVisualizer tests
        ├── audio-visualizer.test.tsx  # AudioVisualizer tests
        └── mic-button.test.tsx        # MicButton tests
```

**Test Coverage:** 29 tests covering all major chat and voice components.

---

## Voice Components

### MicButton

Microphone button with built-in audio visualization and state management.

**Props:**

```typescript
interface MicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: "idle" | "listening" | "processing" | "error"
  icon?: React.ReactNode
  showErrorBadge?: boolean
  audioData?: number[] // 0-1 normalized frequency data
}
```

**Usage:**

```typescript
import { MicButton } from '@agora/ui-kit'
import { Mic, MicOff } from 'lucide-react'

<MicButton
  state={isListening ? 'listening' : 'idle'}
  icon={isMuted ? <MicOff /> : <Mic />}
  audioData={frequencyData}
  onClick={toggleMute}
  className="flex-1"
/>
```

**States:**

- `idle` - Default state
- `listening` - Actively listening
- `processing` - Processing audio
- `error` - Error state (permission denied, etc.)

**Features:**

- Automatic state styling
- Integrated audio visualization (SimpleVisualizer)
- Error badge support
- Keeps visualizer visible when muted (icon changes only)

---

### AgentVisualizer

Animated agent state visualizer with pulsing circles.

**Props:**

```typescript
interface AgentVisualizerProps {
  state: "not-joined" | "listening" | "talking" | "thinking"
  size?: "sm" | "md" | "lg"
  className?: string
}
```

**Usage:**

```typescript
import { AgentVisualizer } from '@agora/ui-kit'

<AgentVisualizer
  state={isAgentSpeaking ? 'talking' : 'listening'}
  size="sm"
/>
```

**States:**

- `not-joined` - Gray, no animation
- `listening` - Blue, gentle pulse
- `talking` - Green, active animation
- `thinking` - Purple, processing animation

**Sizes:**

- `sm` - 128px (mobile/compact)
- `md` - 192px (default)
- `lg` - 256px (full screen)

---

### AudioVisualizer

Full-featured frequency bar visualizer.

**Props:**

```typescript
interface AudioVisualizerProps {
  data: number[] // 0-1 normalized frequency data
  barCount?: number // Number of bars (default: 32)
  barWidth?: number // Bar width in px (default: 4)
  barGap?: number // Gap between bars (default: 2)
  height?: number // Height in px (default: 100)
  color?: string // Bar color (default: 'rgb(59, 130, 246)')
  className?: string
}
```

**Usage:**

```typescript
import { AudioVisualizer } from '@agora/ui-kit'

<AudioVisualizer
  data={frequencyData}
  barCount={64}
  barWidth={3}
  barGap={1}
  height={120}
  color="rgb(34, 197, 94)"
/>
```

**Features:**

- Configurable bar count and sizing
- Custom colors
- Canvas-based rendering
- High-performance animations

---

### SimpleVisualizer

Compact horizontal bar visualizer for MicButton.

**Props:**

```typescript
interface SimpleVisualizerProps {
  data: number[]
  className?: string
}
```

**Usage:**

```typescript
import { SimpleVisualizer } from '@agora/ui-kit'

<SimpleVisualizer
  data={frequencyData}
  className="text-blue-500"
/>
```

**Features:**

- 8 vertical bars
- Smooth animations
- Customizable color via className
- Fixed width (64px)

---

### LiveWaveform

Animated waveform with PTS synchronization support.

**Props:**

```typescript
interface LiveWaveformProps {
  audioData: number[]
  isActive?: boolean
  color?: string
  height?: number
  className?: string
}
```

**Usage:**

```typescript
import { LiveWaveform } from '@agora/ui-kit'

<LiveWaveform
  audioData={waveformData}
  isActive={isAgentSpeaking}
  color="#10b981"
  height={80}
/>
```

**Features:**

- Smooth waveform rendering
- Active/inactive states
- SVG-based for scalability
- Supports PTS-based timing

---

### MicButtonWithVisualizer

Combined mic button and full audio visualizer (alternative to MicButton).

**Props:**

```typescript
interface MicButtonWithVisualizerProps {
  isActive: boolean
  isMuted: boolean
  onClick: () => void
  audioData?: number[]
  className?: string
}
```

**Usage:**

```typescript
import { MicButtonWithVisualizer } from '@agora/ui-kit'

<MicButtonWithVisualizer
  isActive={isConnected}
  isMuted={isMuted}
  onClick={toggleMute}
  audioData={frequencyData}
/>
```

**Features:**

- Large mic icon with surrounding visualizer
- Active/inactive states
- Mute indicator
- Integrated frequency bars

---

### MicSelector

Microphone device selector dropdown.

**Props:**

```typescript
interface MicSelectorProps {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  onDeviceChange: (deviceId: string) => void
  className?: string
}
```

**Usage:**

```typescript
import { MicSelector } from '@agora/ui-kit'

<MicSelector
  devices={microphoneDevices}
  selectedDeviceId={currentMicId}
  onDeviceChange={handleMicChange}
/>
```

**Features:**

- Lists available microphones
- Shows current selection
- Device switching
- Integrated with Agora audio track API

---

## Chat Components

### Conversation

Container for chat messages with auto-scroll and styling.

**Props:**

```typescript
interface ConversationProps {
  children: React.ReactNode
  height?: string
  className?: string
}

interface ConversationContentProps {
  children: React.ReactNode
  className?: string
}
```

**Usage:**

```typescript
import { Conversation, ConversationContent } from '@agora/ui-kit'

<Conversation height="500px" className="flex-1">
  <ConversationContent>
    {/* Messages go here */}
  </ConversationContent>
</Conversation>
```

**Features:**

- Auto-scrolls to bottom on new messages
- Smooth scroll behavior
- Styled scrollbar
- Flexible height control

---

### Message

Individual message bubble for user or agent with optional name label.

**Props:**

```typescript
interface MessageProps {
  from: "user" | "assistant"
  name?: string // Name to display above message (e.g., "Agent" or "User")
  children: React.ReactNode
  className?: string
}

interface MessageContentProps {
  children: React.ReactNode
  className?: string
}
```

**Usage:**

```typescript
import { Message, MessageContent, Response } from '@agora/ui-kit'

<Message
  from="assistant"
  name="Agent"
>
  <MessageContent>
    <Response>Hello! How can I help you?</Response>
  </MessageContent>
</Message>

<Message
  from="user"
  name="User"
>
  <MessageContent>
    <Response>I need help with my account.</Response>
  </MessageContent>
</Message>
```

**Layout:**

- `from="assistant"` - Name and message aligned left
- `from="user"` - Name and message aligned right
- Name displays above message with minimal spacing

---

### Response

Text content wrapper for messages.

**Props:**

```typescript
interface ResponseProps {
  children: React.ReactNode
  className?: string
}
```

**Usage:**

```typescript
import { Response } from '@agora/ui-kit'

<Response>This is the message text</Response>
```

**Features:**

- Pre-styled text formatting
- Supports markdown-style text
- Proper spacing and line height

---

### ConvoTextStream

Streaming text component with typewriter effect.

**Props:**

```typescript
interface ConvoTextStreamProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}
```

**Usage:**

```typescript
import { ConvoTextStream } from '@agora/ui-kit'

<ConvoTextStream
  text="This text will stream in character by character"
  speed={30}
  onComplete={() => console.log('Done!')}
/>
```

**Features:**

- Smooth character-by-character streaming
- Configurable speed
- Completion callback
- Supports markdown

---

## Video Components

### LocalVideoPreview

Display local camera video with mirror effect and optional label.

**Props:**

```typescript
interface LocalVideoPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  videoTrack?: ICameraVideoTrack | null
  isMirrored?: boolean // Default: true
  showLabel?: boolean // Default: false
  label?: string // Default: "You"
  placeholder?: React.ReactNode
  useMediaStream?: boolean // Default: false
}
```

**Usage:**

```typescript
import { LocalVideoPreview } from '@agora/ui-kit'
import { useLocalVideo } from '@agora/conversational-ai-react'

const { videoTrack } = useLocalVideo()

{/* Basic usage */}
<LocalVideoPreview videoTrack={videoTrack} />

{/* With label */}
<LocalVideoPreview
  videoTrack={videoTrack}
  showLabel={true}
  label="You"
/>

{/* Multiple instances (responsive layouts) */}
<LocalVideoPreview
  videoTrack={videoTrack}
  useMediaStream={true}  // Enables MediaStream rendering
/>
```

**Rendering Modes:**

- `useMediaStream={false}` (default) - Uses Agora's `play()` method. Use for
  single instance.
- `useMediaStream={true}` - Uses MediaStream API. Use when displaying the same
  track in multiple locations (e.g., responsive layouts with desktop and mobile
  views).

---

### AvatarVideoDisplay

Display remote avatar video with connection status and placeholder.

**Props:**

```typescript
type AvatarVideoState = "connected" | "loading" | "disconnected"

interface AvatarVideoDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  videoTrack?: IRemoteVideoTrack | null
  state?: AvatarVideoState // Default: "disconnected"
  showStatus?: boolean // Default: false
  placeholder?: React.ReactNode
  useMediaStream?: boolean // Default: false
}
```

**Usage:**

```typescript
import { AvatarVideoDisplay } from '@agora/ui-kit'
import { useRemoteVideo } from '@agora/conversational-ai-react'

const { remoteVideoUsersArray } = useRemoteVideo({ client })
const avatarVideoTrack = remoteVideoUsersArray[0]?.videoTrack

{/* Basic usage */}
<AvatarVideoDisplay
  videoTrack={avatarVideoTrack}
  state={avatarVideoTrack ? "connected" : "disconnected"}
/>

{/* With status indicator */}
<AvatarVideoDisplay
  videoTrack={avatarVideoTrack}
  state="connected"
  showStatus={true}
/>

{/* Multiple instances (responsive layouts) */}
<AvatarVideoDisplay
  videoTrack={avatarVideoTrack}
  state="connected"
  useMediaStream={true}
/>
```

**States:**

- `connected` - Video is playing
- `loading` - Connecting to video
- `disconnected` - No video (shows placeholder)

**Rendering Modes:**

- `useMediaStream={false}` (default) - Uses Agora's `play()` method. Use for
  single instance.
- `useMediaStream={true}` - Uses MediaStream API. Use when displaying the same
  track in multiple locations (e.g., responsive layouts with desktop and mobile
  views).

---

### Avatar

User/agent avatar with customizable size and colors.

**Props:**

```typescript
interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: "sm" | "md" | "lg"
  className?: string
}
```

**Usage:**

```typescript
import { Avatar } from '@agora/ui-kit'

{/* Image avatar */}
<Avatar src="/avatar.jpg" alt="User" size="sm" />

{/* Initials fallback */}
<Avatar initials="A" size="sm" />
<Avatar initials="U" size="sm" />
```

**Sizes:**

- `sm` - 32px
- `md` - 40px
- `lg` - 48px

---

## UI Primitives

### Button

Standard button with variant support.

**Props:**

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  className?: string
}
```

**Usage:**

```typescript
import { Button } from '@agora/ui-kit'

<Button variant="default" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="destructive" size="lg">
  Delete
</Button>
```

**Variants:**

- `default` - Primary blue background
- `outline` - Border only, transparent background
- `ghost` - No border, hover background
- `destructive` - Red background for dangerous actions

---

### IconButton

Circular icon button for actions.

**Props:**

```typescript
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost"
  className?: string
}
```

**Usage:**

```typescript
import { IconButton } from '@agora/ui-kit'
import { Settings } from 'lucide-react'

<IconButton
  icon={<Settings />}
  size="md"
  onClick={openSettings}
/>
```

**Sizes:**

- `sm` - 32px
- `md` - 40px
- `lg` - 48px

---

### Card

Simple card container.

**Props:**

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
}
```

**Usage:**

```typescript
import { Card } from '@agora/ui-kit'

<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

### Chip

Small label/tag component.

**Props:**

```typescript
interface ChipProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}
```

**Usage:**

```typescript
import { Chip } from '@agora/ui-kit'

<Chip variant="success">Active</Chip>
<Chip variant="error">Offline</Chip>
```

---

### ValuePicker

Value selector with increment/decrement buttons.

**Props:**

```typescript
interface ValuePickerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  className?: string
}
```

**Usage:**

```typescript
import { ValuePicker } from '@agora/ui-kit'

<ValuePicker
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  step={5}
  label="Volume"
/>
```

---

## Usage Patterns

### Voice Chat Interface

```typescript
import {
  MicButton,
  AgentVisualizer,
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  Response,
  Avatar
} from '@agora/ui-kit'

function VoiceChat() {
  const { transcript, isAgentSpeaking, isMuted, toggleMute } = useVoiceAI()

  return (
    <div className="flex h-screen">
      {/* Left: Agent Status */}
      <div className="w-96 p-6">
        <AgentVisualizer
          state={isAgentSpeaking ? 'talking' : 'listening'}
          size="md"
        />

        <MicButton
          state={isMuted ? 'idle' : 'listening'}
          icon={isMuted ? <MicOff /> : <Mic />}
          audioData={frequencyData}
          onClick={toggleMute}
          className="mt-6 w-full"
        />
      </div>

      {/* Right: Conversation */}
      <div className="flex-1">
        <Conversation className="flex-1">
          <ConversationContent>
            {transcript.map((msg, idx) => (
              <Message
                key={idx}
                from={msg.uid === 0 ? 'assistant' : 'user'}
                avatar={<Avatar initials={msg.uid === 0 ? 'A' : 'U'} />}
              >
                <MessageContent>
                  <Response>{msg.text}</Response>
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>
      </div>
    </div>
  )
}
```

---

### Mobile-Responsive Layout

```typescript
function MobileVoiceChat() {
  return (
    <div className="flex flex-col h-screen">
      {/* Mobile: Status Bar */}
      <div className="md:hidden flex items-center p-3 border-b">
        <div className={cn(
          "w-3 h-3 rounded-full",
          isAgentSpeaking ? "bg-green-500" : "bg-blue-500"
        )} />
        <span className="ml-3">
          {isAgentSpeaking ? 'Agent Speaking' : 'Listening'}
        </span>
      </div>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent>
          {/* Messages */}
        </ConversationContent>
      </Conversation>

      {/* Mobile: Bottom Controls */}
      <div className="md:hidden flex gap-3 p-4 border-t">
        <MicButton
          state={micState}
          icon={isMuted ? <MicOff /> : <Mic />}
          audioData={frequencyData}
          onClick={toggleMute}
          className="flex-1 min-h-[48px]"
        />
        <button className="flex-1 min-h-[48px]">
          End Call
        </button>
      </div>
    </div>
  )
}
```

---

### Audio Visualization

```typescript
import { AudioVisualizer, SimpleVisualizer, LiveWaveform } from '@agora/ui-kit'

function AudioViz() {
  const frequencyData = useAudioVisualization(audioTrack, isConnected)

  return (
    <div>
      {/* Simple bars in button */}
      <SimpleVisualizer data={frequencyData} className="text-blue-500" />

      {/* Full frequency visualizer */}
      <AudioVisualizer
        data={frequencyData}
        barCount={64}
        height={120}
        color="rgb(34, 197, 94)"
      />

      {/* Waveform */}
      <LiveWaveform
        audioData={frequencyData}
        isActive={isPlaying}
        height={80}
      />
    </div>
  )
}
```

---

## Theming

All components use Tailwind CSS and support the `cn()` utility for custom
styling:

```typescript
import { cn } from '@/lib/utils'

<MicButton
  className={cn(
    "custom-class",
    isActive && "active-state"
  )}
/>
```

**Custom Colors:**

Override default colors via Tailwind config or inline styles:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0066ff",
        "agent-active": "#10b981",
        "agent-idle": "#3b82f6",
      },
    },
  },
}
```

---

## Accessibility

All components follow accessibility best practices:

- **Keyboard Navigation** - All interactive components support Tab, Enter, Space
- **ARIA Attributes** - Proper roles, labels, and descriptions
- **Focus Management** - Visible focus indicators
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Touch Targets** - Minimum 48px touch targets on mobile

---

## Performance

**Optimization Tips:**

1. **Audio Visualization** - Throttle updates to 100ms for smooth 10fps
   rendering
2. **Conversation Scrolling** - Use `will-change: scroll-position` for smooth
   scroll
3. **Message List** - Use `key` prop with unique IDs for efficient React
   reconciliation
4. **Memoization** - Wrap expensive components in `React.memo()` when needed

**Example:**

```typescript
const MemoizedMessage = React.memo(Message)

{transcript.map((msg) => (
  <MemoizedMessage key={msg.turn_id} {...msg} />
))}
```

---

## License

MIT
