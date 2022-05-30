import React from 'react'
import { Popover } from 'antd'

const Dot = ({
  data,
  color,
  padding,
  maximumxfromdata,
  maximumyfromdata,
  chartwidth,
  chartheight,
  radius = 4,
  ...props
}) => {
  const points = data
    .map(element => {
      const x = (element.x / maximumxfromdata) * chartwidth + padding
      const y = chartheight - (element.y / maximumyfromdata) * chartheight + padding
      return [x, y]
    })
  return points.map((p, px) => {
    const [x, y] = p
    return (
      <Popover
        placement="topRight"
        content={(
          <div style={{ textAlign: 'right', fontFamily: '"Assistant", sans-serif' }}>
            <small>{data[px].label}</small>
            <h4 style={{ color }}>{data[px].y}</h4>
          </div>
        )}
        key={px}
      >
        <circle
          className="lineCircle"
          fill={color}
          cx={x}
          cy={y}
          r={radius}
          key={px}
          {...props}
        />
      </Popover>
    )
  })
}

export default Dot
