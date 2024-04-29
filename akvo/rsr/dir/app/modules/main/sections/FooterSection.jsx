/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import SVGInline from 'react-svg-inline'
import {
  Row,
  Col,
  Typography
} from 'antd'
import styled from 'styled-components'

import { Icon } from '../../components/Icon'
import { images, footerUrl } from '../../../utils/config'

const { Text } = Typography

const Wrapper = styled.div`
  ul, li, span, p {
    color: ${props => props.theme.color.gray['900']};
  }
  p {
    line-height: 24px;
  }
  ul, li {
    line-height: 28px;
  }
  .ant-typography strong {
    font-weight: ${props => props.theme.font.weight.bold};
  }
  ul li a .ant-typography:hover {    
    color: ${props => props.theme.color.primary['700']};
  }
`

const FooterSection = () => (
  <Wrapper>
    <Row type="flex" justify="space-between" gutter={[8, 32]}>
      <Col lg={16} md={16} sm={14} xs={24}>
        <Row gutter={[8, 24]}>
          <Col lg={4} md={6} sm={8} xs={8}>
            <SVGInline svg={images.logo.rsr} />
          </Col>
          <Col span={24} className="footer-summary">
            <p>
              Akvo Really Simple Reporting is an online<br />
              data platform where all your planning,<br />
              monitoring, evaluation and learning (PMEL)<br />
              processes come together.
            </p>
          </Col>
        </Row>
      </Col>
      <Col lg={3} md={3} sm={24} xs={24}>
        <Row gutter={[8, 24]}>
          <Col span={24}>
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
      <Col lg={5} md={5} sm={24} xs={24}>
        <Row gutter={[8, 16]}>
          <Col span={24}>
            <Text strong>LEARNING</Text>
          </Col>
          <Col>
            <ul>
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
        <a href="https://twitter.com/akvo" target="_blank" rel="noopener noreferrer" aria-label="Akvo's twitter account">
          <Icon type="social.twitter" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://www.linkedin.com/company/akvo/" target="_blank" rel="noopener noreferrer" aria-label="Akvo's linked account">
          <Icon type="social.linkedin" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://www.youtube.com/user/Akvofoundation" target="_blank" rel="noopener noreferrer" aria-label="Akvo's youtube account">
          <Icon type="social.youtube" />
        </a>
      </Col>
      <Col lg={1} md={1} sm={2} xs={2}>
        <a href="https://github.com/akvo/akvo-rsr" target="_blank" rel="noopener noreferrer" aria-label="Akvo's github account">
          <Icon type="social.github" />
        </a>
      </Col>
    </Row>
  </Wrapper>
)

export default FooterSection
