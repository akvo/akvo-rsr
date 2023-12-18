import React from 'react'
import { Col, Row, Typography } from 'antd'
import { statusDescription } from '../utils/constants'

const { Text } = Typography

const StatusIndicator = ({ status, updateClass }) => {
  const description = statusDescription[status] || statusDescription[updateClass] || statusDescription.NO_STATUS
  return (
    <Row className="header-status">
      <Col style={{ display: 'flex', gap: 10 }} className={updateClass}>
        <Text strong>Status :</Text>
        <Text>{description}</Text>
      </Col>
    </Row>
  )
}

export default StatusIndicator
