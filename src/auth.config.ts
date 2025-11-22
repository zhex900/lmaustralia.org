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

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || site.email,
      sendVerificationRequest,
    }),
  ],
}
