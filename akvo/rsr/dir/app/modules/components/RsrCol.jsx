import React from 'react'
import { Col } from 'antd'

const RsrCol = ({ cols = [], children, ...props }) => (
  <Col
    xl={cols[0] || 24}
    lg={cols[1] || 24}
    md={cols[2] || 24}
    sm={cols[3] || 24}
    xs={cols[4] || 24}
    {...props}
  >
    {children}
  </Col>
)

export default RsrCol
