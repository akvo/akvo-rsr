import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import { MapWcaro } from './MapWcaro'

const { Text } = Typography

export const InsightItem = ({ type, data }) => {
  switch (type) {
    case 'linechart':
      return (
        <LineChart width={550} height={180} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
      )
    case 'card':
      return (
        <Card
          title={data.title}
          actions={[
            <Text key="left" strong>
              {data.footnote}
            </Text>,
            <Text key="right">
              Read More&nbsp;
              <RightOutlined />
            </Text>
          ]}
        >
          {data.content}
        </Card>
      )
    case 'map':
      return <MapWcaro {...{ ...data }} />
    case 'maparea':
      return <MapWcaro {...{ ...data }} />
    default:
      return null
  }
}
