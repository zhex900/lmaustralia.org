import type { Block, Field } from 'payload'

import {
  AlignFeature,
  BlockquoteFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ChecklistFeature,
  UnorderedListFeature,
  OrderedListFeature,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

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
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          IndentFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          AlignFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          ChecklistFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          TextStateFeature(),
        ]
      },
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
