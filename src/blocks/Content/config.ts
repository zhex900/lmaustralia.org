import type { Block, Field } from 'payload'

import { link } from '@/fields/link'
import { defaultLexicalConfig } from '@/fields/defaultLexicalConfig'
import { Banner } from '../Banner/config'
import { MediaBlock } from '../MediaBlock/config'
import { Archive } from '../ArchiveBlock/config'
import { CallToAction } from '../CallToAction/config'
import { ProximityMap } from '../ProximityMap/config'
import { Timeline } from '../Timeline/config'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    required: false,
  },
  {
    name: 'columnClassName',
    type: 'text',
    defaultValue: '',
    label: 'Column Class Name',
  },
  {
    name: 'richText',
    type: 'richText',
    editor: defaultLexicalConfig({
      blocks: [Banner, MediaBlock, Archive, CallToAction, ProximityMap, Timeline],
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    {
      name: 'className',
      type: 'text',
      defaultValue: 'bg-white',
      label: 'Class Name',
    },
  ],
}
//bg-card rounded border-border border
