import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context }) => {
    // Only redirect to dashboard if definitely authenticated (not loading)
    if (!context.auth.isLoading && context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center font-mono">
      <Outlet />
    </div>
  )
}
