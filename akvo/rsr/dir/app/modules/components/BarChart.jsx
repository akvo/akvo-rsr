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
  const fontSize = width / 45
  const spacing = (target > 0 && target >= actual) ? Math.round((actual / target) * 100) : 0
  const isExceeding = ((actual && target) && actual > target)
  const isOverlapping = (!isExceeding && (actual && ((spacing >= 0 && spacing < 20) || spacing >= 90)))
  const rotateValue = isOverlapping ? -45 : 0
  const actualColor = rotateValue ? 'rgba(59,155,145, 0.8)' : 'rgba(255,255,255, 0.8)'
  const targetColor = isExceeding ? '#c87a53' : rotateValue ? 'rgba(174,224,224, 1)' : 'rgba(59,155,145, 0.8)'
  const targetYValue = isExceeding ? 55 : isOverlapping ? 90 : 145
  const actualYvalue = isOverlapping ? 90 : 145
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
      {isExceeding && <Chart.Bar.Target value={target} />}
      {isExceeding && <Chart.Bar.Label fill="#c87a53" text="TARGET VALUE" value={target} style={{ fontSize: 10 }} y={50} />}
      <Chart.Bar.Label text={yLabel} style={{ fontWeight: 600 }} />
      <Chart.Bar yValue={105} fill="rgba(174,224,224, 1)" value={target} />
      <Chart.Bar yValue={105} fill="rgba(59,155,145, 0.8)" value={actual} />
      <Chart.Bar.Label
        fill={targetColor}
        text={setNumberFormat(target)}
        value={target}
        style={{
          fontSize,
          fontWeight: 600
        }}
        y={targetYValue}
        rotate={rotateValue}
        isExceeding={isExceeding}
      />
      {actual > 0 && (
        <Chart.Bar.Label
          fill={actualColor}
          text={setNumberFormat(actual)}
          value={actual}
          style={{
            fontSize,
            fontWeight: 600
          }}
          y={actualYvalue}
          rotate={rotateValue}
        />
      )}
    </Chart>
  )
}

export default BarChart
