# Terminal UI Design Guide

A guide for creating terminal-emulating UI in React + TypeScript with Tailwind CSS.

## Core Principles

Terminal UIs succeed through **consistency** and **constraint**:

- Fixed-width typography creates visual rhythm
- Limited color palettes reduce cognitive load
- Predictable spacing aligns elements naturally
- Minimal decoration focuses attention on content

## Typography

### Font Setup

Your project already loads **Geist Mono** - use it consistently:

```tsx
// Apply via Tailwind
<div className="font-mono">Terminal content</div>

// Or CSS variable
font-family: var(--font-mono), 'SF Mono', Monaco, Consolas, monospace;
```

**Font size scale for terminals:**
| Use Case | Class | Size |
|----------|-------|------|
| Headers/titles | `text-base` | 16px |
| Body/commands | `text-sm` | 14px |
| Output/logs | `text-xs` | 12px |
| Timestamps/meta | `text-[10px]` | 10px |

**Line height matters more in monospace:**

```css
/* Tighter than default - feels more terminal-like */
.terminal-text {
  line-height: 1.4; /* or leading-snug */
}

/* For dense log output */
.terminal-dense {
  line-height: 1.2; /* or leading-tight */
}
```

### Character Cell Thinking

Terminals use character cells - each char occupies identical space. Design with this in mind:

```tsx
// Width based on character count (approximate)
// Geist Mono at 14px ≈ 8.4px per character
<div className="font-mono text-sm w-[420px]">{/* Fits ~50 characters per line */}</div>
```

For alignment, use `tabular-nums` for numbers:

```tsx
<span className="font-mono tabular-nums">00:15:32</span>
```

## Spacing

### Standardized Units

Use consistent spacing multiples. For terminal aesthetics, **4px base** works well:

```tsx
// Tailwind spacing (already 4px base)
<div className="p-2">   {/* 8px - tight */}
<div className="p-3">   {/* 12px - comfortable */}
<div className="p-4">   {/* 16px - spacious */}

// Gap between lines/items
<div className="space-y-1">  {/* 4px - dense */}
<div className="space-y-2">  {/* 8px - normal */}
```

### Terminal Layout Pattern

```tsx
function TerminalWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black rounded-lg overflow-hidden border border-neutral-800">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border-b border-neutral-800">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-xs text-neutral-500">terminal</span>
      </div>

      {/* Content area */}
      <div className="p-4 font-mono text-sm text-gray-300 leading-snug">{children}</div>
    </div>
  )
}
```

## Color Palette

### Terminal Color Standards

Classic terminal palettes - pick one and stay consistent:

**Dark (recommended for Nebula):**

```css
:root {
  /* Backgrounds */
  --term-bg: 0 0% 0%; /* Pure black */
  --term-bg-alt: 0 0% 6%; /* Slightly lighter */

  /* Text */
  --term-text: 0 0% 80%; /* Primary text */
  --term-text-dim: 0 0% 50%; /* Muted/comments */
  --term-text-bright: 0 0% 95%; /* Emphasis */

  /* Semantic colors */
  --term-green: 142 70% 45%; /* Success/output */
  --term-red: 0 70% 50%; /* Error */
  --term-yellow: 45 90% 50%; /* Warning */
  --term-blue: 210 100% 60%; /* Info/links */
  --term-cyan: 180 70% 50%; /* Strings */
  --term-magenta: 300 70% 60%; /* Keywords */
}
```

**Tailwind classes mapping:**

```tsx
// Text colors
className = 'text-gray-300' // Primary text
className = 'text-gray-500' // Dim/muted
className = 'text-white' // Bright/emphasis

// Semantic
className = 'text-green-400' // Success
className = 'text-red-400' // Error
className = 'text-yellow-400' // Warning
className = 'text-blue-400' // Info
className = 'text-cyan-400' // Strings/data
className = 'text-purple-400' // Keywords
```

### Syntax-Like Coloring

Apply consistent colors to content types:

```tsx
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const levelColors: Record<LogLevel, string> = {
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  debug: 'text-gray-500',
}

function LogLine({ level, message, timestamp }: LogLineProps) {
  return (
    <div className="font-mono text-sm flex gap-2">
      <span className="text-gray-600 tabular-nums">{timestamp}</span>
      <span className={levelColors[level]}>[{level.toUpperCase()}]</span>
      <span className="text-gray-300">{message}</span>
    </div>
  )
}
```

## Text Formatting

### Preserving Whitespace

Critical for terminal output - use `whitespace-pre` variants:

```tsx
// Preserve all whitespace and line breaks
<pre className="whitespace-pre font-mono">{output}</pre>

// Preserve whitespace but wrap long lines
<pre className="whitespace-pre-wrap break-words font-mono">{output}</pre>

// For inline code
<code className="whitespace-nowrap font-mono bg-neutral-800 px-1 rounded">
  {code}
</code>
```

### Prompt Styling

