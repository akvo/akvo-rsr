import React from 'react'
import SVGInline from 'react-svg-inline'
import { Row, Col, Typography } from 'antd'

const { Paragraph } = Typography

const JumboTron = ({ images }) => (
  <Row type="flex" justify="start" align="top" gutter={[32, 8]}>
    <Col lg={12} md={12} xs={24}>
      <Row>
        <Col span={14}>
          <h1 className="text-6xl">
            <mark>Really</mark>
          </h1>
          <h1 className="text-6xl">
            <mark>Simple</mark>
          </h1>
          <h1 className="text-6xl">
            <mark>Reporting</mark>
          </h1>
        </Col>
        <Col span={10} className="image-sm">
          <SVGInline svg={images.home.rsr} width="100%" height="auto" />
        </Col>
      </Row>
      <Paragraph className="text-lg">
        Akvo Really Simple Reporting is an online data platform where all your planning, monitoring, evaluation and learning (PMEL) processes come together. <br />
        Monitor the results of your projects in one platform, in a shared format that everyone in your team understands.
      </Paragraph>
    </Col>
    <Col lg={8} md={10} xs={24}>
      <SVGInline svg={images.home.rsr} width="100%" height="432px" className="image-lg" />
    </Col>
  </Row>
)

export default JumboTron
