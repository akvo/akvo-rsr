import React from 'react'
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

import { queryStories } from '../queries'
import defaultImage from '../../../images/default-image.png'
import { TrimText } from '../../../utils/string'

const { Title, Paragraph } = Typography

const UpdateFeatured = ({ projectId }) => {
  const { data } = queryStories(projectId, 1, 6)
  const { results } = data || {}
  return (
    <>
      <Row className="mb-2">
        <Col>
          <Title level={2} className="upper text-dark bold">latest updates</Title>
          <span className="bottom-line" />
        </Col>
      </Row>
      {
        (results === undefined || (results && results.length))
          ? (
            <Row gutter={[32, 8]}>
              <Col span={13}>
                <Skeleton loading={!results} active>
                  {results && (
                    <Carousel effect="fade">
                      {results.map((r, rx) => (
                        <a href={r.absoluteUrl} target="_blank" rel="noopener noreferrer" className="title" key={rx}>
                          <Card
                            hoverable
                            cover={<img alt={r.title} src={r.photo ? r.photo.original : defaultImage} />}
                          >
                            <small>
                              “{r.photoCaption}”<br />
                              {(r.photo && r.photoCredit) ? `(Photo by ${r.photoCredit})` : null}
                            </small>
                            <br />
                            <br />
                            <Title level={3}>{r.title}</Title>
                            <Paragraph><TrimText text={r.text} max={600} /></Paragraph>
                          </Card>
                        </a>
                      ))}
                    </Carousel>
                  )}
                </Skeleton>
              </Col>
              <Col span={11}>
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
                            description={<a href={item.absoluteUrl} target="_blank" rel="noopener noreferrer" className="title">{item.title}</a>}
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
