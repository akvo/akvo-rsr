import React from 'react'
import classNames from 'classnames'
import { getXPoint } from '../../../utils/misc'

const TargetLine = ({
  value,
  height,
  padding,
  stroke = '#c87a53',
  strokeWidth = 2,
  ...props
}) => {
  const startY = padding
  const endY = height - padding
  const xTarget = getXPoint(value, { ...props, padding })
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
  height,
  padding,
  fontSize,
  style = {},
  value = -1,
  y = 145,
  text = '',
  fill = '#808080',
  rotate = 0,
  isExceeding = false,
  ...props
}) => {
  let x = getXPoint(value, { ...props, fontSize, padding })
  if (rotate === 0 && !isExceeding) {
    x -= padding + fontSize
  }
  return (
    <text
      x={x}
      y={y}
      style={{
        fill,
        fontSize,
        fontFamily: '"Assistant", sans-serif',
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
  padding,
  fontSize,
  chartwidth,
  maximumxfromdata,
  fill = 'rgba(0,0,255, 0.3)',
  stroke = 'none',
  strokeWidth = 0,
  yValue = 150,
  value = 0,
  ...props
}) => {
  const startY = yValue
  const endY = yValue + padding - (fontSize / 2)
  const startX = (0 / maximumxfromdata) * chartwidth + padding / 2 + fontSize * 2
  const xcoor = getXPoint(value, { ...props, maximumxfromdata, chartwidth, padding, fontSize })
  const points = `${startX},${startY} ${xcoor},${startY} ${xcoor}, ${endY} ${startX},${endY}`
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
