import React from 'react'
import classNames from 'classnames'

const TargetLine = ({
  data,
  value,
  height,
  padding,
  fontSize,
  maximumxfromdata,
  chartwidth,
  stroke = '#c87a53',
  strokeWidth = 2
}) => {
  const startY = padding
  const endY = height - padding
  const xTargetPos = ((data.length - 1) / maximumxfromdata) * chartwidth + padding
  const xTarget = value > 0 ? xTargetPos * (value / 100) : fontSize
  return (
    <polyline
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      points={`${xTarget},${startY} ${xTarget},${endY}`}
    />
  )
}

const Label = ({
  data,
  padding,
  fontSize,
  chartwidth,
  maximumxfromdata,
  style = {},
  value = -1,
  y = 145,
  text = '',
  fill = '#808080',
  rotate = 0
}) => {
  const last = data.length - 1
  const xValue = (last / maximumxfromdata) * chartwidth - fontSize
  let x = value > 0 ? xValue * (value / 100) : fontSize
  x = x < 0 ? (0 / maximumxfromdata) * chartwidth : x
  return (value === -1 || value > 0) && (
    <text
      x={x}
      y={y}
      style={{
        fill,
        fontSize,
        fontFamily: 'Helvetica',
        ...style
      }}
      className={classNames({ 'labelValue': (value >= 0) })}
      transform={`rotate(${rotate} ${x} ${y})`}
    >
      {text}
    </text>
  )
}

const Bar = ({
  width,
  height,
  padding,
  chartwidth,
  maximumxfromdata,
  fill = 'rgba(0,0,255, 0.3)',
  stroke = 'none',
  strokeWidth = 0,
  yValue = 100
}) => {
  const xValue = (0 / maximumxfromdata) * chartwidth + padding
  const wValue = chartwidth * (width / 100)
  return (
    <rect
      className="container"
      width={wValue}
      height={height}
      style={{
        fill,
        strokeWidth,
        stroke
      }}
      x={xValue}
      y={yValue}
    />
  )
}

Bar.Label = Label
Bar.Target = TargetLine

export default Bar
