import React from 'react'

const LabelsXAxis = ({
  data,
  height,
  padding,
  fontSize,
  chartwidth,
  maximumxfromdata,
  fill = '#808080'
}) => {
  const y = height - padding + fontSize * 2
  return data.map((element, index) => {
    const x = (element.x / maximumxfromdata) * chartwidth + padding - fontSize / 2
    return (
      <text
        key={index}
        x={x}
        y={y}
        style={{
          fill,
          fontSize,
          fontFamily: '"Assistant", sans-serif'
        }}
      >
        {element.label}
      </text>
    )
  })
}

export default LabelsXAxis
