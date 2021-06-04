import React from 'react'
import { Row, Col, Carousel } from 'antd'
import { ImageCarousel } from './ImageCarousel'

export const Slider = ({ items, user, setMenuKey }) => {
  return (
    <Row type="flex" justify="center">
      <Col span={23}>
        {items && (
          <Carousel autoplay>
            {items.map((item, index) => <ImageCarousel key={index} src={item} {...{ user, setMenuKey }} />)}
          </Carousel>
        )}
      </Col>
    </Row>
  )
}
