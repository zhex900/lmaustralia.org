import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  TextStateFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { TextFontFamilyFeature } from 'payload-lexical-typography'

interface LexicalConfigOptions {
  blocks?: Block[]
}

export const defaultLexicalConfig = (options?: LexicalConfigOptions) =>
  lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => {
      const features = [
        ...rootFeatures,
        ...defaultFeatures,
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
        TextFontFamilyFeature(),
      ]

      // Add BlocksFeature if blocks are provided
      if (options?.blocks && options.blocks.length > 0) {
        features.push(BlocksFeature({ blocks: options.blocks }))
      }

      return features
    },
  })
