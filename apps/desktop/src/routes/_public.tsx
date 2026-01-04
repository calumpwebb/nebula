import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
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
