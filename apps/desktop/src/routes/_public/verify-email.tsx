import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authClient } from '../../lib/auth-client'
import { OtpVerificationScreen } from '../../components/OtpVerificationScreen'

export const Route = createFileRoute('/_public/verify-email')({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | undefined)?.email || ''

  useEffect(() => {
    if (!email) {
      navigate({ to: '/signup' })
    }
  }, [email, navigate])

  if (!email) {
    return null
  }

  const handleVerify = async (otp: string) => {
    const result = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    })

    if (result.error) {
      return { error: { message: result.error.message || 'Invalid verification code' } }
    }
    // Session watcher will navigate to dashboard
    return
  }

  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    })
  }

  return (
    <OtpVerificationScreen
      email={email}
      description="Verification code sent to"
      onVerify={handleVerify}
      onResend={handleResend}
      onBack={() => navigate({ to: '/login' })}
    />
  )
}
