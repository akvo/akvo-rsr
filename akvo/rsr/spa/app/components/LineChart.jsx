import React from 'react'
import PropTypes from 'prop-types'
import { Col, Popover, Row } from 'antd'

const STROKE = 3

const LineChart = ({
  id,
  targetValue,
  data,
  height,
  width,
  horizontalGuides: numberOfHorizontalGuides,
  verticalGuides: numberOfVerticalGuides,
  precision
}) => {
  const FONT_SIZE = width / 50
  const maximumXFromData = Math.max(...data.map(e => e.x))
  const maximumYFromData = Math.max(...[...data, { y: targetValue }].map(e => e.y))

  const digits =
    parseFloat(maximumYFromData.toString()).toFixed(precision).length + 1

  const padding = (FONT_SIZE + digits) * 3
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const mlY = chartHeight - (targetValue / maximumYFromData) * chartHeight + padding
  const mlX = (0 / maximumXFromData) * chartWidth + padding
  const mlX2 = (data.length - 1 / maximumXFromData) * chartWidth + padding

  const points = data
    .map(element => {
      const x = (element.x / maximumXFromData) * chartWidth + padding
      const y =
        chartHeight - (element.y / maximumYFromData) * chartHeight + padding
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
      x: data[data.length - 1]?.x,
      y: 0
    }
  ]
    .map(element => {
      const x = (element.x / maximumXFromData) * chartWidth + padding
      const y =
        chartHeight - (element.y / maximumYFromData) * chartHeight + padding
      return `${x},${y}`
    })
    .join(' ')
  const fgPoints = points
    .map((p) => {
      const [x, y] = p
      return `${x},${y}`
    }).join(' ')

  const Axis = ({ points }) => (
    <polyline fill="none" stroke="#ccc" strokeWidth=".5" points={points} />
  )

  const XAxis = () => (
    <Axis
      points={`${padding},${height - padding} ${width - padding},${height -
        padding}`}
    />
  )

  const YAxis = () => (
    <Axis points={`${padding},${padding} ${padding},${height - padding}`} />
  )

  const VerticalGuides = () => {
    const guideCount = numberOfVerticalGuides || data.length - 1

    const startY = padding
    const endY = height - padding

    return new Array(guideCount).fill(0).map((_, index) => {
      const ratio = (index + 1) / guideCount

      const xCoordinate = padding + ratio * (width - padding * 2)

      return (
        <React.Fragment key={index}>
          <polyline
            fill="none"
            stroke="#ccc"
            strokeWidth=".5"
            points={`${xCoordinate},${startY} ${xCoordinate},${endY}`}
          />
        </React.Fragment>
      )
    })
  }

  const HorizontalGuides = () => {
    const startX = padding
    const endX = width - padding

    return new Array(numberOfHorizontalGuides).fill(0).map((_, index) => {
      const ratio = (index + 1) / numberOfHorizontalGuides

      const yCoordinate = chartHeight - chartHeight * ratio + padding

      return (
        <React.Fragment key={index}>
          <polyline
            fill="none"
            stroke="#ccc"
            strokeWidth=".5"
            points={`${startX},${yCoordinate} ${endX},${yCoordinate}`}
          />
        </React.Fragment>
      )
    })
  }

  const LabelsXAxis = () => {
    const y = height - padding + FONT_SIZE * 2

    return data.map((element, index) => {
      const x =
        (element.x / maximumXFromData) * chartWidth + padding - FONT_SIZE / 2
      return (
        <text
          key={index}
          x={x}
          y={y}
          style={{
            fill: '#808080',
            fontSize: FONT_SIZE,
            fontFamily: 'Helvetica'
          }}
          transform={`rotate(90 ${x} ${y})`}
        >
          {element.label}
        </text>
      )
    })
  }

  const LabelsYAxis = () => {
    const PARTS = numberOfHorizontalGuides
    return new Array(PARTS + 1).fill(0).map((_, index) => {
      const x = FONT_SIZE
      const ratio = index / numberOfHorizontalGuides

      const yCoordinate =
        chartHeight - chartHeight * ratio + padding + FONT_SIZE / 2
      return (
        <text
          key={index}
          x={x}
          y={yCoordinate}
          style={{
            fill: '#808080',
            fontSize: FONT_SIZE,
            fontFamily: 'Helvetica'
          }}
        >
          {parseFloat(maximumYFromData * (index / PARTS)).toFixed(0)}
        </text>
      )
    })
  }

  return (
    <Row>
      <Col
        span={1}
        style={{
          transform: 'rotate(270deg)',
          position: 'absolute',
          top: '50%'
        }}
      >
        <small style={{ fontFamily: 'Helvetica', fontWeight: 600 }}>Updates</small>
      </Col>
      <Col
        span={23}
        style={{
          marginLeft: 20
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height + 50}`}
        >
          <XAxis />
          <LabelsXAxis />
          <YAxis />
          <LabelsYAxis />
          {numberOfVerticalGuides && <VerticalGuides />}
          <HorizontalGuides />
          <defs>
            <linearGradient id={`grad${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{
                  stopColor: 'rgba(67,153,143, 0.5)',
                  stopOpacity: 1
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: 'rgb(255,255,255)',
                  stopOpacity: 1
                }}
              />
            </linearGradient>
          </defs>
          <polyline
            fill={`url(#grad${id})`}
            points={bgPoints}
          />
          <polyline
            fill="none"
            stroke="#43998F"
            strokeWidth={STROKE}
            points={fgPoints}
          />
          {targetValue && (
            <polyline
              fill="none"
              stroke="#c87a53"
              strokeWidth={2}
              points={`${mlX},${mlY} ${mlX2},${mlY}`}
            />
          )}
          {points.map((p, px) => {
            const [x, y] = p
            return (
              <Popover
                placement="topRight"
                content={(
                  <div style={{ textAlign: 'right', fontFamily: 'Helvetica' }}>
                    <small>{data[px]?.label}</small>
                    <h4 style={{ color: '#43998F' }}>{data[px]?.y}</h4>
                  </div>
                )}
              >
                <circle className="lineCircle" fill="#43998F" cx={x} cy={y} data-value={targetValue} r="4" key={px} />
              </Popover>
            )
          })}
        </svg>
      </Col>
      <Col
        span={24}
        style={{
          textAlign: 'center'
        }}
      >
        <small style={{ fontFamily: 'Helvetica', fontWeight: 600 }}>Time</small>
      </Col>
    </Row>
  )
}

LineChart.defaultProps = {
  height: 200,
  width: 500,
  horizontalGuides: 4,
  verticalGuides: null,
  precision: 2
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string
    })
  ).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  horizontalGuides: PropTypes.number,
  verticalGuides: PropTypes.number,
  precision: PropTypes.number
}

export default LineChart
