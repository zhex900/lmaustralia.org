interface ReCaptchaResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  score?: number
  action?: string
  'error-codes'?: string[]
}

export async function verifyRecaptcha(token: string): Promise<ReCaptchaResponse> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    throw new Error('reCAPTCHA secret key is not configured')
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${token}`,
  })

  if (!response.ok) {
    throw new Error('Failed to verify reCAPTCHA')
  }

  return response.json()
}

export function getMinScore(): number {
  return parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5')
}
