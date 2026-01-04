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
    // Temporary delay for testing loading states
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use signIn.emailOtp instead of verifyEmail to both verify AND create session
    const result = await authClient.signIn.emailOtp({
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

    // Session created, useEffect will handle navigation
    return undefined
  }

  const handleResend = async () => {
    // Temporary delay for testing loading states
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
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
