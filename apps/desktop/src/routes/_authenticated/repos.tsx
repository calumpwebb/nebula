import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/repos')({
  component: Repos,
})

function Repos() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Repos</h1>
    </div>
  )
}
