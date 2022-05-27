import React from 'react'
import { Row, Col, Card, List, Typography, Spin } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import defaultImage from '../../../images/default-image.png'

const { Title, Text } = Typography

export const Stories = ({ results, stories }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  return (
    <Row type="flex" justify="center">
      <Col span={23} style={{ background: '#b8deed', padding: '30px' }}>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} className="text-primary">STORIES</Title>
          </Col>
        </Row>
        {stories && stories.count > 0
          ? (
            <List
              grid={{ gutter: 16, column: 4 }}
              pagination={{
                pageSize: 4,
              }}
              dataSource={results}
              renderItem={result => {
                const { title, text: resultText, id: resultID, project: projectID, photos } = result
                let description = resultText.substr(0, 235)
                const trimLength = Math.min(description.length, description.lastIndexOf(' '))
                description = trimLength > 0 ? description.substr(0, trimLength) : description
                const srcImage = photos && photos.length > 0
                  ? photos[0].photo
                  : result.photo || defaultImage
                return (
                  <List.Item
                    key={resultID}
                  >
                    <Card
                      title={<a href={`/en/project/${projectID}/update/${resultID}/`} rel="noopener noreferrer" target="_blank">{title}</a>}
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
