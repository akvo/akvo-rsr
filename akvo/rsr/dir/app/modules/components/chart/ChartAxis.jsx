import React from 'react'

const ChartAxis = ({
  points,
  fill = 'none',
  stroke = '#ccc',
  strokeWidth = '.5',
  ...props
}) => (
  <polyline
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    points={points}
    {...props}
  />
)

export default ChartAxis
