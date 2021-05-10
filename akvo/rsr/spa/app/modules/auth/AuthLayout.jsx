import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Layout, Card, Typography } from 'antd'
import SVGInline from 'react-svg-inline'
import logoSvg from '../../images/akvorsr.svg'
import './AuthLayout.scss'

const { Content } = Layout
const { Title, Text } = Typography

const AuthLayout = ({ children }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <Content>
        <Row>
          <Col md={12} sm={24} className="logo-bg">
            <Row justify="center" gutter={[32, 32]}>
              <Col span={24} className="text-center" style={{ paddingTop: '35%' }}>
                <SVGInline svg={logoSvg} />
              </Col>
              <Col span={12} offset={6} className="text-center">
                <Title level={3}>
                  {t('Welcome to Akvo RSR, the tool that helps you monitor, report and share your results with ease')}
                </Title>
              </Col>
            </Row>
          </Col>
          <Col md={12} sm={24} className="place-content-center login-bg">
            <Card className="login-card">{children}</Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default AuthLayout
