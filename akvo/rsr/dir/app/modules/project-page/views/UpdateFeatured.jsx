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
import { MAX_TEXT_LENGTH } from '../../../utils/config'
import { getFirstPhoto } from '../../../utils/misc'

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
              <Col xl={12} lg={12} md={13} sm={24} xs={24}>
                <Skeleton loading={!results} active>
                  {results && (
                    <Carousel effect="fade">
                      {results.map((r, rx) => {
                        const firstPhoto = getFirstPhoto(r.photos)
                        const hasAnyPhoto = ((r.photo && r.photo.original) || firstPhoto)
                        const defaultCaption = firstPhoto ? firstPhoto.caption : null
                        const defaultCredit = firstPhoto ? firstPhoto.credit : null
                        const caption = hasAnyPhoto
                          ? r.photoCaption || defaultCaption
                          : r.videoCaption
                        const credit = hasAnyPhoto
                          ? r.photoCredit || defaultCredit
                          : r.videoCredit
                        return (
                          <Card
                            cover={
                              <Link to={`/dir/project/${projectId}/update?id=${r.id}`}>
                                <Thumbnail {...r} />
                              </Link>
                            }
                            className="title"
                            key={rx}
                          >
                            <small>
                              {caption && `“${caption}” `}<br />
                              {credit && `(${hasAnyPhoto ? 'Photo' : 'Video'} by ${r.photoCredit})`}
                            </small>
                            <br />
                            <br />
                            <Link to={`/dir/project/${projectId}/update?id=${r.id}`}><Title level={3}>{r.title}</Title></Link>
                            <Paragraph className="text-justify">
                              <TrimText url={`/dir/project/${projectId}/update?id=${r.id}`} text={r.text} max={MAX_TEXT_LENGTH - 250} isMarkdown />
                            </Paragraph>
                            <br />
                          </Card>
                        )
                      })}
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
