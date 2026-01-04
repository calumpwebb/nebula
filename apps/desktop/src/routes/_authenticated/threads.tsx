import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Type resolution issue with workspace package, api exists at runtime
import { api } from '@nebula/convex'

export const Route = createFileRoute('/_authenticated/threads')({
  component: ThreadsList,
})

// Component that fetches messages for a single thread
function ThreadListItem({ thread }: { thread: { _id: string; _creationTime: number } }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
  const messages = useQuery(api.features.threads.queries.getMessages, { threadId: thread._id })

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

  const getThreadPreview = () => {
    if (!messages || messages.length === 0) {
      return 'Empty thread'
    }

    const firstMessage = messages[0]
    return firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? '...' : '')
  }

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Route type not yet defined
      to="/threads/$threadId"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Route params not yet defined
      params={{ threadId: thread._id }}
      className="block p-4 bg-white rounded-lg border border-border hover:border-border-hover hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{getThreadPreview()}</p>
        </div>
        <p className="text-xs text-foreground-tertiary ml-4 flex-shrink-0">
          {formatDate(thread._creationTime)}
        </p>
      </div>
    </Link>
  )
}

function ThreadsList() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
  const threads = useQuery(api.features.threads.queries.getThreads)

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

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Threads</h1>

      <div className="space-y-2">
        {threads.map((thread: { _id: string; _creationTime: number }) => (
          <ThreadListItem key={thread._id} thread={thread} />
        ))}
      </div>
    </div>
  )
}
