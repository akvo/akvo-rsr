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
  const fontSize = width / 35
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
      <Chart.Bar.Label text={yLabel} style={{ fontWeight: 600 }} />
      <Chart.Bar
        yValue={120}
        width={targetPercentage}
        height={40}
        fill="rgba(174,224,224, 1)"
      />
      <Chart.Bar.Label
        fill="#c87a53"
        text="TARGET VALUE"
        value={targetPercentage}
        style={{ fontSize: 10 }}
        y={55}
      />
      <Chart.Bar width={actualPercentage} height={40} yValue={120} fill="rgba(59,155,145, 0.8)" />
      <Chart.Bar.Label
        fill="rgba(174,224,224, 1)"
        text={setNumberFormat(target)}
        value={targetPercentage}
        style={{
          fontSize,
          fontWeight: 600
        }}
        y={95}
      />
      <Chart.Bar.Label
        fill="rgba(255,255,255, 0.8)"
        text={setNumberFormat(actual)}
        value={actualPercentage}
        style={{
          fontSize,
          fontWeight: 600
        }}
        y={145}
      />
    </Chart>
  )
}

export default BarChart
