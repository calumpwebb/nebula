# Threads Chat Interface Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build ChatGPT-inspired home page with personalized greeting, chat input, and thread-based conversations with history.

**Architecture:** Convex backend with threads/messages tables, TanStack Router for navigation, minimal UI with time-based greeting and chat interface. Thread creation navigates to dedicated thread view.

**Tech Stack:** React, TanStack Router, Convex (self-hosted), TailwindCSS, Heroicons

---

## Task 1: Update Convex Schema

**Files:**

- Modify: `packages/convex/convex/schema.ts`

**Step 1: Add threads and messages tables to schema**

Replace the empty schema with:

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Better Auth component manages its own tables (user, session, account, verification)
// Add your application tables here

export default defineSchema({
  threads: defineTable({
    userId: v.string(),
    title: v.union(v.string(), v.null()),
  }).index('by_user', ['userId']),

  messages: defineTable({
    threadId: v.id('threads'),
    userId: v.string(),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
  }).index('by_thread', ['threadId']),
})
```

**Step 2: Verify schema is valid**

Run: `cd packages/convex && npx convex dev --once`
Expected: Schema deployed successfully, no errors

**Step 3: Commit**

```bash
git add packages/convex/convex/schema.ts
git commit -m "feat(NEBULA-zfd): add threads and messages tables to schema"
```

---

## Task 2: Create Convex Mutations

**Files:**

- Create: `packages/convex/convex/features/threads/mutations.ts`

**Step 1: Create threads feature directory**

Run: `mkdir -p packages/convex/convex/features/threads`

**Step 2: Create mutations file**

Create `packages/convex/convex/features/threads/mutations.ts`:

```typescript
import { v } from 'convex/values'
import { mutation } from '../../functions'

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const threadId = await ctx.db.insert('threads', {
      userId: ctx.user.id,
      title: null,
    })

    return threadId
  },
})

export const createMessage = mutation({
  args: {
    threadId: v.id('threads'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify thread belongs to user
    const thread = await ctx.db.get(args.threadId)
    if (!thread || thread.userId !== ctx.user.id) {
      throw new Error('Thread not found')
    }

    const messageId = await ctx.db.insert('messages', {
      threadId: args.threadId,
      userId: ctx.user.id,
      content: args.content,
      role: 'user',
    })

    return messageId
  },
})
```

**Step 3: Commit**

```bash
git add packages/convex/convex/features/threads/mutations.ts
git commit -m "feat(NEBULA-zfd): add thread mutations"
```

---

## Task 3: Create Convex Queries

**Files:**

- Create: `packages/convex/convex/features/threads/queries.ts`

**Step 1: Create queries file**

Create `packages/convex/convex/features/threads/queries.ts`:

```typescript
import { v } from 'convex/values'
import { query } from '../../functions'

export const getThreads = query({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db
      .query('threads')
      .withIndex('by_user', (q) => q.eq('userId', ctx.user.id))
      .order('desc')
      .collect()

    return threads
  },
})

export const getThread = query({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId)

    if (!thread || thread.userId !== ctx.user.id) {
      return null
    }

    return thread
  },
})

export const getMessages = query({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    // Verify thread belongs to user
    const thread = await ctx.db.get(args.threadId)
    if (!thread || thread.userId !== ctx.user.id) {
      return []
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .collect()

    return messages
  },
})
```

**Step 2: Commit**

```bash
git add packages/convex/convex/features/threads/queries.ts
git commit -m "feat(NEBULA-zfd): add thread queries"
```

---

## Task 4: Update Sidebar Navigation

**Files:**

- Modify: `apps/desktop/src/components/Sidebar.tsx`

**Step 1: Replace navigation sections**

In `Sidebar.tsx`, replace lines 27-49 (the `navSections` array) with:

```typescript
const navSections: NavSection[] = [
  {
    items: [
      { name: 'Home', to: '/', icon: HomeIcon },
      { name: 'Threads', to: '/threads', icon: ChatBubbleLeftRightIcon },
    ],
  },
]
```

**Step 2: Remove unused icon imports**

Replace lines 3-13 with:

```typescript
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
```

**Step 3: Verify no type errors**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/desktop/src/components/Sidebar.tsx
git commit -m "feat(NEBULA-zfd): update sidebar navigation for threads"
```

