import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects')({
  component: Projects,
})

function Projects() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
    </div>
  )
}
