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
  const { data: session } = authClient.useSession()
  const email = (location.state as { email?: string } | undefined)?.email || ''

  useEffect(() => {
    if (session?.user) {
      navigate({ to: '/' })
    }
  }, [session, navigate])

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
      return {
        error: {
          message: result.error.message || 'Incorrect code. Please check your email and try again.',
        },
      }
    }

    navigate({ to: '/' })
    return undefined
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
      description="Please enter the 6 digit code sent to"
      onVerify={handleVerify}
      onResend={handleResend}
      onBack={() => navigate({ to: '/login' })}
    />
  )
}
