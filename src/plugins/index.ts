import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { site } from '@/constants'
import { authjsPlugin } from 'payload-authjs'
import { authConfig } from '@/auth.config'
import { getMinScore, verifyRecaptcha } from '@/hooks/verifyRecaptcha'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${site.name}` : site.title
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: true, // Optional, defaults to true
    // Specify which collections should use Vercel Blob
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
    generateImage: ({ doc }) => doc?.featuredImage,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      hooks: {
        beforeValidate: [
          async ({ data, req }) => {
            // Extract reCAPTCHA token from the request data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const recaptchaToken = (req.data as any)?.recaptchaToken

            if (!recaptchaToken) {
              throw new Error('reCAPTCHA token is required')
            }

            try {
              // Verify the reCAPTCHA token
              const recaptchaResult = await verifyRecaptcha(recaptchaToken)

              // Check if reCAPTCHA verification was successful
              if (!recaptchaResult.success) {
                console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes'])
                throw new Error('reCAPTCHA verification failed')
              }

              // Check the score (v3 returns a score from 0.0 to 1.0)
              const minScore = getMinScore()
              if (recaptchaResult.score !== undefined && recaptchaResult.score < minScore) {
                console.warn(
                  `reCAPTCHA score too low: ${recaptchaResult.score} (minimum: ${minScore})`,
                )
                throw new Error(
                  'Suspicious activity detected. Please try again or contact support if the problem persists.',
                )
              }
            } catch (error) {
              console.error('reCAPTCHA verification error:', error)
              throw error instanceof Error ? error : new Error('reCAPTCHA verification failed')
            }

            return data
          },
        ],
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  authjsPlugin({
    authjsConfig: authConfig,
  }),
]
