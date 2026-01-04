# Auth Routes Refactor

## Current State

Single `/login` component with 6 modes controlled by state. 455+ lines, hard to test, no deep linking.

## Goal

Split into separate routes for cleaner architecture and better UX.

## Route Structure

```
/_public/login.tsx          → Sign in
/_public/signup.tsx         → Sign up
/_public/verify-email.tsx   → Email verification (OTP)
/_public/forgot-password.tsx → Email entry
/_public/reset-password.tsx → OTP + new password entry
```

## Shared State Strategy

Use TanStack Router's `navigate({ to: '/route', state: { email } })` to pass data between routes.

## Implementation Steps

1. Create new route files in `apps/desktop/src/routes/_public/`
2. Extract each mode block into its own route component
3. Update navigation calls (`setMode` → `router.navigate`)
4. Share `email` state via router state
5. Update redirect logic in `_public.tsx` layout
6. Delete old login.tsx after migration
7. Test all flows end-to-end

## Key Files

- `apps/desktop/src/routes/_public/login.tsx` (current monolith)
- `apps/desktop/src/components/Input.tsx` (shared)
- `apps/desktop/src/components/Button.tsx` (shared)
- `apps/desktop/src/components/OtpVerificationScreen.tsx` (may need updates)

## Success Criteria

- Browser back button works naturally
- Can bookmark/deep link to any auth flow
- Each component < 150 lines
- All existing auth functionality preserved
