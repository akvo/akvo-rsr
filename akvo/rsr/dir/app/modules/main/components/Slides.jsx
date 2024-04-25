import React from 'react'
import { Carousel, Button, Row, Col } from 'antd'
import styled from 'styled-components'
import { ArrowRightOutlined } from '@ant-design/icons'

import { Flex, Number, Swipeable } from '../../components'
import { homePage } from '../../../utils/ui-text'
import AmpImage from '../../components/AmpImage'

const Wrapper = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  padding: 0 32px;
  color: ${props => props.theme.color.gray['900']};
  & > h4 {
    font-family: ${props => props.theme.font.heading.family};
    font-size: ${props => props.theme.font.heading.md};
    font-weight: ${props => props.theme.font.weight.bold};
    line-height: 42px;
  }
  & > p {
    font-weight: ${props => props.theme.font.weight.normal};
    font-size: ${props => props.theme.font.size.md};
    line-height: 24px;
  }

  @media (max-width: 1024px) {
    div {
      margin-right: 0;
      margin-bottom: 0;
    }
    & > h4 {
      font-size: ${props => props.theme.font.heading.sm};
      line-height: 36px;
    }
    & > p {
      font-size: ${props => props.theme.font.size.sm};
    }
  }
  @media (max-width: 576px) {
    margin-top: 32px;
    padding: 0;
  }
`
const Swipe = styled(Swipeable)`
  .ant-carousel .slick-dots-bottom {
    bottom: 0;
  }
`

const Slides = ({ data, reff }) => (
  <Swipe>
    <Carousel effect="fade" ref={reff}>
      {data.map((cs, cx) => (
        <Row type="flex" justify="center" align="middle" key={cx}>
          <Col lg={8} md={8} sm={24} xs={24} className="image">
            <AmpImage src={cs.image} alt={cs.title} width="100%" height="276">
              <Number>{cx + 1}</Number>
            </AmpImage>
          </Col>
          <Col lg={16} md={16} sm={24} xs={24} className="content">
            <Wrapper gap="16px">
              <h4>{cs.title}</h4>
              <p>{cs.content}</p>
              <Button type="link" href={cs.url} target="_blank" rel="noopener noreferrer" className="btn-read-more" aria-label="Go to case study">
                {homePage.exploreCaseStudy}
                <ArrowRightOutlined />
              </Button>
            </Wrapper>
          </Col>
        </Row>
      ))}
    </Carousel>
  </Swipe>
)

export default Slides
