/* eslint-disable no-restricted-properties */
import React from 'react'

import Chart from './chart'
import { setNumberFormat } from '../../utils/misc'

const BarChart = ({
  id,
  width,
  height,
  precision,
  target,
  actual,
  yLabel = null
}) => {
  const maxValue = Math.max(target, actual)
  const dozen = Math.pow(10, (`${maxValue}`.length - 1))
  const maxXAxis = Math.ceil(maxValue / dozen) * dozen
  const size = (maxXAxis / dozen) + 1
  const series = Array.from({ length: size }).map((_, sx) => ({
    label: sx * dozen,
    x: sx,
    y: sx === 0 ? 0 : 10
  }))
  let actualPercentage = (actual && target) ? Math.round((actual / maxXAxis) * 100) : 0
  if (actual > target && actual >= maxXAxis) {
    actualPercentage = 100
  }
  const targetPercentage = target > 0 ? Math.round((target / maxXAxis) * 100) : 0
  const fontSize = width / 45
  const isExceeding = ((actual && target) && actual > target)
  const isOverlapping = (targetPercentage > actualPercentage && (targetPercentage - actualPercentage <= 15))
  const actualColor = isOverlapping ? 'rgba(59,155,145, 0.8)' : 'rgba(255,255,255, 0.8)'
  const targetColor = isExceeding ? '#c87a53' : isOverlapping ? 'rgba(174,224,224, 1)' : 'rgba(59,155,145, 0.8)'
  const actualYPos = isOverlapping ? 100 : 140
  const targetYPos = isExceeding ? 90 : actualYPos
  const rotateValue = isOverlapping ? -45 : 0
  return (
    <Chart
      data={series}
      {...{
        width,
        height,
        precision,
        id
      }}
      horizontalGuides={1}
      verticalGuides={series.length}
      className="barChart"
    >
      <Chart.Axis.X />
      <Chart.Axis.Y />
      <Chart.Label.X />
      <Chart.Guide.Vertical />
      <Chart.Guide.Horizontal />
      <Chart.Bar.Target value={targetPercentage} />
      <Chart.Bar.Label
        fill="#c87a53"
        text="TARGET VALUE"
        hasPadding={(isExceeding)}
        value={isExceeding ? targetPercentage + 3 : targetPercentage}
        style={{ fontSize: 10 }}
        y={55}
      />
      <Chart.Bar.Label text={yLabel} style={{ fontWeight: 600 }} />
      <Chart.Bar
        yValue={105}
        width={targetPercentage}
        fill="rgba(174,224,224, 1)"
      />
      <Chart.Bar width={actualPercentage} yValue={105} fill="rgba(59,155,145, 0.8)" />
      <Chart.Bar.Label
        fill={targetColor}
        text={setNumberFormat(target)}
        value={targetPercentage + 3}
        style={{
          fontSize,
          fontWeight: 600
        }}
        y={targetYPos}
        rotate={rotateValue}
        hasPadding={!(isOverlapping)}
      />
      <Chart.Bar.Label
        fill={actualColor}
        text={setNumberFormat(actual)}
        value={actualPercentage + 3}
        style={{
          fontSize,
          fontWeight: 600
        }}
        y={actualYPos}
        rotate={rotateValue}
        hasPadding={!(isOverlapping)}
      />
    </Chart>
  )
}

export default BarChart
