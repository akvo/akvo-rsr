import React from 'react'
import {
  Carousel,
  Button,
  Avatar
} from 'antd'
import { VStack } from '../../components/rsr'

const PartnerSection = ({
  slider,
  partners,
  onPrev,
  onNext
}) => (
  <VStack>
    <VStack.Col width={5}>
      <Button type="link" onClick={onPrev} className="partner-btn-left">
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC', zIndex: 999 }} icon="left" />
      </Button>
    </VStack.Col>
    <VStack.Col width={90}>
      <Carousel
        dots={false}
        ref={slider}
        centerPadding={80}
        slidesToShow={6}
        slidesToScroll={12}
        speed={500}
        initialSlide={0}
        responsive={[
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 7,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 810,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 10,
              initialSlide: 0
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 2,
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
            <div key={px}>
              <img src={p.image} alt={`partner ${px}`} style={{ width: '100%' }} />
            </div>
          ))
        }
      </Carousel>
    </VStack.Col>
    <VStack.Col width={5}>
      <Button type="link" onClick={onNext} className="partner-btn-right">
        <Avatar style={{ backgroundColor: '#ECF2F8', color: '#2593FC', zIndex: 999 }} icon="right" />
      </Button>
    </VStack.Col>
  </VStack>
)

export default PartnerSection
