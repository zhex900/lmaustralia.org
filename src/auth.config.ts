import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { site } from './constants'
import { sendVerificationRequest } from './auth/sendVerificationRequest'

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || site.email,
      sendVerificationRequest,
    }),
  ],
}
