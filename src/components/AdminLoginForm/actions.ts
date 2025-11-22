'use server'

import { signIn } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type LoginLinkState = {
  success?: boolean
  errors?: {
    email?: string
  }
}

export async function createLoginLink(
  previousState: LoginLinkState,
  formData: FormData,
): Promise<LoginLinkState> {
  const email = formData.get('email') as string

  if (!email) {
    return {
      success: false,
      errors: {
        email: 'Email is required',
      },
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      errors: {
        email: 'Please enter a valid email address',
      },
    }
  }

  try {
    // Check if user exists before sending login link
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase().trim(),
        },
      },
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return {
        success: false,
        errors: {
          email: 'No account found with this email address.',
        },
      }
    }

    await signIn('resend', {
      email,
      redirect: false,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Login link error:', error)
    return {
      success: false,
      errors: {
        email: 'Failed to send login link. Please try again.',
      },
    }
  }
}
