import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from 'convex/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Type resolution issue with workspace package, api exists at runtime
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
  const createThread = useMutation(api.features.threads.mutations.createThread)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type resolution issue with workspace package
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

      // Navigate to thread detail page (route will be created in a future task)
      navigate({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Route type not yet defined
        to: '/threads/$threadId',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Route params not yet defined
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

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </form>
      </div>
    </div>
  )
}
