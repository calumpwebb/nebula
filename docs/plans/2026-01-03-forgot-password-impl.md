# Forgot Password Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add OTP-based password reset flow and password confirmation to sign-up.

**Architecture:** Extract shared OtpVerificationScreen component, add new auth modes to login page, integrate with Better Auth emailOtp plugin.

**Tech Stack:** React, TanStack Router, Better Auth, Tailwind CSS

---

## Task 1: Extract OtpVerificationScreen Component

**Files:**

- Create: `apps/desktop/src/components/OtpVerificationScreen.tsx`

**Step 1: Create the component**

```tsx
import { useState, useEffect } from 'react'
import { TerminalButton } from './TerminalButton'
import { NebulaLogo } from './NebulaLogo'

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
  verifyButtonText = '[ verify ]',
  verifyingButtonText = '[ verifying... ]',
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
    <div className="text-sm w-[380px]">
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <NebulaLogo />
        </div>

        <div className="text-white mb-4">
          <span className="text-gray-400">// </span>
          {description} {email}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-white font-bold">code:</span>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(value)
            }}
            placeholder="______"
            maxLength={6}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-gray-200 tracking-widest placeholder:text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <TerminalButton
            onClick={() => onVerify(otp)}
            disabled={otp.length !== 6 || isVerifying}
            variant="primary"
          >
            {isVerifying ? verifyingButtonText : verifyButtonText}
          </TerminalButton>

          <TerminalButton onClick={handleResend} disabled={countdown > 0} variant="secondary">
            {countdown > 0 ? `[ resend in ${countdown}s ]` : '[ resend code ]'}
          </TerminalButton>

          <TerminalButton onClick={onBack} variant="link">
            {'<'} back
          </TerminalButton>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 3: Commit**

```bash
git add apps/desktop/src/components/OtpVerificationScreen.tsx
git commit -m "feat(NEBULA-qmz): add OtpVerificationScreen component"
```

---

## Task 2: Refactor Login to Use OtpVerificationScreen

**Files:**

- Modify: `apps/desktop/src/routes/_public/login.tsx`

**Step 1: Update imports and remove inline OTP logic**

Replace the entire file with:

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { authClient } from '../../lib/auth-client'
import { useToast } from '../../components/Toast'
import { TerminalInput } from '../../components/TerminalInput'
import { NebulaLogo } from '../../components/NebulaLogo'
import { TerminalButton } from '../../components/TerminalButton'
import { OtpVerificationScreen } from '../../components/OtpVerificationScreen'

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
})

type AuthMode =
  | 'sign-in'
  | 'sign-up'
  | 'verify-email'
  | 'forgot-password-email'
  | 'forgot-password-otp'
  | 'forgot-password-reset'

function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: session } = authClient.useSession()

  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Navigate to dashboard when session becomes available
  useEffect(() => {
    if (session?.user) {
      navigate({ to: '/' })
    }
  }, [session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'sign-up' && password !== confirmPassword) {
      toast.error('passwords do not match')
      return
    }

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          toast.error(result.error.message || 'sign up failed')
        } else {
          setMode('verify-email')
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          if (result.error.status === 403) {
            toast.error('please verify your email before signing in')
            setMode('verify-email')
          } else if (result.error.status === 401 || result.error.status === 400) {
            toast.error('incorrect email or password')
          } else {
            toast.error(result.error.message || 'sign in failed')
          }
        }
      }
    } catch {
      toast.error('an unexpected error occurred')
    }
  }

  const handleResendVerification = async () => {
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      })
      if (result.error) {
        toast.error(result.error.message || 'failed to send verification code')
      } else {
        toast.success('verification code sent')
      }
    } catch {
      toast.error('failed to send verification code')
    }
  }

  const handleVerifyEmail = async (otp: string) => {
    if (otp.length !== 6) {
      toast.error('please enter a 6-digit code')
      return
    }

    setIsVerifying(true)

    try {
      const result = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      })
      if (result.error) {
        toast.error(result.error.message || 'invalid verification code')
      }
    } catch {
      toast.error('verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  // Verify email mode
  if (mode === 'verify-email') {
    return (
      <OtpVerificationScreen
        email={email}
        description="verification code sent to"
        onVerify={handleVerifyEmail}
        onResend={handleResendVerification}
        onBack={() => setMode('sign-in')}
        isVerifying={isVerifying}
      />
    )
  }

  // Sign-in / Sign-up form
  return (
    <div className="text-sm w-[380px]">
      <form onSubmit={handleSubmit} noValidate className="p-6">
        <div className="flex justify-center mb-6">
          <NebulaLogo />
        </div>

        <div className="text-white mb-4">
          <span className="text-primary">$ </span>
          {mode === 'sign-up' ? 'create_account' : 'sign_in'}
        </div>

        {mode === 'sign-up' && <TerminalInput label="name" value={name} onChange={setName} />}

        <TerminalInput label="email" value={email} onChange={setEmail} autoFocus />

        <TerminalInput label="password" type="password" value={password} onChange={setPassword} />

        {mode === 'sign-up' && (
          <TerminalInput
            label="confirm"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        )}

        <div className="mt-4 space-y-2">
          <TerminalButton type="submit" variant="primary">
            {mode === 'sign-up' ? '[ create account ]' : '[ sign in ]'}
          </TerminalButton>

          <TerminalButton
            onClick={() => {
              setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
              setConfirmPassword('')
            }}
            variant="link"
          >
            {mode === 'sign-up' ? '< already have account' : '> create new account'}
          </TerminalButton>
        </div>
      </form>
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 3: Manual test**

1. Run `just up`
2. Navigate to login page
3. Test sign-up flow with email verification
4. Test sign-in flow

**Step 4: Commit**

```bash
git add apps/desktop/src/routes/_public/login.tsx
git commit -m "refactor(NEBULA-qmz): use OtpVerificationScreen, add confirm password to sign-up"
```

---

## Task 3: Add Forgot Password Link to Sign-in

**Files:**

- Modify: `apps/desktop/src/routes/_public/login.tsx`

**Step 1: Add forgot password link below password field**

Find the sign-in password input and add link after it. In the form section, after the password TerminalInput and before the `<div className="mt-4 space-y-2">`, add:

```tsx
{
  mode === 'sign-in' && (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setMode('forgot-password-email')}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
      >
        forgot password?
      </button>
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 3: Commit**

```bash
git add apps/desktop/src/routes/_public/login.tsx
git commit -m "feat(NEBULA-qmz): add forgot password link to sign-in"
```

---

## Task 4: Add Forgot Password Email Screen

**Files:**

- Modify: `apps/desktop/src/routes/_public/login.tsx`

**Step 1: Add state for tracking if reset code was sent**

Add to state declarations:

```tsx
const [resetCodeSent, setResetCodeSent] = useState(false)
```

**Step 2: Add forgot password email handler**

Add after `handleVerifyEmail`:

```tsx
const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'forget-password',
    })
    // Always show success (security - don't reveal if account exists)
    toast.success('if this email exists, we sent a reset code')
    setResetCodeSent(true)
    setMode('forgot-password-otp')
  } catch {
    // Still show success message for security
    toast.success('if this email exists, we sent a reset code')
    setResetCodeSent(true)
    setMode('forgot-password-otp')
  }
}
```

**Step 3: Add forgot password email screen**

Add before the sign-in/sign-up form return statement:

```tsx
// Forgot password - email entry
if (mode === 'forgot-password-email') {
  return (
    <div className="text-sm w-[380px]">
      <form onSubmit={handleForgotPasswordSubmit} noValidate className="p-6">
        <div className="flex justify-center mb-6">
          <NebulaLogo />
        </div>

        <div className="text-white mb-4">
          <span className="text-gray-400">// </span>
          enter your email to receive a reset code
        </div>

        <TerminalInput label="email" value={email} onChange={setEmail} autoFocus />

        <div className="mt-4 space-y-2">
          <TerminalButton type="submit" variant="primary">
            [ send reset code ]
          </TerminalButton>

          <TerminalButton
            onClick={() => {
              setMode('sign-in')
              setResetCodeSent(false)
            }}
            variant="link"
          >
            {'<'} back to sign in
          </TerminalButton>
        </div>
      </form>
    </div>
  )
}
```

**Step 4: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/desktop/src/routes/_public/login.tsx
git commit -m "feat(NEBULA-qmz): add forgot password email entry screen"
```

---

## Task 5: Add Forgot Password OTP Screen

**Files:**

- Modify: `apps/desktop/src/routes/_public/login.tsx`

**Step 1: Add state for storing verified OTP**

Add to state declarations:

```tsx
const [verifiedOtp, setVerifiedOtp] = useState('')
```

**Step 2: Add handlers for forgot password OTP**

Add after `handleForgotPasswordSubmit`:

```tsx
const handleResendResetCode = async () => {
  try {
    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'forget-password',
    })
    if (result.error) {
      toast.error(result.error.message || 'failed to send reset code')
    } else {
      toast.success('reset code sent')
    }
  } catch {
    toast.error('failed to send reset code')
  }
}

