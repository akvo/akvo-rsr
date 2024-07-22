/* eslint-disable react/no-danger */
import React from 'react'
import { GlobalOutlined, TeamOutlined, CoffeeOutlined, HeartOutlined } from '@ant-design/icons'
import { Row, Col, Typography } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

const { Title } = Typography

const iconMap = {
  global: <GlobalOutlined style={{ fontSize: '32px' }} />,
  team: <TeamOutlined style={{ fontSize: '32px' }} />,
  coffee: <CoffeeOutlined style={{ fontSize: '32px' }} />,
  heart: <HeartOutlined style={{ fontSize: '32px' }} />,
}

const SummaryIcon = ({ icon }) => {
  const component = get(iconMap, icon)
  return component || iconMap.heart
}

export const Summarize = ({ items }) => {
  return (
    <Row type="flex" justify="center">
      {items && items.map(item => (
        <Col key={item.id} lg={item.lg} sm={item.sm} className="col-icon">
          <SummaryIcon icon={item.icon} /><br />
          <Title level={4}>
            {item.amount ? item.amount.toLocaleString('en-US') : ''}
            <div dangerouslySetInnerHTML={{ __html: item.label }} />
          </Title>
          {item.url && <Link to={item.url}>See More</Link>}
        </Col>
      ))}
    </Row>
  )
}
