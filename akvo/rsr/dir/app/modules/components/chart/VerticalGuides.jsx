import React from 'react'

const VerticalGuides = ({
  height,
  padding,
  chartwidth,
  maximumxfromdata,
  vnumber,
  fill = 'none',
  stroke = '#ccc',
  strokeWidth = '.5'
}) => {
  const startY = padding
  const endY = height - padding
  return new Array(vnumber).fill(0).map((_, index) => {
    const xCoordinate = (index / maximumxfromdata) * chartwidth + padding
    return (
      <React.Fragment key={index}>
        <polyline
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          points={`${xCoordinate},${startY} ${xCoordinate},${endY}`}
        />
      </React.Fragment>
    )
  })
}

export default VerticalGuides
