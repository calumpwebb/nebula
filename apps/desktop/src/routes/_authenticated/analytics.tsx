import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: Analytics,
})

function Analytics() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
    </div>
  )
}
