import React from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Typography
} from 'antd'
import { Container } from 'react-awesome-styled-grid'

const { Title, Paragraph } = Typography

const ContactForm = () => {
  return (
    <Row type="flex" justify="center" id="rsr-contact-form">
      <Col lg={12}>
        <Title className="text-center">Contact us to schedule a demo</Title>
        <Container>
          <Paragraph className="text-center">
            Schedule a demo and let our expert team show you how to make the most of your project data using Akvo’s Really Simple Reporting
          </Paragraph>
        </Container>
        <Row type="flex" justify="center" className="mb-3">
          <Col lg={16} md={16} sm={20} xs={20} className="text-left">
            <Input.Group className="w-full" size="large">
              <Row>
                <Col lg={20} md={20} sm={14} xs={14}>
                  <Input type="email" placeholder="Your Email" />
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <Button type="primary" size="large">Request demo</Button>
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
