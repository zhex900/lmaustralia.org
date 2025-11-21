import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { site } from './constants'

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
console.log({ resendApiKey })
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
      // Optional: Add domain verification
      // Make sure the domain in the 'from' email is verified in your Resend account
    }),
  ],
  secret,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
}
