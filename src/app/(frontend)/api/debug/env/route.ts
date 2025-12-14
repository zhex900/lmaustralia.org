import { NextResponse } from 'next/server'

/**
 * Debug route to check if NEXT_PUBLIC_RECAPTCHA_SITE_KEY exists in production
 * Access at: /api/debug/env
 *
 * ⚠️ REMOVE THIS FILE AFTER CHECKING - it exposes environment variable status
 */
export async function GET() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  return NextResponse.json({
    recaptchaSiteKey,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    exists: !!recaptchaSiteKey,
  })
}
