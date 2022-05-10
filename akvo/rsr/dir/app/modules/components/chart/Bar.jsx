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
  const xTargetPos = (((data.length - 1) / maximumxfromdata) * chartwidth) + padding
  const xTarget = value > 0 ? Math.round(xTargetPos * (value / 100)) : fontSize
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
  rotate = 0,
  hasPadding = false
}) => {
  const last = data.length - 1
  const xValue = (last / maximumxfromdata) * chartwidth + fontSize
  let x = value > 0 ? hasPadding ? (xValue * (value / 100)) - padding : xValue * (value / 100) : fontSize
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
  data,
  width,
  padding,
  fontSize,
  chartwidth,
  maximumxfromdata,
  fill = 'rgba(0,0,255, 0.3)',
  stroke = 'none',
  strokeWidth = 0,
  yValue = 150
}) => {
  const startY = yValue
  const endY = yValue + padding - (fontSize / 2)
  const startX = (0 / maximumxfromdata) * chartwidth + padding
  const endX = (((data.length - 1) / maximumxfromdata) * chartwidth) + padding
  const xVal = width > 0 ? Math.round(endX * (width / 100)) : fontSize
  const points = `${startX},${startY} ${xVal},${startY} ${xVal}, ${endY} ${startX},${endY}`
  return (
    <polyline
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      points={points}
    />
  )
}

Bar.Label = Label
Bar.Target = TargetLine

export default Bar
