import type { Block } from 'payload'

export const NestedDonutChart: Block = {
  slug: 'nestedDonutChart',
  fields: [
    {
      name: 'outerRadiusData',
      label: 'Outer Radius Data',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'fill',
          type: 'text',
          label: 'Fill Colour',
          required: true,
        },
      ],
    },
    {
      name: 'innerRadiusData',
      label: 'Inner Radius Data',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'fill',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'NestedDonutChartBlock',
}
