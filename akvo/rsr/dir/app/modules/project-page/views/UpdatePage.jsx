import React from 'react'
import {
  Row,
  Col,
  Result,
  Button,
  Typography,
  Icon,
  Spin,
  Divider
} from 'antd'
import { Link, useLocation } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'

import Author from '../components/Author'
import UpdateItem from './UpdateItem'
import Section from '../../components/Section'
import { prefixUrl } from '../../../utils/config'
import { queryOtherStories, queryStory } from '../queries'

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
  return (
    <>
      <Section>
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
          <Col lg={10} md={12} sm={24} xs={24}>
            <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning={!data}>
              <img
                className="project-image"
                alt={data ? data.title : ''}
                src={data ? data.photo ? `${prefixUrl}/${data.photo.original}` : '#' : '#'}
              />
            </Spin>
            <Text type="secondary">{data ? data.photoCaption : ''}</Text><br />
            <Text type="secondary">{(data && data.photoCredit.length) ? `(Photo by: ${data.photoCredit})` : ''}</Text>
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
          <Col className="mb-3">
            <Title level={2} style={{ textTransform: 'capitalize' }}>Latest updates from this project</Title>
            <span className="bottom-line" />
          </Col>
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
