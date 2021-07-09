/* eslint-disable react/no-danger */
import React from 'react'
import { Row, Col, Icon, Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Title } = Typography

export const Summarize = ({ items }) => {
  return (
    <Row type="flex" justify="center">
      {items && items.map((item, index) => (
        <Col key={index} lg={item.lg} sm={item.sm} className="col-icon">
          <Icon type={item.icon} style={{ fontSize: '32px' }} /><br />
          <Title level={4}>
            {item.amount ? item.amount.toLocaleString('en-US') : ''}
            <div dangerouslySetInnerHTML={{ __html: item.label }} />
          </Title>
          <Link to={`/insight/${index}`}>
            See More
          </Link>
        </Col>
      ))}
    </Row>
  )
}
