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
  <Row type="flex" justify="start" align="middle">
    <Col span={1}>
      <Button type="link" onClick={onPrev} className="partner-btn-left">
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC', zIndex: 999 }} icon="left" />
      </Button>
    </Col>
    <Col lg={22} md={22} sm={20} xs={20}>
      <Carousel
        dots={false}
        ref={slider}
        centerPadding={80}
        slidesToShow={6}
        slidesToScroll={12}
        speed={500}
        initialSlide={0}
        className="ant-row"
        responsive={[
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 2,
              initialSlide: 0
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 0
            }
          },
          {
            breakpoint: 320,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 0
            }
          }
        ]}
        autoplay
        centerMode
        infinite
      >
        {
          partners.map((p, px) => (
            <Col lg={6} md={8} sm={12} xs={24} key={px}>
              <img src={p.image} alt={`partner ${px}`} className="w-full" />
            </Col>
          ))
        }
      </Carousel>
    </Col>
    <Col span={1}>
      <Button type="link" onClick={onNext} className="partner-btn-right">
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC', zIndex: 999 }} icon="right" />
      </Button>
    </Col>
  </Row>
)

export default PartnerSection
