import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../lib/auth-client'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export const Route = createFileRoute('/_public/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [formError, setFormError] = useState<string>('')

  useEffect(() => {
    if (session?.user) {
      navigate({ to: '/' })
    }
  }, [session, navigate])

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setFormError('')

      // Temporary delay for testing loading states
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
      })

      if (result.error) {
        setFormError(result.error.message || 'Sign up failed')
      } else {
        // Send sign-in OTP (also verifies email when used with signIn.emailOtp)
        await authClient.emailOtp.sendVerificationOtp({
          email: value.email,
          type: 'sign-in',
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate({ to: '/verify-email', state: { email: value.email } as any })
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
        className="bg-white rounded-lg border border-border shadow-card px-8 pt-8 pb-3"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Create account</h2>
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

        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0]
            return (
              <Input
                label="Name"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                {...(error ? { error } : {})}
                autoComplete="name"
                name="name"
                id="name"
                placeholder="Your name"
              />
            )
          }}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0]
            return (
              <Input
                label="Email"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                {...(error ? { error } : {})}
                autoFocus
                autoComplete="username"
                name="email"
                id="email"
                placeholder="you@example.com"
              />
            )
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Required'
              if (value.length < 8) return 'Password must be at least 8 characters'
              return undefined
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0]
            return (
              <Input
                label="Password"
                type="password"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                {...(error ? { error } : {})}
                autoComplete="new-password"
                name="password"
                id="password"
                placeholder="••••••••"
              />
            )
          }}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              if (!value) return 'Required'
              const password = fieldApi.form.getFieldValue('password')
              if (value && password !== value) return 'Passwords do not match'
              return undefined
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0]
            return (
              <Input
                label="Confirm password"
                type="password"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                {...(error ? { error } : {})}
                autoComplete="new-password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
              />
            )
          }}
        </form.Field>

        <div className="mt-4 space-y-3">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            )}
          </form.Subscribe>

          <div className="text-center">
            <span className="text-sm text-foreground-secondary">Already have an account? </span>
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors font-medium cursor-pointer"
              type="button"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
