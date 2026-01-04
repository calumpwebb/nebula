import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users')({
  component: Users,
})

function Users() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
    </div>
  )
}
