import React from 'react'

const LabelsYAxis = ({
  padding,
  fontSize,
  chartheight,
  maximumyfromdata,
  hnumber,
  fill = '#808080'
}) => {
  const PARTS = hnumber
  return new Array(PARTS + 1).fill(0).map((_, index) => {
    const x = fontSize
    const ratio = index / hnumber
    const yCoordinate = chartheight - chartheight * ratio + padding + fontSize / 2
    return (
      <text
        key={index}
        x={x}
        y={yCoordinate}
        style={{
          fill,
          fontSize,
          fontFamily: 'Helvetica'
        }}
      >
        {parseFloat(maximumyfromdata * (index / PARTS)).toFixed(0)}
      </text>
    )
  })
}

export default LabelsYAxis
