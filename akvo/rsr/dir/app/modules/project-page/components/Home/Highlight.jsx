/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react'
import { Carousel, Empty, Skeleton } from 'antd'
import { Col, Hidden, Row } from 'react-awesome-styled-grid'
import SimpleMarkdown from 'simple-markdown'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import { queryStories } from '../../queries'
import {
  Line,
  Paragraph,
  Title,
  Swipeable,
  Number,
  Circle,
  Icon,
  Button,
} from '../../../components'
import { images, MAX_TEXT_LENGTH, prefixUrl } from '../../../../utils/config'
import { getYoutubeID, shortenText } from '../../../../utils/string'
import AmpImage from '../../../components/AmpImage'
import { append } from '../../../../features/project/updatesSlice'

const TextWrapper = styled.div`
  position: relative;
  min-height: 315px;
  a {
    position: absolute;
    bottom: 0;
  }
  @media (max-width: 1024px) {
    h3 {
      font-size: 20px;
    }
    .paragraph {
      font-size: ${props => props.theme.font.size.xs};
      line-height: 20px;
    }
    &.fullText a {
      position: relative;
    }
  }
`
const Swipe = styled(Swipeable)`
  margin-bottom: 32px;
  @media (max-width: 576px) {
    margin-top: 64px;  
  }
`

const Highlight = ({ match: { params } }) => {
  const [active, setActive] = useState(0)
  const { data, error } = queryStories(params.projectId, 1)
  const { results } = data || {}
  const { fetched } = useSelector((state) => state.projectUpdates)
  const dispatch = useDispatch()
  const slider = useRef()
  const onPrev = () => {
    slider.current.prev()
  }
  const onNext = () => {
    slider.current.next()
  }

  const getImageUrl = item => {
    const videoID = item.video ? getYoutubeID(item.video) : null
    const thumb = videoID ? `https://img.youtube.com/vi/${videoID}/0.jpg` : null
    return item.photo
      ? `${prefixUrl}${item.photo.original}`
      : thumb || images.default
  }

  useEffect(() => {
    if (data && !fetched) {
      dispatch(append(results))
    }
  }, [data, error, fetched])

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  const loading = (!data && !error)
  const description = results ? results[active] ? shortenText(results[active].text, MAX_TEXT_LENGTH) : '' : ''
  return (
    <Skeleton loading={loading} active>
      {results && results.length > 0 && (
        <Row>
          <Col xl={1} lg={1} md={1} justify="center" align="start">
            <Hidden sm xs>
              <a onClick={onPrev} role="button" aria-label="Previous button" tabIndex={-1}>
                <Circle size="44px">
                  <Icon type="chevron.small.left" />
                </Circle>
              </a>
            </Hidden>
          </Col>
          <Col xl={10} lg={10} md={10} sm={8} xs={4}>
            <Title as="h2" type="bold" size="sm">
              HIGHLIGHTS
              <Line />
            </Title>
            <Row justify="space-between">
              <Col lg={7} md={6} sm={8} xs={4}>
                <TextWrapper className={classNames({ fullText: (description.trim().length >= MAX_TEXT_LENGTH - 10) })}>
                  <Title as="h3" size="xs">
                    {results && results[active] ? results[active].title : ''}
                  </Title>
                  <Paragraph size="sm">
                    {mdOutput(parse(description))}
                  </Paragraph>
                  <br />
                  <Button type="link" href={`/dir/project/${params.projectId}/update?id=${results[active].id}&home=1`} antd>
                    Read more
                  </Button>
                </TextWrapper>
              </Col>
              <Col lg={5} md={6} sm={8} xs={4}>
                <Swipe>
                  <Carousel afterChange={setActive} effect="fade" ref={slider}>
                    {results && results.map((r, rx) => (
                      <div key={r.id}>
                        <AmpImage src={getImageUrl(r)} alt={r.title} width="100%" height="276">
                          <Number>{rx + 1}</Number>
                        </AmpImage>
                      </div>
                    ))}
                  </Carousel>
                </Swipe>
              </Col>
            </Row>
          </Col>
          <Col xl={1} lg={1} md={1} justify="center" align="end">
            <Hidden sm xs>
              <a onClick={onNext} role="button" aria-label="Next button" tabIndex={0}>
                <Circle size="44px">
                  <Icon type="chevron.small.right" />
                </Circle>
              </a>
            </Hidden>
          </Col>
        </Row>
      )}
      {results && results.length === 0 && (
        <>
          <Title as="h2" type="bold" size="sm">
            HIGHLIGHTS
            <Line />
          </Title>
          <Empty />
        </>
      )}
    </Skeleton>
  )
}

export default withRouter(Highlight)
