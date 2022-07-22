import React, { useRef } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import { Row, Col, Hidden } from 'react-awesome-styled-grid'

import jsonCaseStudies from '../../../json/dummy-case-studies.json'
import {
  Icon,
  Circle,
} from '../../components'
import Slides from '../components/Slides'

const Wrapper = styled.div`
  margin: 64px 0;
`

const CaseStudies = () => {
  const slider = useRef()
  const onPrev = () => {
    slider.current.prev()
  }
  const onNext = () => {
    slider.current.next()
  }
  return (
    <Wrapper>
      <Row>
        <Hidden sm xs>
          <Col lg={1} md={1} align="center" justify="center">
            <Button type="link" onClick={onPrev} style={{ height: '60px' }} aria-label="Previous button">
              <Circle size="44px">
                <Icon type="chevron.small.left" />
              </Circle>
            </Button>
          </Col>
        </Hidden>
        <Col lg={10} md={10} sm={8} xs={4}>
          <Slides data={jsonCaseStudies} reff={slider} />
        </Col>
        <Hidden sm xs>
          <Col lg={1} md={1} align="center" justify="center">
            <Button type="link" onClick={onNext} style={{ height: '60px' }} aria-label="Next button">
              <Circle size="44px">
                <Icon type="chevron.small.right" />
              </Circle>
            </Button>
          </Col>
        </Hidden>
      </Row>
    </Wrapper>
  )
}

export default CaseStudies
