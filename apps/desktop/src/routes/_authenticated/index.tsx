import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '../../lib/auth-client'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})

function Dashboard() {
  const { data: session } = authClient.useSession()

  console.log('[Dashboard] Session:', session)
  console.log('[Dashboard] User:', session?.user)
  console.log('[Dashboard] Email:', session?.user?.email)

  const handleSignOut = async () => {
    try {
      console.log('[sign-out] Starting sign out...')
      const result = await authClient.signOut()
      console.log('[sign-out] Sign out result:', result)

      // Clear any stored session data
      localStorage.clear()
      sessionStorage.clear()

      console.log('[sign-out] Reloading to login page...')
      // Force reload to clear all state
      window.location.href = '/login'
    } catch (error) {
      console.error('[sign-out] Sign out failed:', error)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      <div className="bg-white rounded-lg shadow-card p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Nebula</h1>
        <p className="text-foreground-secondary mb-6">{session?.user?.email}</p>
        <button
          onClick={handleSignOut}
          className="px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
