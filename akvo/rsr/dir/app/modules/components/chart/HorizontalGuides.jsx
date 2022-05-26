import React from 'react'

const HorizontalGuides = ({
  width,
  padding,
  chartheight,
  hnumber,
  fill = 'none',
  stroke = '#ccc',
  strokeWidth = '.5'
}) => {
  const startX = padding
  const endX = width - padding
  return new Array(hnumber).fill(0).map((_, index) => {
    const ratio = (index + 1) / hnumber
    const yCoordinate = chartheight - chartheight * ratio + padding
    return (
      <React.Fragment key={index}>
        <polyline
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          points={`${startX},${yCoordinate} ${endX},${yCoordinate}`}
        />
      </React.Fragment>
    )
  })
}

export default HorizontalGuides
