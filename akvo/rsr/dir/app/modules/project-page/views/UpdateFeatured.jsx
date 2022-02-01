import React from 'react'
import {
  Typography,
  Card,
  List,
  Row,
  Col,
  Skeleton,
  Carousel
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
      <Row gutter={[32, 8]}>
        <Col span={13}>
          <Skeleton loading={!results} active>
            {results && (
              <Carousel effect="fade">
                {results.map((r, rx) => (
                  <Card
                    hoverable
                    cover={<img alt={r.title} src={r.photo ? r.photo.original : defaultImage} />}
                    key={rx}
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
                      description={<div className="title">{item.title}</div>}
                    />
                  </List.Item>
                )}
              />
            )}
          </Skeleton>
        </Col>
      </Row>
    </>
  )
}

export default UpdateFeatured