---

## Task 5: Remove Unused Route Pages

**Files:**

- Delete: `apps/desktop/src/routes/_authenticated/chat.tsx`
- Delete: `apps/desktop/src/routes/_authenticated/repos.tsx`
- Delete: `apps/desktop/src/routes/_authenticated/projects.tsx`
- Delete: `apps/desktop/src/routes/_authenticated/users.tsx`
- Delete: `apps/desktop/src/routes/_authenticated/teams.tsx`
- Delete: `apps/desktop/src/routes/_authenticated/analytics.tsx`

**Step 1: Remove unused route files**

Run:

```bash
rm apps/desktop/src/routes/_authenticated/chat.tsx
rm apps/desktop/src/routes/_authenticated/repos.tsx
rm apps/desktop/src/routes/_authenticated/projects.tsx
rm apps/desktop/src/routes/_authenticated/users.tsx
rm apps/desktop/src/routes/_authenticated/teams.tsx
rm apps/desktop/src/routes/_authenticated/analytics.tsx
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat(NEBULA-zfd): remove unused route pages"
```

---

## Task 6: Create Home Page Component

**Files:**

- Modify: `apps/desktop/src/routes/_authenticated/index.tsx`

**Step 1: Replace home page with new design**

Replace entire content with:

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@nebula/convex'
import { authClient } from '../../lib/auth-client'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createThread = useMutation(api.features.threads.mutations.createThread)
  const createMessage = useMutation(api.features.threads.mutations.createMessage)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getUserName = () => {
    return session?.user?.name || 'there'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const threadId = await createThread({})
      await createMessage({
        threadId,
        content: trimmedInput,
      })

      navigate({
        to: '/threads/$threadId',
        params: { threadId },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thread')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-2xl px-8">
        {/* Black gradient orb */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg" />
        </div>

        {/* Greeting */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            {getGreeting()}, {getUserName()}
          </h1>
          <p className="text-xl text-purple-600">What's on your mind?</p>
        </div>

        {/* Chat input */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI a question or make a request..."
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder:text-foreground-tertiary disabled:opacity-50"
          />

          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
```

**Step 2: Verify no type errors**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/desktop/src/routes/_authenticated/index.tsx
git commit -m "feat(NEBULA-zfd): redesign home page with chat interface"
```

---

## Task 7: Create Threads List Page

**Files:**

- Create: `apps/desktop/src/routes/_authenticated/threads.tsx`

**Step 1: Create threads list route**

Create `apps/desktop/src/routes/_authenticated/threads.tsx`:

```typescript
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@nebula/convex'

export const Route = createFileRoute('/_authenticated/threads')({
  component: ThreadsList,
})

function ThreadsList() {
  const threads = useQuery(api.features.threads.queries.getThreads)
  const messages = threads?.map(thread =>
    useQuery(api.features.threads.queries.getMessages, { threadId: thread._id })
  ) ?? []

  if (!threads) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-secondary">
            No threads yet. Start a conversation from the home page.
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const getThreadPreview = (threadIndex: number) => {
    const threadMessages = messages[threadIndex]
    if (!threadMessages || threadMessages.length === 0) {
      return 'Empty thread'
    }

    const firstMessage = threadMessages[0]
    return firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? '...' : '')
  }

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Threads</h1>

      <div className="space-y-2">
        {threads.map((thread, index) => (
          <Link
            key={thread._id}
            to="/threads/$threadId"
            params={{ threadId: thread._id }}
            className="block p-4 bg-white rounded-lg border border-border hover:border-border-hover hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {getThreadPreview(index)}
                </p>
              </div>
              <p className="text-xs text-foreground-tertiary ml-4 flex-shrink-0">
                {formatDate(thread._creationTime)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/desktop/src/routes/_authenticated/threads.tsx
git commit -m "feat(NEBULA-zfd): add threads list page"
```

---

## Task 8: Create Thread View Page

**Files:**

- Create: `apps/desktop/src/routes/_authenticated/threads/$threadId.tsx`

**Step 1: Create thread view route directory**

Run: `mkdir -p apps/desktop/src/routes/_authenticated/threads`

**Step 2: Create thread view route**

Create `apps/desktop/src/routes/_authenticated/threads/$threadId.tsx`:

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@nebula/convex'

export const Route = createFileRoute('/_authenticated/threads/$threadId')({
  component: ThreadView,
})

function ThreadView() {
  const { threadId } = Route.useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const thread = useQuery(api.features.threads.queries.getThread, { threadId })
  const messages = useQuery(api.features.threads.queries.getMessages, { threadId })
  const createMessage = useMutation(api.features.threads.mutations.createMessage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await createMessage({
        threadId,
        content: trimmedInput,
      })

      setInput('')
      setIsSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setIsSubmitting(false)
    }
  }

  if (thread === undefined || messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    )
  }

  if (thread === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-secondary mb-4">Thread not found</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Go home
          </button>
        </div>
      </div>
    )
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message._id} className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <span className="text-xs text-foreground-tertiary">
                  {formatTimestamp(message._creationTime)}
                </span>
              </div>
              <div className="bg-white rounded-lg border border-border p-3">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder:text-foreground-tertiary disabled:opacity-50"
            />

            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add apps/desktop/src/routes/_authenticated/threads/\$threadId.tsx
git commit -m "feat(NEBULA-zfd): add thread view page"
```

---

## Task 9: Regenerate Routes

**Files:**

- Modify: `apps/desktop/src/routeTree.gen.ts` (auto-generated)

**Step 1: Regenerate route tree**

TanStack Router needs to regenerate the route tree to include new routes and remove deleted ones.

Run: `cd apps/desktop && pnpm exec tsr generate`
Expected: Route tree regenerated successfully

**Step 2: Verify no type errors**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/desktop/src/routeTree.gen.ts
git commit -m "chore(NEBULA-zfd): regenerate route tree"
```

---

## Task 10: Manual Testing

**Step 1: Start the development environment**

Run: `just up`
Expected: All services start successfully (Convex, desktop app)

**Step 2: Test home page**

1. Open desktop app
2. Verify greeting shows correct time-based text
3. Verify user name appears in greeting
4. Type a message in input
5. Press Enter
6. Verify navigation to thread view

**Step 3: Test thread view**

1. Verify first message appears in thread
2. Type another message
3. Press Enter
4. Verify new message appears
5. Verify timestamp shows

**Step 4: Test threads list**

1. Navigate to Threads from sidebar
2. Verify thread appears with preview of first message
3. Click thread
4. Verify navigation to thread view

**Step 5: Test empty states**

1. Navigate to Threads page with new user (no threads)
2. Verify empty state message appears

**Step 6: Create multiple threads**

1. Go home
2. Create 3-4 different threads with different messages
3. Navigate to Threads
4. Verify all threads appear sorted by newest first
5. Verify preview text shows correctly

---

## Notes

- All Convex functions use existing auth middleware - `ctx.user` is automatically available
- Thread ownership is validated in all queries to prevent unauthorized access
- Input validation prevents empty messages from being submitted
- Error states are shown inline below inputs (no toasts)
- Time-based greeting uses client-side time (5am-12pm morning, 12pm-5pm afternoon, 5pm-5am evening)
- Thread preview truncates at 50 characters with ellipsis
- Future: Add AI assistant responses by creating messages with `role: "assistant"`
- Future: Add editable thread titles (currently uses first message preview)
