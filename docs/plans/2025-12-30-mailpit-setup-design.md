# Mailpit Setup for Dev Email Capture

**Ticket:** NEBULA-0gz
**Status:** Design approved
**Scope:** Local dev only (k3d), staging later

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  k3d cluster (nebula)                                       │
│                                                             │
│  ┌─────────────┐    SMTP (1025)    ┌─────────────┐         │
│  │   Convex    │ ────────────────► │   Mailpit   │         │
│  │  (auth.ts)  │                   │             │         │
│  └─────────────┘                   └─────────────┘         │
│                                           │                 │
└───────────────────────────────────────────│─────────────────┘
                                            │ port forward
                                            ▼
                                    localhost:8025 (Web UI)
```

## Decisions

| Decision | Choice |
|----------|--------|
| Scope | Local dev only (staging later) |
| Email delivery | SMTP via nodemailer |
| UI access | Tilt port forward (localhost:8025) |
| Mailpit image | `axllent/mailpit:latest` |

## Files to Create

### `apps/mailpit/deploy/manifest.ts`

```typescript
import { app } from '../../../infra/lib'

export default app('mailpit', {
  image: 'axllent/mailpit:latest',
  env: {
    MP_SMTP_AUTH_ACCEPT_ANY: '1',
    MP_SMTP_AUTH_ALLOW_INSECURE: '1',
  },
  labels: ['nebula'],
  portForwards: ['8025:8025'],
})
```

### `packages/convex/convex/lib/email.ts`

```typescript
import nodemailer from 'nodemailer'

const isDev = process.env.CONVEX_CLOUD_URL?.includes('localhost') ?? true

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'mailpit',
  port: parseInt(process.env.SMTP_PORT ?? '1025'),
  secure: false,
})

export async function sendEmail(to: string, subject: string, html: string) {
  if (!isDev) {
    throw new Error('Production email not configured - use Resend SDK')
  }

  await transporter.sendMail({
    from: 'noreply@nebula.local',
    to,
    subject,
    html,
  })
}
```

## Files to Modify

### `packages/convex/convex/auth.ts`

Update email callbacks to use the new helper:

```typescript
import { sendEmail } from './lib/email'

// In createAuth():
sendVerificationEmail: async ({ user, url }) => {
  await sendEmail(
    user.email,
    'Verify your email',
    `<a href="${url}">Click to verify</a>`
  )
},
sendResetPasswordEmail: async ({ user, url }) => {
  await sendEmail(
    user.email,
    'Reset your password',
    `<a href="${url}">Click to reset</a>`
  )
},
```

### `packages/convex/package.json`

Add nodemailer:

```bash
pnpm add nodemailer --filter=@nebula/convex
pnpm add -D @types/nodemailer --filter=@nebula/convex
```

### `infra/config.ts`

Add SMTP config:

```typescript
export const mailpitConfig = {
  SMTP_HOST: 'mailpit',
  SMTP_PORT: '1025',
}
```

## Access

| Service | URL |
|---------|-----|
| Mailpit UI | localhost:8025 |
| SMTP (internal) | mailpit:1025 |

## Testing

1. `just up`
2. Sign up in the app
3. Check `localhost:8025` - verification email appears

## Future: Staging

When adding staging:
- Deploy Mailpit to staging cluster
- Use same manifest with different port forwards
- Consider authentication for staging UI
