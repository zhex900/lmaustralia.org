import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { site } from './constants'
import { send } from './emails/login-link-email'

export async function sendVerificationRequest(params: {
  identifier: string
  provider: any
  url: string
  theme: any
}) {
  const { identifier: email, url } = params
  console.log('Using custom email template for:', email)

  try {
    // Use custom email template from login-link-email.tsx
    await send({ email, url: new URL(url) })
    console.log('Custom email sent successfully')
  } catch (error) {
    console.error('Error sending custom email:', error)
    throw error
  }
}
// Ensure secret is always defined
const secret =
  process.env.AUTH_SECRET ||
  process.env.PAYLOAD_SECRET ||
  'KQZAyrg6DmRpO2NeKmSeVUfROev8RgKHutbWMGqbI5I='

if (!secret) {
  throw new Error('AUTH_SECRET or PAYLOAD_SECRET must be set')
}

// Ensure Resend API key is set
const resendApiKey = process.env.RESEND_API_KEY || process.env.AUTH_RESEND_KEY

if (!resendApiKey) {
  throw new Error('RESEND_API_KEY or AUTH_RESEND_KEY must be set')
}

// Validate API key format (Resend keys start with 're_')
if (!resendApiKey.startsWith('re_')) {
  console.warn('Warning: RESEND_API_KEY does not appear to be a valid Resend API key format')
}

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      apiKey: resendApiKey,
      from: process.env.EMAIL_FROM || site.email,
      sendVerificationRequest,
    }),
  ],
}
