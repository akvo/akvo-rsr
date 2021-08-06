import React from 'react'
import { Row, Col, Card, List, Typography, Spin } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import defaultImage from '../../../images/default-image.png'

const { Title, Text } = Typography

export const Stories = ({ stories }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <Row type="flex" justify="center">
      <Col span={23} style={{ background: '#b8deed', padding: '30px' }}>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} className="text-primary">STORIES</Title>
          </Col>
        </Row>
        {stories && stories.length > 0
          ? (
            <List
              grid={{ gutter: 16, column: 4 }}
              pagination={{
                pageSize: 4,
              }}
              dataSource={stories}
              renderItem={story => {
                const { title, text: storyText, id: storyID, project: projectID, photos } = story
                let description = storyText.substr(0, 235)
                const trimLength = Math.min(description.length, description.lastIndexOf(' '))
                description = trimLength > 0 ? description.substr(0, trimLength) : description
                const srcImage = photos && photos.length > 0
                  ? photos[0].photo
                  : story.photo || defaultImage
                return (
                  <List.Item
                    key={storyID}
                  >
                    <Card
                      title={<a href={`/en/project/${projectID}/update/${storyID}/`} rel="noopener noreferrer" target="_blank">{title}</a>}
                      cover={<img alt="project preview" src={srcImage} />}
                      style={{ height: '485px' }}
                    >
                      <Text type="secondary">{mdOutput(parse(description))}</Text>
                    </Card>
                  </List.Item>
                )
              }}
            />
          )
          : (
            <div style={{ textAlign: 'center', padding: '5em' }}>
              {stories ? <Text type="secondary" style={{ fontStyle: 'italic' }}>No Updates yet</Text> : <Spin />}
            </div>
          )
        }
      </Col>
    </Row>
  )
}
