/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import SVGInline from 'react-svg-inline'
import {
  Row,
  Col,
  Typography
} from 'antd'
import moment from 'moment'

import { Icon } from '../../components/Icon'

const { Text, Paragraph } = Typography

const FooterSection = ({
  images,
  footerUrl
}) => (
  <>
    <Row type="flex" justify="space-between" gutter={[8, 32]}>
      <Col lg={16} md={16} sm={14} xs={24}>
        <Row gutter={[8, 24]}>
          <Col lg={4} md={6} sm={8} xs={8}>
            <SVGInline svg={images.logo.rsr} />
          </Col>
          <Col span={24} className="footer-summary">
            <Paragraph>Akvo Really Simple Reporting is an online</Paragraph>
            <Paragraph>data platform where all your planning</Paragraph>
            <Paragraph>monitoring, evaluation and learning (PMEL)</Paragraph>
            <Paragraph>processes come together.</Paragraph>
          </Col>
        </Row>
      </Col>
      <Col lg={3} md={3} sm={4} xs={6}>
        <Row gutter={[8, 24]}>
          <Col>
            <Text strong>AKVO RSR</Text>
          </Col>
          <Col>
            <ul>
              <li>
                <a href="https://akvo.org/streamline-your-pmel-processes/" target="_blank" rel="noopener noreferrer">
                  <Text>About us</Text>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
      <Col lg={5} md={5} sm={6} xs={18}>
        <Row gutter={[8, 24]}>
          <Col>
            <Text strong>LEARNING</Text>
          </Col>
          <Col>
            <ul style={{ lineHeight: '2em' }}>
              {footerUrl.home.map((f, fx) => (
                <li key={fx}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    <Text>{f.text}</Text>
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" gutter={[16, 8]} className="rsr-social-icons">
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://twitter.com/akvo" target="_blank" rel="noopener noreferrer">
          <Icon type="social.twitter" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://www.linkedin.com/company/akvo/" target="_blank" rel="noopener noreferrer">
          <Icon type="social.linkedin" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://www.youtube.com/user/Akvofoundation" target="_blank" rel="noopener noreferrer">
          <Icon type="social.youtube" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://github.com/akvo/akvo-rsr" target="_blank" rel="noopener noreferrer">
          <Icon type="social.github" />
        </a>
      </Col>
    </Row>
    <div style={{ marginTop: '3em' }}>
      <Text level={2}>
        All rights Reserved © {moment().format('YYYY')} | <a href="https://akvo.org/akvo-rsr-privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </Text>
    </div>
  </>
)

export default FooterSection
