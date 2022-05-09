import React from 'react'
import { Row, Col } from 'antd'

const Section = ({
  row = {},
  col = {},
  className = '',
  children,
  ...props
}) => (
  <Row className="rsr-row" {...row}>
    <Col {...col}>
      <div className={`main-container ${className}`} {...props}>
        {children}
      </div>
    </Col>
  </Row>
)

export default Section
