import React from 'react'
import {
  Row,
  Col,
  Result,
  Button,
  Typography,
  Icon,
  Spin,
  Divider,
  Carousel
} from 'antd'
import { Link, useLocation } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'

import Author from '../components/Author'
import UpdateItem from './UpdateItem'
import Section from '../../components/Section'
import { images, prefixUrl } from '../../../utils/config'
import { queryOtherStories, queryStory } from '../queries'
import { getQueryFromStringUrl } from '../../../utils/string'
import Video from '../components/Video'

const { Title, Paragraph, Text } = Typography

const useQuery = () => {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const UpdatePage = ({ projectId }) => {
  const query = useQuery()
  const { data, error } = queryStory(query.get('id'))
  const { data: other } = queryOtherStories(projectId, query.get('id'))
  const { results } = other || {}

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  if (error) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={(
          <>
            <Link to="/">
              <Button type="primary">Back Home</Button>
            </Link>
          </>
        )}
      />
    )
  }
  const videoUrl = data && data.video ? data.video : null
  const { v: videoID } = videoUrl ? getQueryFromStringUrl(videoUrl) : {}
  const notYoutube = videoUrl && !videoID
  const photos = data
    ? [data.photo, ...data.photos]
      .filter((p) => p)
      .map((p) => ({
        ...p,
        id: p.id || data.id,
        photo: p.photo || p.original,
        caption: p.caption || data.photoCaption,
        credit: p.credit || data.photoCredit,
      }))
      .map((p) => ({
        ...p,
        photo: p.photo ? `${prefixUrl}${p.photo}` : images.default
      }))
    : []
  return (
    <>
      <Section style={{ height: 250 }}>
        <Row type="flex" justify="start" align="middle">
          <Col lg={1} md={1} sm={2} xs={22}>
            <Link to={`/dir/project/${projectId}/updates`}>
              <Icon type="left" />
            </Link>
          </Col>
          <Col lg={23} md={23} sm={2} xs={22}>
            <Title className="text-dark">{data ? data.title : 'Loading...'}</Title>
          </Col>
        </Row>
      </Section>
      <Section>
        <Row gutter={[8, 32]}>
          <Col lg={10} md={12} sm={24} xs={24} style={{ marginTop: '-15%' }}>
            <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning={!data}>
              <Carousel>
                {videoUrl && (
                  <div>
                    {videoID && <Video youtube={videoID} title={data.title} />}
                    {notYoutube && <Video url={videoUrl} title={data.title} />}
                    <Text type="secondary">{data.videoCaption}</Text><br />
                    <Text type="secondary">{data.videoCredit ? `(Video by ${data.videoCredit})` : ''}</Text>
                  </div>
                )}
                {photos
                  .filter((p) => p)
                  .map((p) => (
                    <div key={p.id}>
                      <figure>
                        <img alt={data.title} src={p.photo} className="project-image" />
                        <figcaption>
                          <Text type="secondary">{p.caption}</Text><br />
                          <Text type="secondary">{p.credit.length ? `(Photo by ${p.credit})` : ''}</Text>
                        </figcaption>
                      </figure>
                    </div>
                  ))}
              </Carousel>
            </Spin>
          </Col>
          <Col span={24}>
            <Paragraph className="text-justify full-text">{data ? mdOutput(parse(data.text)) : ''}</Paragraph>
          </Col>
          <Col span={24}>
            <Author {...data} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Divider />
          </Col>
          {(results && results.length > 0) && (
            <Col className="mb-3">
              <Title level={2} style={{ textTransform: 'capitalize' }}>Latest updates from this project</Title>
              <span className="bottom-line" />
            </Col>
          )}
        </Row>
        <Row gutter={[32, 8]}>
          {
            results
              ? results.map((result) => <UpdateItem key={result.id} {...{ ...result, projectId }} />)
              : [1, 2, 3].map((item) => <UpdateItem key={item} loading />)
          }
        </Row>
      </Section>
    </>
  )
}

export default UpdatePage
