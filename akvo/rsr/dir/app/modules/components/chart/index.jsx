import React from 'react'
import XAxis from './XAxis'
import YAxis from './YAxis'
import LabelsXAxis from './LabelsXAxis'
import LabelsYAxis from './LabelsYAxis'
import VerticalGuides from './VerticalGuides'
import HorizontalGuides from './HorizontalGuides'
import Area from './Area'
import Dot from './Dot'
import Bar from './Bar'

const Chart = ({
  children,
  data,
  width,
  height,
  precision,
  horizontalGuides = 1,
  verticalGuides = 1,
  ...props
}) => {
  const FONT_SIZE = width / 50
  const maximumxfromdata = Math.max(...data.map(e => e.x))
  const maximumyfromdata = Math.max(...data.map(e => e.y))

  const digits = parseFloat(maximumyfromdata.toString()).toFixed(precision).length + 1

  const padding = (FONT_SIZE + digits) * 3
  const chartwidth = width - padding * 2
  const chartheight = height - padding * 2
  return (
    <svg viewBox={`0 0 ${width} ${height}`} {...props}>
      {React.Children.map(children, child => {
        return React.cloneElement(child,
          {
            ...{
              padding,
              chartwidth,
              chartheight,
              maximumxfromdata,
              maximumyfromdata
            },
            fontSize: FONT_SIZE,
            hnumber: horizontalGuides,
            vnumber: verticalGuides,
            data: child.props ? child.props.data || data : data,
            width: (child.props.width === undefined) ? width : child.props.width,
            height: (child.props.height === undefined) ? height : child.props.height
          }, null)
      })}
    </svg>
  )
}

Chart.Axis = {
  X: XAxis,
  Y: YAxis,
}

Chart.Label = {
  X: LabelsXAxis,
  Y: LabelsYAxis
}

Chart.Guide = {
  Vertical: VerticalGuides,
  Horizontal: HorizontalGuides
}

Chart.Area = Area

Chart.Dot = Dot

Chart.Bar = Bar

export default Chart
