import { cn } from '@/utilities/ui'
import React from 'react'
import { NestedDonutChart } from '@/components/Charts/NestedDonutChart'

export type NestedDonutChartBlockProps = {
  outerRadiusData: { name: string; value: number; fill: string }[]
  innerRadiusData: { name: string; value: number; fill: string }[]
}

export const NestedDonutChartBlock: React.FC<NestedDonutChartBlockProps> = ({
  outerRadiusData,
  innerRadiusData,
}) => {
  return (
    <>
      <div className={cn('w-full')}>
        <NestedDonutChart outerRadiusData={outerRadiusData} innerRadiusData={innerRadiusData} />
      </div>
    </>
  )
}
