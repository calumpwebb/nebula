import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { requireActionCtx } from '@convex-dev/better-auth/utils'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import { components, internal } from '../../_generated/api'
import type { DataModel } from '../../_generated/dataModel'
import { betterAuth } from 'better-auth/minimal'
import { emailOTP } from 'better-auth/plugins'
import authConfig from '../../auth.config'
import { sendEmail } from '../../lib/emails'
import { render } from '@react-email/render'
import { VerificationCodeEmail } from '../../lib/email-templates/VerificationCodeEmail'

// TODO(NEBULA-uy7): Set SITE_URL env var in production
const siteUrl = process.env.SITE_URL ?? 'http://localhost:1420'

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>): ReturnType<typeof betterAuth> => {
  return betterAuth({
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      // TODO(NEBULA-c36): Integrate Resend for real email delivery
      sendResetPasswordEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
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
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig }),
      emailOTP({
        expiresIn: 600, // 10 minutes
        sendVerificationOnSignUp: false,
        async sendVerificationOTP({ email, otp, type }) {
          // Enforce 30s cooldown between OTP sends
          const actionCtx = requireActionCtx(ctx)
          const { ok, retryAfter } = await actionCtx.runMutation(
            internal.features.auth.mutations.checkOtpRateLimit,
            { email }
          )

          if (!ok) {
            throw new Error(
              `Please wait ${Math.ceil((retryAfter ?? 30000) / 1000)} seconds before requesting another code`
            )
          }

          const subject =
            type === 'sign-in'
              ? 'Your Nebula sign-in code'
              : type === 'forget-password'
                ? 'Your Nebula password reset code'
                : 'Verify your Nebula account'

          const html = await render(
            VerificationCodeEmail({
              email,
              code: otp,
              type,
            })
          )

          await sendEmail(email, subject, html)
        },
      }),
    ],
  })
}
