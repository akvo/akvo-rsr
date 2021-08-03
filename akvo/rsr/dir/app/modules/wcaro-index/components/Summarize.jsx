/* eslint-disable react/no-danger */
import React from 'react'
import { Row, Col, Icon, Typography } from 'antd'
import { Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'
import mapSVG from '../../../images/map.svg'
import waterPipe from '../../../images/water-pipe.svg'
import familySvg from '../../../images/family.svg'

const { Title } = Typography

const SummerizeIcon = ({ icon }) => {
  switch (icon) {
    case 'global':
      return <SVGInline svg={mapSVG} />
    case 'coffee':
      return <SVGInline svg={waterPipe} />
    case 'team':
    case 'heart':
      return <SVGInline svg={familySvg} />
    default:
      return <Icon type={icon} style={{ fontSize: '32px', color: '#0095CD' }} />
  }
}

export const Summarize = ({ items }) => {
  return (
    <Row type="flex" justify="center">
      {items && items.map(item => (
        <Col key={item.id} lg={item.lg} sm={item.sm} className="col-icon">
          <SummerizeIcon icon={item.icon} /><br />
          <Title level={4} style={{ color: '#0095CD' }}>
            {item.amount ? item.amount.toLocaleString('en-US') : ''}
            <div dangerouslySetInnerHTML={{ __html: item.label }} />
          </Title>
          {item.url && <Link to={item.url}>See More</Link>}
        </Col>
      ))}
    </Row>
  )
}
