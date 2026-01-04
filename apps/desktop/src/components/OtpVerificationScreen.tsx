import { useState, useEffect } from 'react'
import { Button } from './Button'

type OtpVerificationScreenProps = {
  email: string
  description: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  isVerifying: boolean
  verifyButtonText?: string
  verifyingButtonText?: string
}

export function OtpVerificationScreen({
  email,
  description,
  onVerify,
  onResend,
  onBack,
  isVerifying,
  verifyButtonText = 'Verify',
  verifyingButtonText = 'Verifying...',
}: OtpVerificationScreenProps) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0) return
    await onResend()
    setCountdown(30)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-[var(--card-shadow)] p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Enter verification code</h2>
          <p className="text-sm text-foreground-secondary">
            {description} <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
            Verification code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(value)
            }}
            placeholder="000000"
            maxLength={6}
            autoFocus
            className="w-full px-4 py-3 text-center text-2xl tracking-wider bg-background border border-input rounded-md transition-colors focus:outline-none focus:border-input-focus focus:ring-1 focus:ring-ring font-mono"
          />
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onVerify(otp)}
            disabled={otp.length !== 6 || isVerifying}
            variant="primary"
            className="w-full"
          >
            {isVerifying ? verifyingButtonText : verifyButtonText}
          </Button>

          <Button
            onClick={handleResend}
            disabled={countdown > 0}
            variant="secondary"
            className="w-full"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </Button>

          <div className="text-center pt-2">
            <button
              onClick={onBack}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
