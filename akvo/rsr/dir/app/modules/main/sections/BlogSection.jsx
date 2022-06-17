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
  <Row type="flex" justify="center">
    <Col span={22}>
      <Carousel effect="fade">
        {jsonCaseStudies.map((cs, cx) => (
          <Row gutter={[{ lg: 32, md: 32, sm: 8, xs: 8 }, 8]} key={cs.id} className="w-full">
            <Col lg={8} md={11} sm={24}>
              <Slide image={cs.image} index={cx + 1} />
            </Col>
            <Col lg={14} md={13} sm={24} className="summary">
              <Title>{cs.title}</Title>
              <div className="text-justify">
                <Text>{cs.content}</Text>
              </div>
              <Button
                type="link"
                href={cs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-read-more"
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
