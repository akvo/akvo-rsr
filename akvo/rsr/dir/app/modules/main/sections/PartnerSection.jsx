import React from 'react'
import {
  Row,
  Col,
  Carousel,
  Button,
  Avatar
} from 'antd'

const PartnerSection = ({
  slider,
  partners,
  onPrev,
  onNext
}) => (
  <Row type="flex" justify="center" align="middle">
    <Col span={1}>
      <Button type="link" onClick={onPrev}>
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC' }} icon="left" />
      </Button>
    </Col>
    <Col span={22}>
      <Carousel
        dots={false}
        ref={slider}
        centerPadding={80}
        slidesToShow={3}
        speed={500}
        autoplay
        centerMode
        infinite
      >
        {
          partners.map((p, px) => (
            <div className="partner-item" key={px}>
              <img src={p.image} alt={`partner ${px}`} />
            </div>
          ))
        }
      </Carousel>
    </Col>
    <Col span={1}>
      <Button type="link" onClick={onNext}>
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC' }} icon="right" />
      </Button>
    </Col>
  </Row>
)

export default PartnerSection