const handleVerifyResetCode = async (otp: string) => {
  if (otp.length !== 6) {
    toast.error('please enter a 6-digit code')
    return
  }

  // Store OTP and move to password reset screen
  // The actual verification happens when we reset the password
  setVerifiedOtp(otp)
  setMode('forgot-password-reset')
}
```

**Step 3: Add forgot password OTP screen**

Add after the forgot-password-email screen:

```tsx
// Forgot password - OTP entry
if (mode === 'forgot-password-otp') {
  return (
    <OtpVerificationScreen
      email={email}
      description="reset code sent to"
      onVerify={handleVerifyResetCode}
      onResend={handleResendResetCode}
      onBack={() => {
        setMode('forgot-password-email')
        setVerifiedOtp('')
      }}
      isVerifying={false}
      verifyButtonText="[ verify code ]"
    />
  )
}
```

**Step 4: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/desktop/src/routes/_public/login.tsx
git commit -m "feat(NEBULA-qmz): add forgot password OTP verification screen"
```

---

## Task 6: Add Forgot Password Reset Screen

**Files:**

- Modify: `apps/desktop/src/routes/_public/login.tsx`

**Step 1: Add state for new password fields**

Add to state declarations:

```tsx
const [newPassword, setNewPassword] = useState('')
const [confirmNewPassword, setConfirmNewPassword] = useState('')
```

