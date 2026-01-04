import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    console.log('[_authenticated guard] isAuthenticated:', context.auth.isAuthenticated)

    // Redirect to login if not authenticated
    if (!context.auth.isAuthenticated) {
      console.log('[_authenticated guard] Not authenticated, redirecting to login')
      throw redirect({ to: '/login' })
    }

    console.log('[_authenticated guard] Authenticated, allowing access')
  },
  component: () => <Outlet />,
})
