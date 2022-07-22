import React, { useState } from 'react'
import { Carousel, Empty, Skeleton } from 'antd'
import { Col, Row } from 'react-awesome-styled-grid'
import SimpleMarkdown from 'simple-markdown'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { queryStories } from '../../queries'
import {
  Button,
  Line,
  Paragraph,
  Text,
  Title,
  Swipeable,
  Flex,
  Number,
} from '../../../components'
import { images, prefixUrl } from '../../../../utils/config'
import { getYoutubeID, shortenText } from '../../../../utils/string'
import AmpImage from '../../../components/AmpImage'

const TextWrapper = styled(Flex)`
  min-height: 276px;
  flex-direction: column;
  justify-content: end;
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

  const getImageUrl = item => {
    const videoID = item.video ? getYoutubeID(item.video) : null
    const thumb = videoID ? `https://img.youtube.com/vi/${videoID}/0.jpg` : null
    return item.photo
      ? `${prefixUrl}${item.photo.original}`
      : thumb || images.default
  }

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  const loading = (!data && !error)
  const description = results && results[active] ? shortenText(results[active].text, 450) : ''
  return (
    <Skeleton loading={loading} active>
      <Title as="h2" type="bold" size="sm">
        HIGHLIGHTS
        <Line />
      </Title>
      <Row justify="space-between">
        <Col lg={6} md={6} sm={8} xs={4}>
          {results && results.length > 0 && (
            <TextWrapper gap="24px">
              <Text as="h3" size="xl">
                {results && results[active] ? results[active].title : ''}
              </Text>
              <Paragraph size="sm">
                {mdOutput(parse(description))}
              </Paragraph>
              <Button href={`/dir/project/${params.projectId}/update?id=${results[active].id}`} border="0">Read more</Button>
            </TextWrapper>
          )}
        </Col>
        <Col lg={4} md={6} sm={8} xs={4}>
          <Swipe>
            <Carousel afterChange={setActive} effect="fade">
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
      {results && results.length === 0 && <Empty />}
    </Skeleton>
  )
}

export default withRouter(Highlight)
