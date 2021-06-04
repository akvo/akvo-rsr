import React from 'react'
import { Row, Col, Card, Typography, Spin } from 'antd'

const { Title, Text } = Typography
const { Meta } = Card

export const Stories = ({ results, stories }) => {
  return (
    <Row type="flex" justify="center">
      <Col span={23} style={{ background: '#b8deed', padding: '30px' }}>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} className="text-primary">STORIES</Title>
          </Col>
        </Row>
        {results && results.length > 0
          ? (
            <Row gutter={16}>
              {results.map((result, index) => {
                const { title, text: resultText, id: resultID, project: projectID, photos } = result
                let description = resultText.substr(0, 100)
                const trimLength = Math.min(description.length, description.lastIndexOf(' '))
                description = trimLength > 0 ? description.substr(0, trimLength) : description
                const srcImage = photos && photos.length > 0 ? photos[0].photo : 'https://alppetro.co.id/dist/assets/images/default.jpg'
                return (
                  <Col span={8} key={index}>
                    <a href={`/en/project/${projectID}/update/${resultID}/`} rel="noopener noreferrer" target="_blank">
                      <Card
                        title={title}
                        cover={<img alt="project preview" src={srcImage} />}
                        className="wcaro-card"
                      >
                        <Meta {...{ description, style: { textAlign: 'justify' } }} />
                      </Card>
                    </a>
                  </Col>
                )
              })}
            </Row>
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
