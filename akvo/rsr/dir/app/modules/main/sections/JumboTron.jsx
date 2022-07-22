import React from 'react'
import { Row, Col, Hidden } from 'react-awesome-styled-grid'

import { Paragraph, Mark, Icon } from '../../components'
import { homePage } from '../../../utils/ui-text'

const JumboTron = () => (
  <Row>
    <Col sm={8} md={7} lg={8} xl={8} justify="center" align="flex-start">
      {homePage.jumbotron.marker.map((text, x) => <Mark key={x}>{text}</Mark>)}
      <Paragraph as="p">
        {homePage.jumbotron.paragraph1}<br /><br />
        {homePage.jumbotron.paragraph2}
      </Paragraph>
    </Col>
    <Hidden sm xs>
      <Col md={5} lg={3} xl={3} justify="center" style={{ display: 'block' }}>
        <Icon type="home.monitoring" style={{ marginLeft: '26px' }} />
      </Col>
    </Hidden>
  </Row>
)

export default JumboTron
