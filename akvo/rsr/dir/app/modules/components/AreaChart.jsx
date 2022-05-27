import React from 'react'
import Chart from './chart'

const AreaChart = ({
  id,
  width,
  height,
  precision,
  horizontalGuides,
  verticalGuides,
  targetValues,
  actualValues
}) => {
  const data = [...targetValues, ...actualValues]
  return (
    <Chart
      {...{
        id,
        data,
        width,
        height,
        precision,
        horizontalGuides,
        verticalGuides
      }}
    >
      <Chart.Axis.X />
      <Chart.Label.X />
      <Chart.Axis.Y />
      <Chart.Label.Y />
      <Chart.Guide.Vertical />
      <Chart.Guide.Horizontal />
      <Chart.Area linearId={`targetValues${id}`} data={targetValues} stroke="#AEE0E0" />
      <Chart.Area linearId={`actualValues${id}`} data={actualValues} stroke="#3B9B91" />
      <Chart.Dot data={actualValues} color="#3B9B91" />
      <Chart.Dot data={targetValues} color="#AEE0E0" />
    </Chart>
  )
}

export default AreaChart
