import React from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Typography
} from 'antd'

const { Title, Paragraph } = Typography

const ContactForm = () => {
  return (
    <Row type="flex" justify="center" id="rsr-contact-form">
      <Col lg={12}>
        <Title className="text-center">Contact Us to Schedule a demo</Title>
        <Paragraph className="text-center">
          Schedule a Demo and Let our expert team show you how to make the most of your project data using<br />
          Akvo’s Really Simple Reporting
        </Paragraph>
        <Row type="flex" justify="center" className="mb-3">
          <Col lg={16} className="text-left">
            <Input.Group className="w-full" size="large">
              <Row>
                <Col span={20}>
                  <Input type="email" placeholder="Your Email" />
                </Col>
                <Col span={4}>
                  <Button type="primary" size="large">Request Demo</Button>
                </Col>
              </Row>
            </Input.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ContactForm
