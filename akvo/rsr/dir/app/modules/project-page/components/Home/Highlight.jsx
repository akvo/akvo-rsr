import React, { useState, useEffect, useRef } from 'react'
import { Button, Carousel, Empty, Skeleton } from 'antd'
import { Col, Hidden, Row } from 'react-awesome-styled-grid'
import SimpleMarkdown from 'simple-markdown'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { queryStories } from '../../queries'
import {
  Line,
  Paragraph,
  Text,
  Title,
  Swipeable,
  Flex,
  Number,
  Circle,
  Icon,
} from '../../../components'
import { images, prefixUrl } from '../../../../utils/config'
import { getYoutubeID, shortenText } from '../../../../utils/string'
import AmpImage from '../../../components/AmpImage'
import { append } from '../../../../features/project/updatesSlice'

const TextWrapper = styled(Flex)`
  min-height: 276px;
  flex-direction: column;
  justify-content: end;
  .ant-btn.ant-btn-link {
    width: fit-content;
    padding: 0;
    &:hover {
      border-bottom: 2px solid ${props => props.theme.color.primary['700']};
      border-radius: 0;
    }
  }
`

const Swipe = styled(Swipeable)`
  margin-bottom: 32px;
  @media (max-width: 576px) {
    margin-top: 64px;  
  }
`

const NavButton = styled(Button)`
  width: 44px;
  &.left > div {
    margin-left: -32px;
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
  const description = results && results[active] ? shortenText(results[active].text, 450) : ''
  return (
    <Skeleton loading={loading} active>
      {results && results.length > 0 && (
        <Row>
          <Col xl={1} lg={1} md={1} justify="center" align="start">
            <Hidden sm xs>
              <NavButton type="link" onClick={onPrev} aria-label="Previous button" className="left">
                <Circle size="44px">
                  <Icon type="chevron.small.left" />
                </Circle>
              </NavButton>
            </Hidden>
          </Col>
          <Col xl={10} lg={10} md={10} sm={8} xs={4}>
            <Row justify="space-between">
              <Col lg={8} md={6} sm={8} xs={4}>
                <Title as="h2" type="bold" size="sm">
                  HIGHLIGHTS
                  <Line />
                </Title>
                <TextWrapper gap="24px">
                  <Text as="h3" size="xl">
                    {results && results[active] ? results[active].title : ''}
                  </Text>
                  <Paragraph size="sm">
                    {mdOutput(parse(description))}
                  </Paragraph>
                  <Button type="link" href={`/dir/project/${params.projectId}/update?id=${results[active].id}`}>
                    Read more
                  </Button>
                </TextWrapper>
              </Col>
              <Col lg={4} md={6} sm={8} xs={4}>
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
              <NavButton type="link" onClick={onNext} aria-label="Next button">
                <Circle size="44px">
                  <Icon type="chevron.small.right" />
                </Circle>
              </NavButton>
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
