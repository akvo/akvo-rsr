import React, { useRef } from 'react'
import { Carousel, Button } from 'antd'
import { Circle, Icon, Vstack } from '../../components'
import jsonPartners from '../../../json/partners.json'

const PartnerSection = () => {
  const slider = useRef()
  const onPrev = () => {
    slider.current.prev()
  }
  const onNext = () => {
    slider.current.next()
  }
  return (
    <Vstack>
      <Vstack.Col width={5}>
        <Button type="link" onClick={onPrev} style={{ height: '60px' }}>
          <Circle size="40px">
            <Icon type="chevron.left" />
          </Circle>
        </Button>
      </Vstack.Col>
      <Vstack.Col width={90}>
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
            jsonPartners.map((p, px) => (
              <div key={px}>
                <img src={p.image} alt={`partner ${px}`} style={{ width: '100%' }} />
              </div>
            ))
          }
        </Carousel>
      </Vstack.Col>
      <Vstack.Col width={5}>
        <Button type="link" onClick={onNext} style={{ height: '60px' }}>
          <Circle size="40px">
            <Icon type="chevron.right" />
          </Circle>
        </Button>
      </Vstack.Col>
    </Vstack>
  )
}

export default PartnerSection
