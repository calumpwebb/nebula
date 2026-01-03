# Forgot Password Feature Design

## Overview

Add OTP-based password reset flow to the login page, plus password confirmation to sign-up.

## User Flow

```
Sign-in form
    │
    │ clicks "Forgot password?"
    ▼
Email entry screen
    │
    │ submits → "If this email exists, we've sent a code"
    ▼
OTP entry screen (shared component)
    │
    │ valid code
    ▼
New password screen (password + confirm)
    │
    │ success → auto sign-in + toast
    ▼
Dashboard
```

## Decisions

| Decision         | Choice               | Rationale                                |
| ---------------- | -------------------- | ---------------------------------------- |
| Link placement   | Below password field | Standard UX pattern                      |
| Page structure   | Extend login page    | Consistent with sign-in/sign-up modes    |
| OTP → Password   | Two distinct screens | Matches existing email verification flow |
| Password entry   | Password + confirm   | Prevents typos                           |
| Success behavior | Auto sign-in + toast | Reduces friction                         |
| Unknown email    | Generic message      | Prevents account enumeration             |

## Components

### New: `OtpVerificationScreen`

Shared component for email verification and password reset OTP flows.

```tsx
type OtpVerificationScreenProps = {
  email: string
  description: string // "verification code sent to" vs "reset code sent to"
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  isVerifying: boolean
}
```

Includes:

- 6-digit OTP input
- 30-second countdown for resend
- Verify, resend, and back buttons

### Existing Components

- `TerminalInput` - with [CAPS] indicator for password fields
- `TerminalButton` - primary/secondary/link variants

## Login Page Modes

```tsx
type AuthMode =
  | 'sign-in'
  | 'sign-up'
  | 'verify-email'
  | 'forgot-password-email'
  | 'forgot-password-otp'
  | 'forgot-password-reset'
```

## UI Changes

### Sign-in Mode

Add "Forgot password?" link below password field:

```
$ email
┌─────────────────────────────────────────┐
│ user@example.com                        │
└─────────────────────────────────────────┘
$ password
┌─────────────────────────────────────────┐
│ ••••••••                                │
└─────────────────────────────────────────┘
Forgot password?  ← link variant button

[ sign in ]
```

### Sign-up Mode

Add confirm password field:

```
$ name
$ email
$ password
$ confirm password  ← new
[ create account ]
```

### Forgot Password - Email

```
// enter your email to receive a reset code

$ email
[ send reset code ]
< back to sign in
```

### Forgot Password - OTP

Uses shared `OtpVerificationScreen` with:

- description: "reset code sent to {email}"
- onVerify: validates OTP, transitions to reset screen
- onResend: calls `authClient.emailOtp.sendVerificationOtp`

### Forgot Password - Reset

```
// create your new password

$ new password
$ confirm password
[ reset password ]
```

## API Integration

No backend changes required. Uses existing `emailOTP` plugin.

### Send Reset Code

```tsx
await authClient.emailOtp.sendVerificationOtp({
  email,
  type: 'forget-password',
})
```

### Reset Password

```tsx
await authClient.emailOtp.resetPassword({
  email,
  otp,
  newPassword,
})
```

### Auto Sign-in After Reset

```tsx
await authClient.signIn.email({ email, password: newPassword })
toast.success('password reset successfully')
```

## Validation

| Field            | Rule                             |
| ---------------- | -------------------------------- |
| Email            | Required, valid format           |
| OTP              | Exactly 6 digits                 |
| Password         | Min 8 chars (when TODO restored) |
| Confirm password | Must match password              |

## Error Handling

| Scenario              | Message                                             |
| --------------------- | --------------------------------------------------- |
| Unknown email         | "if this email exists, we've sent a code" (generic) |
| Invalid OTP           | "invalid or expired code"                           |
| Expired OTP           | "code expired, please request a new one"            |
| Passwords don't match | "passwords do not match"                            |
| Rate limited          | "please wait X seconds"                             |

## Implementation Tasks

1. Extract `OtpVerificationScreen` component from login.tsx
2. Refactor login.tsx to use extracted component for email verification
3. Add `AuthMode` type with all modes
4. Add forgot password email entry screen
5. Add forgot password OTP screen (using shared component)
6. Add forgot password reset screen
7. Add "Forgot password?" link to sign-in mode
8. Add confirm password to sign-up mode
9. Update login.tsx to import `TerminalInput` and `TerminalButton` from components
