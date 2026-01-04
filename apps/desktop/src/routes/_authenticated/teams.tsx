import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/teams')({
  component: Teams,
})

function Teams() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Teams</h1>
    </div>
  )
}
