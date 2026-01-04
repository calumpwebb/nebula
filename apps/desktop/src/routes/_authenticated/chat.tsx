import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

function Chat() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
    </div>
  )
}
