import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../lib/auth-client'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { OtpVerificationScreen } from '../../components/OtpVerificationScreen'

export const Route = createFileRoute('/_public/reset-password')({
  component: ResetPasswordPage,
})

type ResetPasswordMode = 'otp' | 'password'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session } = authClient.useSession()
  const email = (location.state as { email?: string } | undefined)?.email || ''
  const [mode, setMode] = useState<ResetPasswordMode>('otp')
  const [verifiedOtp, setVerifiedOtp] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    if (session?.user) {
      navigate({ to: '/' })
    }
  }, [session, navigate])

  useEffect(() => {
    if (!email) {
      navigate({ to: '/forgot-password' })
    }
  }, [email, navigate])

  const form = useForm({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: async ({ value }) => {
      setFormError('')

      setIsResetting(true)

      try {
        const result = await authClient.emailOtp.resetPassword({
          email,
          otp: verifiedOtp,
          password: value.newPassword,
        })

        if (result.error) {
          setFormError(result.error.message || 'Failed to reset password')
          if (
            result.error.message?.includes('invalid') ||
            result.error.message?.includes('expired')
          ) {
            setMode('otp')
            setVerifiedOtp('')
          }
        } else {
          // Auto sign-in
          const signInResult = await authClient.signIn.email({
            email,
            password: value.newPassword,
          })

          if (signInResult.error) {
            navigate({ to: '/login' })
          }
          // useEffect will navigate to dashboard once session updates
        }
      } catch {
        setFormError('Failed to reset password')
      } finally {
        setIsResetting(false)
      }
    },
  })

  if (!email) {
    return null
  }

  const handleVerifyOtp = async (otp: string) => {
    setVerifiedOtp(otp)
    setMode('password')
    return
  }

  const handleResendOtp = async () => {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'forget-password',
    })
  }

  if (mode === 'otp') {
    return (
      <OtpVerificationScreen
        email={email}
        description="Please enter the 6 digit code sent to"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={() => {
          navigate({ to: '/forgot-password' })
          setVerifiedOtp('')
        }}
        verifyButtonText="Verify code"
      />
    )
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        className="bg-white rounded-lg border border-border shadow-card px-8 pt-8 pb-3"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Set new password</h2>
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
          name="newPassword"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <Input
              label="New password"
              type="password"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              {...(field.state.meta.errors[0] ? { error: field.state.meta.errors[0] } : {})}
              autoFocus
              placeholder="••••••••"
            />
          )}
        </form.Field>

        <form.Field
          name="confirmNewPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              if (!value) return 'Required'
              const newPassword = fieldApi.form.getFieldValue('newPassword')
              if (value && newPassword !== value) return 'Passwords do not match'
              return undefined
            },
          }}
        >
          {(field) => (
            <Input
              label="Confirm password"
              type="password"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              {...(field.state.meta.errors[0] ? { error: field.state.meta.errors[0] } : {})}
              placeholder="••••••••"
            />
          )}
        </form.Field>

        <div className="mt-6 space-y-3">
          <Button type="submit" variant="primary" disabled={isResetting} className="w-full">
            {isResetting ? 'Resetting...' : 'Reset password'}
          </Button>

          <div className="text-center">
            <button
              onClick={() => {
                setMode('otp')
                form.reset()
              }}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
              type="button"
            >
              ← Back
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
