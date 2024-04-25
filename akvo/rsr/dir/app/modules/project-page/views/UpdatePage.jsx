import React from 'react'
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons'
import { Row, Col, Result, Button, Typography, Spin, Divider, Carousel } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'
import { Container } from 'react-awesome-styled-grid'
import styled from 'styled-components'

import Author from '../components/Author'
import UpdateItem from './UpdateItem'
import { images } from '../../../utils/config'
import { Section, Swipeable } from '../../components'
import { queryOtherStories, queryStory } from '../queries'
import Video from '../components/Video'
import Thumbnail from '../components/Thumbnail'

const { Title, Paragraph, Text } = Typography

const useQuery = () => {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const Header = styled(Section)`
  background: linear-gradient(180deg, #eff3fc 50%, #ffffff 50%);
  min-height: 250px;
`

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
  const photos = data
    ? [data.photo, ...data.photos]
      .filter((p) => p)
      .map((p) => ({
        ...p,
        id: p.id || data.id,
        photo: p.photo || p.original || images.default,
        caption: p.caption || data.photoCaption,
        credit: p.credit || data.photoCredit,
      }))
    : []
  return <>
    <Header>
      <Container>
        <Row type="flex" justify="start" align="middle">
          <Col lg={1} md={1} sm={2} xs={22}>
            <Link to={query.get('home') ? `/dir/project/${projectId}/` : `/dir/project/${projectId}/updates`}>
              <LeftOutlined style={{ fontSize: 32 }} />
            </Link>
          </Col>
          <Col lg={23} md={23} sm={2} xs={22}>
            <Title className="page-title">{data ? data.title : 'Loading...'}</Title>
            <Row>
              <Col xl={8} lg={14} md={14} sm={20} xs={20}>
                <Swipeable>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={!data}>
                    <Carousel className="hasIframe">
                      {(data && data.video) && (
                        <div>
                          <Video {...data} />
                          <Text type="secondary">{data.videoCaption}</Text><br />
                          <Text type="secondary">{data.videoCredit ? `(Video by ${data.videoCredit})` : ''}</Text>
                        </div>
                      )}
                      {photos.map((p) => (
                        <div key={p.id}>
                          <figure>
                            <Thumbnail {...p} className="project-image" />
                            <figcaption>
                              <Text type="secondary">{p.caption}</Text><br />
                              <Text type="secondary">{p.credit.length ? `(Photo by ${p.credit})` : ''}</Text>
                            </figcaption>
                          </figure>
                        </div>
                      ))}
                      {(data && (photos.length === 0 && !data.video)) && <div><Thumbnail {...data} className="project-image" /></div>}
                    </Carousel>
                  </Spin>
                </Swipeable>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Header>
    <Section>
      <Container>
        <Row gutter={[8, 32]}>
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
          <Col className="mb-3">
            {(results && results.length > 0) && (
              <div style={{ margin: '3em 0' }}>
                <Title level={2} style={{ textTransform: 'capitalize' }}>Latest updates from this project</Title>
                <span className="bottom-line" />
              </div>
            )}
          </Col>
        </Row>
        <Row gutter={[32, 8]}>
          {
            results
              ? results.map((result) => <UpdateItem key={result.id} {...{ ...result, projectId }} />)
              : [1, 2, 3].map((item) => <UpdateItem key={item} loading />)
          }
        </Row>
      </Container>
    </Section>
  </>
}

export default UpdatePage
