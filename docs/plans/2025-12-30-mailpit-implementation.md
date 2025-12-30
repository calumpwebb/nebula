# Mailpit Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up Mailpit in k3d for local dev email capture, wired to Better Auth via nodemailer.

**Architecture:** Mailpit runs as a k8s deployment, receiving emails via SMTP on port 1025. Convex auth.ts uses nodemailer to send verification/reset emails to Mailpit. Web UI accessible via Tilt port forward on localhost:8025.

**Tech Stack:** Mailpit, nodemailer, cdk8s, Tilt

---

## Task 1: Install nodemailer

**Files:**
- Modify: `packages/convex/package.json`

**Step 1: Add nodemailer dependency**

```bash
pnpm add nodemailer --filter=@nebula/convex
pnpm add -D @types/nodemailer --filter=@nebula/convex
```

**Step 2: Verify installation**

```bash
cat packages/convex/package.json | grep nodemailer
```

Expected: Shows `"nodemailer"` in dependencies and `"@types/nodemailer"` in devDependencies.

**Step 3: Commit**

```bash
git add packages/convex/package.json pnpm-lock.yaml
git commit -m "chore(NEBULA-0gz): add nodemailer for SMTP email sending"
```

---

## Task 2: Create email helper

**Files:**
- Create: `packages/convex/convex/lib/email.ts`

**Step 1: Create the email helper**

```typescript
// packages/convex/convex/lib/email.ts

import nodemailer from 'nodemailer'

// Dev environment check - Convex local backend uses localhost URL
const isDev = process.env.CONVEX_CLOUD_URL?.includes('localhost') ?? true

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'mailpit',
  port: parseInt(process.env.SMTP_PORT ?? '1025'),
  secure: false, // Mailpit doesn't need TLS
})

/**
 * Send an email via SMTP.
 * In dev: sends to Mailpit (localhost:8025 to view)
 * In prod: throws until Resend is configured
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (!isDev) {
    // TODO(NEBULA-c36): Integrate Resend for production
    throw new Error('Production email not configured - use Resend SDK')
  }

  await transporter.sendMail({
    from: 'Nebula <noreply@nebula.local>',
    to,
    subject,
    html,
  })
}
```

**Step 2: Verify TypeScript compiles**

```bash
pnpm turbo check --filter=@nebula/convex
```

Expected: No errors (or existing errors only, no new ones from email.ts)

**Step 3: Commit**

```bash
git add packages/convex/convex/lib/email.ts
git commit -m "feat(NEBULA-0gz): add email helper with nodemailer"
```

---

## Task 3: Wire auth.ts to use email helper

**Files:**
- Modify: `packages/convex/convex/auth.ts:24-29`

**Step 1: Add import at top of file**

Add after existing imports:

```typescript
import { sendEmail } from './lib/email'
```

**Step 2: Replace console.log callbacks**

Replace the `sendVerificationEmail` callback (around line 24):

```typescript
sendVerificationEmail: async ({ user, url }) => {
  await sendEmail(
    user.email,
    'Verify your Nebula account',
    `
    <h1>Welcome to Nebula!</h1>
    <p>Click the link below to verify your email address:</p>
    <p><a href="${url}">Verify Email</a></p>
    <p>This link expires in 15 minutes.</p>
    `
  )
},
```

Replace the `sendResetPasswordEmail` callback (around line 27):

```typescript
sendResetPasswordEmail: async ({ user, url }) => {
  await sendEmail(
    user.email,
    'Reset your Nebula password',
    `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <p><a href="${url}">Reset Password</a></p>
    <p>If you didn't request this, ignore this email.</p>
    `
  )
},
```

**Step 3: Verify TypeScript compiles**

```bash
pnpm turbo check --filter=@nebula/convex
```

Expected: No errors

**Step 4: Commit**

```bash
git add packages/convex/convex/auth.ts
git commit -m "feat(NEBULA-0gz): wire auth emails to SMTP via sendEmail helper"
```

---

## Task 4: Create Mailpit manifest

**Files:**
- Create: `apps/mailpit/deploy/manifest.ts`

**Step 1: Create directory**

```bash
mkdir -p apps/mailpit/deploy
```

**Step 2: Create manifest**

```typescript
// apps/mailpit/deploy/manifest.ts

import { app } from '../../../infra/lib'

export default app('mailpit', {
  image: 'axllent/mailpit:latest',
  labels: ['nebula'],
  portForwards: ['8025:8025'],
  probe: { type: 'http', path: '/livez', port: 8025 },
  env: {
    MP_SMTP_AUTH_ACCEPT_ANY: '1',
    MP_SMTP_AUTH_ALLOW_INSECURE: '1',
  },
})
```

**Step 3: Regenerate Tilt config**

```bash
just synth
```

Expected: No errors, `infra/dist/Tiltfile.generated` updated

**Step 4: Verify mailpit appears in generated config**

```bash
grep -l mailpit infra/dist/*
```

Expected: Shows files containing mailpit configuration

**Step 5: Commit**

```bash
git add apps/mailpit/deploy/manifest.ts infra/dist/
git commit -m "feat(NEBULA-0gz): add mailpit k8s deployment"
```

---

## Task 5: Test the integration

**Step 1: Start the cluster**

```bash
just up
```

Expected: All services start, including mailpit

**Step 2: Verify Mailpit UI is accessible**

Open browser: http://localhost:8025

Expected: Mailpit web UI loads (empty inbox)

**Step 3: Test email flow**

1. Open desktop app or http://localhost:1420
2. Click "Sign Up"
3. Enter email and password
4. Submit

**Step 4: Check Mailpit**

Open browser: http://localhost:8025

Expected: Verification email appears in inbox with "Verify your Nebula account" subject

**Step 5: Update ticket status**

```bash
bd update NEBULA-0gz --status done
```

---

## Summary

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Install nodemailer | `chore(NEBULA-0gz): add nodemailer...` |
| 2 | Create email.ts helper | `feat(NEBULA-0gz): add email helper...` |
| 3 | Wire auth.ts | `feat(NEBULA-0gz): wire auth emails...` |
| 4 | Create mailpit manifest | `feat(NEBULA-0gz): add mailpit k8s...` |
| 5 | Test integration | (manual verification) |

**Total: 4 commits, ~5 tasks**
