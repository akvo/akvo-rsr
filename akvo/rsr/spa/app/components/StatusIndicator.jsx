import React from 'react'
import { Col, Row, Typography } from 'antd'

const { Text } = Typography

const StatusIndicator = ({ status }) => {
  let description = 'No status yet'
  if (status === 'D') {
    description = 'Draft update created'
  }
  if (status === 'P') {
    description = 'Update submitted'
  }
  if (status === 'R') {
    description = 'Update declined'
  }
  if (status === 'A') {
    description = 'Approved update reported'
  }
  return (
    <Row>
      <Col style={{ display: 'flex', gap: 15 }}>
        <Text strong>Status : </Text>
        <Text>{description}</Text>
      </Col>
    </Row>
  )
}

export default StatusIndicator
