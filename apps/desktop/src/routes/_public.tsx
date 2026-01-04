import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context }) => {
    console.log('[_public guard] isAuthenticated:', context.auth.isAuthenticated)

    if (context.auth.isAuthenticated) {
      console.log('[_public guard] Authenticated, redirecting to dashboard')
      throw redirect({ to: '/' })
    }

    console.log('[_public guard] Not authenticated, showing public page')
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-4">
      <Outlet />
    </div>
  )
}
