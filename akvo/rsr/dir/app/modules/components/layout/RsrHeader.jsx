import React from 'react'
import {
  Layout,
  Row,
  Col,
  Button
} from 'antd'
import SVGInline from 'react-svg-inline'

import rsrLogo from '../../../images/rsrLogo.svg'
import RsrCol from '../RsrCol'

const { Header } = Layout

const WithLogo = ({
  children,
  col = {},
  left = [],
  right = [],
  ...props
}) => (
  <Header {...props}>
    <Row type="flex" justify="space-between" align="middle">
      <Col
        xl={left[0] || 4}
        lg={left[1] || 4}
        md={left[2] || 24}
        sm={left[3] || 24}
        xs={left[4] || 24}
        {...col}
      >
        <Button type="link" href="/">
          <SVGInline svg={rsrLogo} className="logo" width="120px" />
        </Button>
      </Col>
      <Col
        xl={right[0] || 20}
        lg={right[1] || 20}
        md={right[2] || 24}
        sm={right[3] || 24}
        xs={right[4] || 24}
        {...col}
      >
        {children}
      </Col>
    </Row>
  </Header>
)

const RsrHeader = ({
  auto = false,
  style = {},
  children,
  ...props
}) => (
  <Header
    style={{
      ...style,
      height: (!style.height || auto) ? 'auto' : style.height
    }}
    {...props}
  >
    <Row>
      {children}
    </Row>
  </Header>
)

RsrHeader.WithLogo = WithLogo
RsrHeader.Col = RsrCol

export default RsrHeader
