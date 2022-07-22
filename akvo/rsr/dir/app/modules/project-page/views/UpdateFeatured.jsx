import React, { useEffect, useState } from 'react'
import {
  Typography,
  Card,
  List,
  Row,
  Col,
  Skeleton,
  Carousel,
  Empty
} from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { queryStories } from '../queries'
import { TrimText } from '../../../utils/string'
import Thumbnail from '../components/Thumbnail'

const { Title, Paragraph } = Typography

const UpdateFeatured = ({ projectId, setFeatured }) => {
  const [preload, setPreload] = useState(true)
  const { data } = queryStories(projectId, 1, 6)
  const { results } = data || {}

  useEffect(() => {
    if (results && preload) {
      setFeatured(results.map((r) => r.id))
      setPreload(false)
    }
  }, [results, preload])
  return (
    <>
      <Row>
        <Col className="mb-2">
          <Title level={2} className="upper text-dark bold">LATEST UPDATES</Title>
          <span className="bottom-line" />
        </Col>
      </Row>
      {
        (results === undefined || (results && results.length))
          ? (
            <Row gutter={[{ lg: 40, md: 40, sm: 8, xs: 8 }, 8]} id="rsr-updates-featured">
              <Col lg={13} md={13} sm={24} xs={24}>
                <Skeleton loading={!results} active>
                  {results && (
                    <Carousel effect="fade">
                      {results.map((r, rx) => (
                        <Card
                          hoverable
                          cover={
                            <Link to={`/dir/project/${projectId}/update?id=${r.id}`}>
                              <Thumbnail {...r} />
                            </Link>
                          }
                          className="title"
                          key={rx}
                        >
                          <small>
                            “{r.photoCaption || r.videoCaption}”<br />
                            {(r.photo && r.photoCredit) ? `(Photo by ${r.photoCredit})` : null}<br />
                            {r.videoCredit ? `(Video by ${r.videoCredit})` : null}
                          </small>
                          <br />
                          <br />
                          <Link to={`/dir/project/${projectId}/update?id=${r.id}`}><Title level={3}>{r.title}</Title></Link>
                          <Paragraph className="text-justify"><TrimText text={r.text} max={500} isMarkdown /></Paragraph>
                        </Card>
                      ))}
                    </Carousel>
                  )}
                </Skeleton>
              </Col>
              <Col lg={11} md={11} sm={24} xs={24}>
                <Skeleton loading={!results} active>
                  {results && (
                    <List
                      className="project-updates"
                      itemLayout="horizontal"
                      dataSource={results}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={<div className="date">{moment(item.eventDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</div>}
                            description={(
                              <Link to={`/dir/project/${projectId}/update?id=${item.id}`}>
                                <span className="title">{item.title}</span>
                              </Link>
                            )}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Skeleton>
              </Col>
            </Row>
          )
          : (
            <Row>
              <Col>
                <Empty />
              </Col>
            </Row>
          )
      }
    </>
  )
}

export default UpdateFeatured
