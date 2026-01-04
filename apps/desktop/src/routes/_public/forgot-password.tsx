import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../lib/auth-client'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export const Route = createFileRoute('/_public/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string>('')

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      setFormError('')

      // Temporary delay for testing loading states
      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        await authClient.emailOtp.sendVerificationOtp({
          email: value.email,
          type: 'forget-password',
        })
        // @ts-expect-error - TanStack Router state typing doesn't support custom properties yet
        navigate({ to: '/reset-password', state: { email: value.email } })
      } catch {
        // Don't show error for security - proceed anyway
        // @ts-expect-error - TanStack Router state typing doesn't support custom properties yet
        navigate({ to: '/reset-password', state: { email: value.email } })
      }
    },
  })

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        autoComplete="on"
        className="bg-white rounded-lg border border-border shadow-card px-8 pt-4 pb-3"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Reset password</h2>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-md flex items-start gap-2">
            <svg
              className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-destructive">{formError}</p>
          </div>
        )}

        <form.Field name="email">
          {(field) => (
            <Input
              label="Email"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              {...(field.state.meta.errors[0] ? { error: field.state.meta.errors[0] } : {})}
              autoFocus
              autoComplete="username"
              name="email"
              id="email"
              placeholder="you@example.com"
            />
          )}
        </form.Field>

        <div className="mt-6 space-y-3">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset code'}
              </Button>
            )}
          </form.Subscribe>

          <div className="text-center">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
              type="button"
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
