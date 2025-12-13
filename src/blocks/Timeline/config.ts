import type { Block } from 'payload'
import { defaultLexicalConfig } from '@/fields/defaultLexicalConfig'
import { MediaBlock } from '../MediaBlock/config'

export const Timeline: Block = {
  slug: 'timeline',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'timeline',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: defaultLexicalConfig({
            blocks: [MediaBlock],
          }),
          label: 'content',
        },
      ],
    },
  ],
  interfaceName: 'TimelineBlock',
}