```tsx
function Prompt({ path, command }: { path: string; command?: string }) {
  return (
    <div className="font-mono text-sm">
      <span className="text-green-400">➜</span>
      <span className="text-cyan-400 ml-2">{path}</span>
      {command && <span className="text-gray-300 ml-2">{command}</span>}
    </div>
  )
}

// Or simpler
function Prompt({ children }: { children: string }) {
  return (
    <div className="font-mono text-sm">
      <span className="text-gray-500">$</span>
      <span className="text-gray-300 ml-2">{children}</span>
    </div>
  )
}
```

## Scrollable Output

```tsx
function ScrollableOutput({ lines }: { lines: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div
      ref={containerRef}
      className="h-64 overflow-y-auto font-mono text-sm text-gray-300 bg-black p-3"
    >
      {lines.map((line, i) => (
        <div key={i} className="leading-snug">
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  )
}
```

## Visual Effects (Optional)

### Subtle Glow

For emphasis without going full retro:

```css
.terminal-glow {
  text-shadow: 0 0 5px currentColor;
}

/* Or scoped to specific colors */
.glow-green {
  text-shadow: 0 0 8px rgb(74 222 128 / 0.5);
}
```

### Cursor Blink

```tsx
function BlinkingCursor() {
  return (
    <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse" />
  )
}

// Or CSS animation for classic blink
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}
```

### Scanlines (Retro)

Only if going for full CRT aesthetic:

```css
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
}
```

## Component Patterns

### Command Output Block

```tsx
interface CommandBlockProps {
  command: string
  output: string
  exitCode?: number
}

function CommandBlock({ command, output, exitCode }: CommandBlockProps) {
  const isError = exitCode !== undefined && exitCode !== 0

  return (
    <div className="font-mono text-sm space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">$</span>
        <span className="text-gray-300">{command}</span>
      </div>
      <pre className={cn('whitespace-pre-wrap pl-4', isError ? 'text-red-400' : 'text-gray-400')}>
        {output}
      </pre>
      {exitCode !== undefined && exitCode !== 0 && (
        <div className="text-red-500 text-xs">exit code: {exitCode}</div>
      )}
    </div>
  )
}
```

### Progress Indicator

```tsx
function TerminalProgress({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round(percentage / 5) // 20 chars total
  const empty = 20 - filled

  return (
    <div className="font-mono text-sm text-gray-300">
      <span className="text-gray-500">[</span>
      <span className="text-green-400">{'='.repeat(filled)}</span>
      <span className="text-gray-700">{'-'.repeat(empty)}</span>
      <span className="text-gray-500">]</span>
      <span className="ml-2 tabular-nums">{percentage}%</span>
    </div>
  )
}
```

### Status Badge

```tsx
type Status = 'running' | 'success' | 'failed' | 'pending'

const statusConfig: Record<Status, { color: string; symbol: string }> = {
  running: { color: 'text-blue-400', symbol: '●' },
  success: { color: 'text-green-400', symbol: '✓' },
  failed: { color: 'text-red-400', symbol: '✗' },
  pending: { color: 'text-gray-500', symbol: '○' },
}

function StatusBadge({ status, label }: { status: Status; label: string }) {
  const { color, symbol } = statusConfig[status]

  return (
    <span className={cn('font-mono text-sm', color)}>
      {symbol} {label}
    </span>
  )
}
```

## Tailwind Config Extensions

Add to `tailwind.config.js` for terminal-specific utilities:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['Geist Mono', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        terminal: ['14px', { lineHeight: '1.4' }],
        'terminal-sm': ['12px', { lineHeight: '1.4' }],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
}
```

## Quick Reference

| Element       | Classes                                    |
| ------------- | ------------------------------------------ |
| Container     | `bg-black font-mono text-sm text-gray-300` |
| Muted text    | `text-gray-500`                            |
| Success       | `text-green-400`                           |
| Error         | `text-red-400`                             |
| Warning       | `text-yellow-400`                          |
| Info/link     | `text-blue-400`                            |
| Code block    | `whitespace-pre-wrap break-words`          |
| Tight spacing | `leading-snug space-y-1`                   |
| Numbers       | `tabular-nums`                             |
| Border        | `border border-neutral-800`                |

## Sources

- [Building a Realistic Terminal UI in React](https://www.dantech.academy/blog/terminal-git/building-realistic-terminal-ui-react)
- [Terminal.css Framework](https://www.cssscript.com/terminal-ui-framework/)
- [WebTUI - Terminal CSS Library](https://www.cssscript.com/terminal-web-tui/)
- [Old Timey Terminal Styling - CSS-Tricks](https://css-tricks.com/old-timey-terminal-styling/)
- [Retro CRT Terminal Screen in CSS + JS](https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh)
- [Magic UI Terminal Component](https://magicui.design/docs/components/terminal)
- [shadcn/ui Terminal](https://www.shadcn.io/components/visualization/terminal)
- [Best Monospace Fonts 2024-2025](https://cssauthor.com/best-free-monospace-fonts-for-coding/)
