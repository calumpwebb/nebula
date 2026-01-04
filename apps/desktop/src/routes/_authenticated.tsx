import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    // Redirect to login if not authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex h-full bg-background px-3 pb-3 gap-3">
      <Sidebar />
      <Outlet />
    </div>
  )
}
