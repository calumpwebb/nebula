import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from './Button'

type OtpVerificationScreenProps = {
  email: string
  description: string
  onVerify: (otp: string) => Promise<{ error?: { message?: string } } | void>
  onResend: () => Promise<void>
  onBack: () => void
  verifyButtonText?: string
}

export function OtpVerificationScreen({
  email,
  description,
  onVerify,
  onResend,
  onBack,
  verifyButtonText = 'Verify',
}: OtpVerificationScreenProps) {
  const [formError, setFormError] = useState<string>('')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: async ({ value }) => {
      setFormError('')

      if (value.otp.length !== 6) {
        setFormError('Please enter a 6-digit code')
        return
      }

      const result = await onVerify(value.otp)
      if (result?.error) {
        setFormError(
          result.error.message || 'Incorrect code. Please check your email and try again.'
        )
      }
    },
  })

  const handleResend = async () => {
    setFormError('')
    await onResend()
    setCountdown(30)
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        className="bg-white rounded-lg border border-border shadow-card px-8 pt-4 pb-3"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Enter verification code</h2>
          <p className="text-sm text-foreground-secondary">
            {description} <span className="font-medium">{email}</span>
          </p>
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

        <form.Field name="otp">
          {(field) => (
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                value={field.state.value}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  field.handleChange(value)
                  setFormError('')
                }}
                placeholder="000000"
                maxLength={6}
                autoFocus
                className="w-full px-4 py-3 text-center text-2xl tracking-wider bg-background border border-input rounded-md font-mono transition-colors focus:outline-none focus:ring-1 focus:border-input-focus focus:ring-ring"
              />
            </div>
          )}
        </form.Field>

        <div className="space-y-3">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                {isSubmitting ? 'Verifying...' : verifyButtonText}
              </Button>
            )}
          </form.Subscribe>

          <Button
            onClick={handleResend}
            disabled={countdown > 0}
            variant="secondary"
            className="w-full"
            type="button"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </Button>

          <div className="text-center">
            <button
              onClick={onBack}
              type="button"
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
