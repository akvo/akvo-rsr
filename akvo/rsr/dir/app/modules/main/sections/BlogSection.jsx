import React from 'react'
import {
  Row,
  Col,
  Icon,
  Button,
  Carousel,
  Typography
} from 'antd'
import Slide from '../../project-page/components/Slide'
import jsonCaseStudies from '../../../json/dummy-case-studies.json'

const { Title, Text } = Typography

const BlogSection = () => (
  <Row type="flex" justify="center" className="mb-3">
    <Col span={22}>
      <Carousel>
        {jsonCaseStudies.map((cs, cx) => (
          <Row gutter={[32, 8]} key={cs.id}>
            <Col lg={8} md={11} sm={24}>
              <Slide
                image={cs.image}
                style={{ height: 280 }}
                index={cx + 1}
              />
            </Col>
            <Col lg={14} md={13} sm={24} style={{ minHeight: 280 }} className="summary">
              <Title>{cs.title}</Title>
              <div className="text-justify">
                <Text>{cs.content}</Text>
              </div>
              <Button
                type="link"
                href={cs.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the Case Study
                <Icon type="arrow-right" />
              </Button>
            </Col>
          </Row>
        ))}
      </Carousel>
    </Col>
  </Row>

)

export default BlogSection
