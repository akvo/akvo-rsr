/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import SVGInline from 'react-svg-inline'
import {
  Row,
  Col,
  Icon,
  Typography
} from 'antd'
import moment from 'moment'

const { Text } = Typography

const FooterSection = ({
  images,
  footerUrl
}) => (
  <>
    <Row type="flex" justify="space-between" gutter={[8, 32]}>
      <Col lg={16} md={16} sm={14} xs={24}>
        <Row gutter={[8, 24]}>
          <Col>
            <SVGInline svg={images.logo.rsr} />
          </Col>
          <Col>
            <Text>
              Akvo Really Simple Reporting is an online<br />
              data platform where all your planning, <br />
              monitoring, evaluation and learning (PMEL) <br />
              processes come together.
            </Text>
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
                  <Text>About Us</Text>
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
      <Col lg={1} md={2} sm={2} xs={4}>
        <a href="https://twitter.com/akvo" target="_blank" rel="noopener noreferrer">
          <Icon type="twitter" />
        </a>
      </Col>
      <Col lg={1} md={2} sm={2} xs={4}>
        <a href="https://www.linkedin.com/company/akvo/" target="_blank" rel="noopener noreferrer">
          <Icon type="linkedin" theme="filled" />
        </a>
      </Col>
      <Col lg={1} md={2} sm={2} xs={4}>
        <a href="https://www.youtube.com/user/Akvofoundation" target="_blank" rel="noopener noreferrer">
          <Icon type="youtube" theme="filled" />
        </a>
      </Col>
      <Col lg={1} md={2} sm={2} xs={4}>
        <a href="https://github.com/akvo/akvo-rsr" target="_blank" rel="noopener noreferrer">
          <Icon type="github" theme="filled" />
        </a>
      </Col>
    </Row>
    <div style={{ marginTop: '3em' }}>
      <Text level={2} style={{ position: 'absolute', bottom: 16 }}>
        All rights Reserved © {moment().format('YYYY')} | <a href="https://staging3.akvo.org/akvo-rsr-privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </Text>
    </div>
  </>
)

export default FooterSection
