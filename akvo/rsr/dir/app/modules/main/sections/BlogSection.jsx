import React from 'react'
import {
  Row,
  Col,
  Icon,
  Button,
  Carousel
} from 'antd'
import styled from 'styled-components'
import jsonCaseStudies from '../../../json/dummy-case-studies.json'
import { homePage } from '../../../utils/ui-text'
import { Image } from '../../components/rsr'


const Wrapper = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${props => props.theme.color.gray['900']};
  & > h3 {
    font-family: ${props => props.theme.font.heading.family};
    font-size: ${props => props.theme.font.heading.md};
    font-weight: ${props => props.theme.font.weight.bold};
    line-height: 42px;
  }
  & > p {
    font-weight: ${props => props.theme.font.weight.normal};
    font-size: ${props => props.theme.font.size.md};
    line-height: 32px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    gap: 0;
    & > h3 {
      font-size: ${props => props.theme.font.heading.sm};
    }
    & > p {
      font-size: ${props => props.theme.font.size.sm};
      line-height: 24px;
    }
  }
  @media (min-width: 577px) and (max-width: 767px) {
    gap: 0;
    & > p {
      font-size: ${props => props.theme.font.size.sm};
      line-height: 24px;
    }
  }
`

const BlogSection = () => (
  <Carousel effect="fade">
    {jsonCaseStudies.map((cs, cx) => (
      <Row key={cs.id} className="w-full">
        <Col lg={8} md={10}>
          <Image src={cs.image}>
            <Image.Number>{cx + 1}</Image.Number>
          </Image>
        </Col>
        <Col lg={15} md={13} offset={1}>
          <Wrapper>
            <h3>{cs.title}</h3>
            <p>{cs.content}</p>
            <Button type="link" href={cs.url} target="_blank" rel="noopener noreferrer" className="btn-read-more">
              {homePage.exploreCaseStudy}
              <Icon type="arrow-right" />
            </Button>
          </Wrapper>
        </Col>
      </Row>
    ))}
  </Carousel>
)

export default BlogSection
