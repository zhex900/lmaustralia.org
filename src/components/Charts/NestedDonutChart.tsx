'use client'
import { Cell, Pie, PieChart, PieLabelRenderProps } from 'recharts'
import { useMemo } from 'react'

type ChartDataItem = { name: string; value: number; fill: string }

type NestedDonutChartProps = {
  outerRadiusData: ChartDataItem[]
  innerRadiusData: ChartDataItem[]
  isAnimationActive?: boolean
}

// Constants
const RADIAN = Math.PI / 180
const BASE_START_ANGLE = -225 // Rotated 90 degrees left + 45 degrees right
const LABEL_FONT_SIZE = 12
const INNER_RADIUS_PERCENT = '60%'
const OUTER_RADIUS_PERCENT = '80%'
const INNER_LABEL_RADIUS_RATIO = 0.3 // Position label at 30% from center
const OUTER_VALUE_LABEL_RADIUS_RATIO = 0.5 // Position value label at midpoint
const OUTER_NAME_OFFSET = 10 // Pixels outside the outer radius for name labels

export function NestedDonutChart({
  outerRadiusData,
  innerRadiusData,
  isAnimationActive = true,
}: NestedDonutChartProps) {
  // Memoize calculations
  const { totalInner, childrenStartAngle, childrenEndAngle } = useMemo(() => {
    const total = innerRadiusData.reduce((sum, item) => sum + item.value, 0)

    if (total === 0 || innerRadiusData.length < 2) {
      return {
        totalInner: 0,
        childrenStartAngle: BASE_START_ANGLE,
        childrenEndAngle: BASE_START_ANGLE + 360,
      }
    }

    const adultsValue = innerRadiusData[0]?.value || 0
    const childrenValue = innerRadiusData[1]?.value || 0
    const adultsAngleSpan = (adultsValue / total) * 360
    const childrenStart = BASE_START_ANGLE + adultsAngleSpan
    const childrenAngleSpan = (childrenValue / total) * 360
    const childrenEnd = childrenStart + childrenAngleSpan

    return {
      totalInner: total,
      childrenStartAngle: childrenStart,
      childrenEndAngle: childrenEnd,
    }
  }, [innerRadiusData])

  // Custom label function to position labels inside the inner pie segments
  const renderInnerLabel = (entry: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = entry
    const angle = midAngle ?? 0
    const radius = innerRadius + (outerRadius - innerRadius) * INNER_LABEL_RADIUS_RATIO
    const x = cx + radius * Math.cos(-angle * RADIAN)
    const y = cy + radius * Math.sin(-angle * RADIAN)

    // Calculate percentage
    const percentage = totalInner > 0 ? ((value / totalInner) * 100).toFixed(0) : '0'

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={LABEL_FONT_SIZE}
        fontWeight="bold"
      >
        <tspan x={x} dy="-0.6em">
          {`${name}: ${value}`}
        </tspan>
        <tspan x={x} dy="1.2em">
          {`${percentage}%`}
        </tspan>
      </text>
    )
  }

  // Custom label function for outer pie: value inside, name outside
  const renderOuterLabel = (entry: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, name, value, fill } = entry
    const angle = midAngle ?? 0

    // Position for value (inside the segment at midpoint)
    const valueRadius = innerRadius + (outerRadius - innerRadius) * OUTER_VALUE_LABEL_RADIUS_RATIO
    const valueX = cx + valueRadius * Math.cos(-angle * RADIAN)
    const valueY = cy + valueRadius * Math.sin(-angle * RADIAN)

    // Position for name (outside the outer radius)
    const nameRadius = outerRadius + OUTER_NAME_OFFSET
    const nameX = cx + nameRadius * Math.cos(-angle * RADIAN)
    const nameY = cy + nameRadius * Math.sin(-angle * RADIAN)

    return (
      <>
        {/* Value label inside */}
        <text
          x={valueX}
          y={valueY}
          fill="currentColor"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={LABEL_FONT_SIZE}
          fontWeight="bold"
        >
          {value}
        </text>
        {/* Name label outside */}
        <text
          x={nameX}
          y={nameY}
          fill={fill || 'currentColor'}
          textAnchor={nameX > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={LABEL_FONT_SIZE}
          fontWeight="bold"
        >
          {name}
        </text>
      </>
    )
  }

  // Early return if no data
  if (!innerRadiusData?.length || !outerRadiusData?.length) {
    return null
  }

  return (
    <div className="outline-none" style={{ outline: 'none', marginBottom: '-3rem' }}>
      <style>
        {`
          .recharts-wrapper:focus,
          .recharts-wrapper *:focus {
            outline: none !important;
            border: none !important;
          }
          .recharts-active-shape {
            outline: none !important;
            border: none !important;
          }
        `}
      </style>
      <PieChart
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: 1,
          outline: 'none',
        }}
        margin={{ top: 0, right: 0, bottom: 0, left: -100 }}
        responsive
      >
        <Pie
          data={innerRadiusData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={INNER_RADIUS_PERCENT}
          startAngle={BASE_START_ANGLE}
          isAnimationActive={isAnimationActive}
          label={renderInnerLabel}
          labelLine={false}
        >
          {innerRadiusData.map((entry, index) => (
            <Cell key={`inner-${entry.name}-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Pie
          data={outerRadiusData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={INNER_RADIUS_PERCENT}
          outerRadius={OUTER_RADIUS_PERCENT}
          startAngle={childrenStartAngle}
          endAngle={childrenEndAngle}
          isAnimationActive={isAnimationActive}
          label={renderOuterLabel}
          labelLine={false}
        >
          {outerRadiusData.map((entry, index) => (
            <Cell key={`outer-${entry.name}-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}
