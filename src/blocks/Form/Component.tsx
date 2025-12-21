'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

// Inner component that uses the reCAPTCHA hook (must be inside ReCaptchaProvider)
const FormContent: React.FC<{
  formFromProps: FormType
  formMethods: ReturnType<typeof useForm<Record<string, any>>>
  enableIntro: boolean
  introContent?: DefaultTypedEditorState
}> = ({ formFromProps, formMethods, enableIntro, introContent }) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
  } = formFromProps

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onSubmit = useCallback(
    (data: Record<string, any>) => {
      // Prevent multiple submissions
      if (isSubmitting || isLoading || hasSubmitted) {
        return
      }

      setIsSubmitting(true)
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)
        if (!executeRecaptcha) {
          setIsSubmitting(false)
          setError({
            message: 'reCAPTCHA not available. Please try again.',
          })
          return
        }

        let recaptchaToken: string
        try {
          recaptchaToken = await executeRecaptcha('form_submit')
        } catch (err) {
          console.warn('reCAPTCHA error:', err)
          setIsSubmitting(false)
          setError({
            message: 'reCAPTCHA verification failed. Please try again.',
          })
          return
        }
        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
              recaptchaToken,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setIsSubmitting(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setIsSubmitting(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setIsSubmitting(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, executeRecaptcha, isSubmitting, isLoading, hasSubmitted],
  )

  return (
    <div className="container lg:max-w-3xl">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className="mb-6 last:mb-0" key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              <Button form={formID} type="submit" variant="default" disabled={isSubmitting || isLoading}>
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const { enableIntro, form: formFromProps, introContent } = props

  const formMethods = useForm<Record<string, any>>({
    defaultValues: formFromProps.fields,
  })

  return (
    <FormContent
      formFromProps={formFromProps}
      formMethods={formMethods}
      enableIntro={enableIntro}
      introContent={introContent}
    />
  )
}
