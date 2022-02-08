import React from 'react'
import {
  Typography,
  Layout,
  Row,
  Col
} from 'antd'

const { Footer } = Layout
const { Title } = Typography

const FooterLink = () => (
  <Footer className="footer">
    <Row gutter={[8, 32]}>
      <Col span={6}>
        <Title level={4}>RELATED DOCUMENTS</Title>
      </Col>
      <Col span={6}>
        <Title level={4}>RELATED LINKS</Title>
      </Col>
      <Col span={6}>
        <Title level={4}>WIDGETS</Title>
      </Col>
      <Col span={6}>
        <Title level={4}>EXPORT DATA</Title>
      </Col>
      <Col span={6}>
        <ul>
          <li>
            <a href="/">
              Conservation Agriculture Fact Sheet
            </a>
          </li>
        </ul>
      </Col>
      <Col span={6}>
        <ul>
          <li>
            <a href="/">
              Website - SNV Kenya
            </a>
          </li>
        </ul>
      </Col>
      <Col span={6}>
        <ul>
          <li>
            <a href="/">
              Grab a widget
            </a>
          </li>
        </ul>
      </Col>
      <Col span={6}>
        <ul>
          <li>
            <a href="/">
              RSS
            </a>
          </li>
          <li>
            <a href="/">
              JSON
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  </Footer>
)

export default FooterLink
