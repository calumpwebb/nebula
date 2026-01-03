import { getEnvironment, Environment } from '@nebula/shared'

const env = getEnvironment()

// Mailpit API endpoint (local dev only)
const MAILPIT_API = process.env.MAILPIT_API_URL ?? 'http://mailpit:8025/api/v1/send'

/** Send email via Mailpit HTTP API */
export async function sendEmail(to: string, subject: string, html: string) {
  if (env === Environment.Production) {
    // TODO(NEBULA-c36): Use Resend SDK
    throw new Error('Production email not configured')
  }

  const response = await fetch(MAILPIT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      From: { Email: 'noreply@nebula.local', Name: 'Nebula' },
      To: [{ Email: to }],
      Subject: subject,
      HTML: html,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.status} ${response.statusText}`)
  }
}