**Step 2: Add password reset handler**

Add after `handleVerifyResetCode`:

```tsx
const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault()

  if (newPassword !== confirmNewPassword) {
    toast.error('passwords do not match')
    return
  }

  if (newPassword.length < 1) {
    toast.error('password is required')
    return
  }

  setIsVerifying(true)

  try {
    const result = await authClient.emailOtp.resetPassword({
      email,
      otp: verifiedOtp,
      password: newPassword,
    })

    if (result.error) {
      toast.error(result.error.message || 'failed to reset password')
      // If OTP was invalid, go back to OTP screen
      if (result.error.message?.includes('invalid') || result.error.message?.includes('expired')) {
        setMode('forgot-password-otp')
        setVerifiedOtp('')
      }
    } else {
      // Auto sign-in
      const signInResult = await authClient.signIn.email({
        email,
        password: newPassword,
      })

      if (signInResult.error) {
        toast.success('password reset successfully')
        setMode('sign-in')
        resetForgotPasswordState()
      } else {
        toast.success('password reset successfully')
        // Session watcher will navigate to dashboard
      }
    }
  } catch {
    toast.error('failed to reset password')
  } finally {
    setIsVerifying(false)
  }
}

const resetForgotPasswordState = () => {
  setNewPassword('')
  setConfirmNewPassword('')
  setVerifiedOtp('')
  setResetCodeSent(false)
}
```

**Step 3: Add forgot password reset screen**

Add after the forgot-password-otp screen:

```tsx
// Forgot password - new password entry
if (mode === 'forgot-password-reset') {
  return (
    <div className="text-sm w-[380px]">
      <form onSubmit={handleResetPassword} noValidate className="p-6">
        <div className="flex justify-center mb-6">
          <NebulaLogo />
        </div>

        <div className="text-white mb-4">
          <span className="text-gray-400">// </span>
          create your new password
        </div>

        <TerminalInput
          label="password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          autoFocus
        />

        <TerminalInput
          label="confirm"
          type="password"
          value={confirmNewPassword}
          onChange={setConfirmNewPassword}
        />

        <div className="mt-4 space-y-2">
          <TerminalButton type="submit" variant="primary" disabled={isVerifying}>
            {isVerifying ? '[ resetting... ]' : '[ reset password ]'}
          </TerminalButton>

          <TerminalButton
            onClick={() => {
              setMode('forgot-password-otp')
              setNewPassword('')
              setConfirmNewPassword('')
            }}
            variant="link"
          >
            {'<'} back
          </TerminalButton>
        </div>
      </form>
    </div>
  )
}
```

**Step 4: Verify types compile**

Run: `pnpm turbo check --filter=@nebula/desktop`
Expected: PASS

**Step 5: Manual test full flow**

1. Run `just up`
2. Create a new account
3. Sign out
4. Click "forgot password?"
5. Enter email
6. Check Mailpit (localhost:8025) for reset code
7. Enter code
8. Set new password
9. Verify auto sign-in works

**Step 6: Commit**

```bash
git add apps/desktop/src/routes/_public/login.tsx
git commit -m "feat(NEBULA-qmz): add forgot password reset screen with auto sign-in"
```

---

## Task 7: Final Cleanup and Close Ticket

**Step 1: Update ticket status**

```bash
bd close NEBULA-qmz --reason="Implemented forgot password with OTP flow and sign-up password confirmation"
```

**Step 2: Sync beads**

```bash
bd sync
```

**Step 3: Push changes**

```bash
git push
```
