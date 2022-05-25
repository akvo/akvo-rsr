import React from 'react'
import * as d3 from 'd3'
import { Col, Popover, Row, Typography } from 'antd'

import { setNumberFormat } from '../../../utils/misc'

const { Text } = Typography

const PopContent = ({
  value,
  label,
  currency,
  fundingAmount
}) => (
  <Row>
    <Col>
      <Text strong>Funder</Text>
    </Col>
    <Col>
      <Text>{label}</Text>
    </Col>
    <Col>
      <Text strong>Funding Amount</Text>
    </Col>
    <Col>
      <Text>{setNumberFormat(fundingAmount)} {currency} ({value.toFixed(2)} %)</Text>
    </Col>
  </Row>
)

const Arc = ({
  createArc,
  data,
  index,
  colors,
  format,
  currency
}) => {
  let fontSize = 14 - (index * 1)
  fontSize = fontSize <= 0 ? 1 : fontSize
  return (
    <g key={index} className="arc">
      <path className="arc" d={createArc(data)} fill={colors(index)} />
      <Popover placement="top" content={<PopContent {...data} currency={currency} />}>
        <text
          transform={`translate(${createArc.centroid(data)})`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill="#212121"
          fontWeight={600}
          dx={8}
        >
          {`${format(data.value)} %`}
        </text>
      </Popover>
    </g>
  )
}

const SemiDoughnut = props => {
  const createPie = d3
    .pie()
    .value(d => d.value)
    .startAngle(-90 * (Math.PI / 180))
    .endAngle(90 * (Math.PI / 180))
    .sort(null)
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
  const colorRange = props.data.map(d => d.color)
  const colors = d3.scaleOrdinal().range(colorRange)
  const format = d3.format('.2f')
  const data = createPie(props.data).map((d, index) => ({
    ...d,
    ...props.data[index]
  }))
  return (
    <svg viewBox="-25 0 400 200" preserveAspectRatio="xMinYMin meet">
      <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
            format={format}
            currency={props.currency}
            height={props.height}
          />
        ))}
      </g>
    </svg>
  )
}

export default SemiDoughnut
