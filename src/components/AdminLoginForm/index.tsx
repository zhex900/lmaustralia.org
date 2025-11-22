'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { createLoginLink } from './actions'

type LoginLinkState = {
  success?: boolean
  errors?: {
    email?: string
  }
}

export function AdminLoginForm() {
  const [response, action, pending] = useActionState<LoginLinkState, FormData>(createLoginLink, {})

  return (
    <>
      <form
        action={action}
        className="login__form form"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <div className="login__form__inputWrap">
          <div className="field-type email" style={{ flex: '1, 1, auto ' }}>
            <label className="field-label" htmlFor="email">
              Email<span className="required">*</span>
            </label>
            <div className="field-type__wrap">
              <input id="email" type="email" required name="email" />
            </div>
          </div>
        </div>

        <div className="form-submit">
          <Button
            type="submit"
            disabled={pending}
            className="btn btn--icon-style-without-border btn--size-large btn--withoutPopup btn--style-primary btn--withoutPopup"
          >
            {pending ? 'Please wait...' : 'Send me a login link'}
          </Button>
          <div style={{ marginTop: '10px' }}>
            {response?.success && (
              <p style={{ color: 'rgb(55 213 17)' }}>
                Login link successfully sent! Check your email.
              </p>
            )}

            {response?.errors?.email && <p style={{ color: 'red' }}>{response.errors.email}</p>}
          </div>
        </div>
      </form>
    </>
  )
}
