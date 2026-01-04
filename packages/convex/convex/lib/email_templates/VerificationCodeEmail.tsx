import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading } from '@react-email/components'
import { designTokens } from '@nebula/shared'

interface VerificationCodeEmailProps {
  email: string
  code: string
  type: 'sign-in' | 'email-verification' | 'forget-password'
}

export function VerificationCodeEmail({ email, code, type }: VerificationCodeEmailProps) {
  const title =
    type === 'sign-in'
      ? 'Sign in to Nebula'
      : type === 'forget-password'
        ? 'Reset your password'
        : 'Verify your email'

  const description =
    type === 'sign-in'
      ? 'Please enter the 6 digit code sent to'
      : type === 'forget-password'
        ? 'Please enter the 6 digit code to reset your password for'
        : 'Please enter the 6 digit code sent to'

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            {/* Header */}
            <Heading style={styles.heading}>{title}</Heading>
            <Text style={styles.description}>
              {description} <span style={styles.email}>{email}</span>
            </Text>

            {/* Verification Code */}
            <Section style={styles.codeSection}>
              <Text style={styles.codeLabel}>Verification code</Text>
              <div style={styles.codeBox}>
                <Text style={styles.code}>{code}</Text>
              </div>
            </Section>

            {/* Footer */}
            <Text style={styles.footer}>This code expires in 10 minutes.</Text>
            <Text style={styles.footerSecondary}>
              If you didn't request this code, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: designTokens.colors.background,
    fontFamily: designTokens.typography.fontFamily.sans,
    margin: 0,
    padding: '40px 0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: designTokens.colors.surface,
    border: `1px solid ${designTokens.colors.border}`,
    borderRadius: designTokens.borderRadius.lg,
    padding: '48px 32px 32px',
    boxShadow: designTokens.shadows.card,
  },
  heading: {
    color: designTokens.colors.foreground,
    fontSize: designTokens.typography.fontSize['2xl'],
    fontWeight: designTokens.typography.fontWeight.semibold,
    margin: '0 0 12px',
    textAlign: 'center' as const,
    lineHeight: designTokens.typography.lineHeight.tight,
  },
  description: {
    color: designTokens.colors.foregroundSecondary,
    fontSize: designTokens.typography.fontSize.sm,
    margin: '0 0 32px',
    textAlign: 'center' as const,
    lineHeight: designTokens.typography.lineHeight.normal,
  },
  email: {
    color: designTokens.colors.foreground,
    fontWeight: designTokens.typography.fontWeight.medium,
  },
  codeSection: {
    margin: '0 0 32px',
  },
  codeLabel: {
    color: designTokens.colors.foreground,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    margin: '0 0 8px',
  },
  codeBox: {
    backgroundColor: designTokens.colors.background,
    border: `1px solid ${designTokens.colors.input}`,
    borderRadius: designTokens.borderRadius.md,
    padding: '16px',
    textAlign: 'center' as const,
  },
  code: {
    color: designTokens.colors.foreground,
    fontSize: designTokens.typography.fontSize['3xl'],
    fontWeight: designTokens.typography.fontWeight.semibold,
    letterSpacing: '4px',
    fontFamily: designTokens.typography.fontFamily.mono,
    margin: 0,
  },
  footer: {
    color: designTokens.colors.foregroundSecondary,
    fontSize: designTokens.typography.fontSize.sm,
    margin: '0 0 8px',
    textAlign: 'center' as const,
  },
  footerSecondary: {
    color: designTokens.colors.foregroundTertiary,
    fontSize: designTokens.typography.fontSize.xs,
    margin: 0,
    textAlign: 'center' as const,
  },
}

export default VerificationCodeEmail
