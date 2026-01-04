import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Type resolution issue with workspace package, api exists at runtime
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
  const thread = useQuery(api.features.threads.queries.getThread, { threadId })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
  const messages = useQuery(api.features.threads.queries.getMessages, { threadId })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
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
          {messages.map(
            (message: { _id: string; role: string; content: string; _creationTime: number }) => (
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
                  <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            )
          )}
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

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
