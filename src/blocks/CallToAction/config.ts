import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { defaultLexicalConfig } from '@/fields/defaultLexicalConfig'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: defaultLexicalConfig(),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline-solid'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
