import React from 'react'

const Area = ({
  data,
  linearId,
  padding,
  maximumxfromdata,
  maximumyfromdata,
  chartwidth,
  chartheight,
  strokeWidth = 3,
  stroke = '#43998F'
}) => {
  const points = data
    .map(element => {
      const x = (element.x / maximumxfromdata) * chartwidth + padding
      const y =
        chartheight - (element.y / maximumyfromdata) * chartheight + padding
      return [x, y]
    })
  const bgPoints = [
    {
      label: null,
      x: 0,
      y: 0
    },
    ...data,
    {
      label: null,
      x: data[data.length - 1].x,
      y: 0
    }
  ]
    .map(element => {
      const x = (element.x / maximumxfromdata) * chartwidth + padding
      const y =
        chartheight - (element.y / maximumyfromdata) * chartheight + padding
      return `${x},${y}`
    })
    .join(' ')
  const fgPoints = points
    .map((p) => {
      const [x, y] = p
      return `${x},${y}`
    }).join(' ')
  return (
    <>
      <defs>
        <linearGradient id={`grad${linearId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            style={{
              stopColor: stroke,
              stopOpacity: 0.5
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: '#fff',
              stopOpacity: 1
            }}
          />
        </linearGradient>
      </defs>
      <polyline
        fill={`url(#grad${linearId})`}
        points={bgPoints}
      />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        points={fgPoints}
      />
    </>
  )
}

export default Area
