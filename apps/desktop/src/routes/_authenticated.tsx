import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    // Wait for auth state to load before making redirect decision
    if (context.auth.isLoading) {
      return
    }
    // Redirect to login if not authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})
