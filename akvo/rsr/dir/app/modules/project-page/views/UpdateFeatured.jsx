import React from 'react'
import {
  Typography,
  Card,
  List,
  Row,
  Col
} from 'antd'

const { Title, Paragraph } = Typography

const UpdateFeatured = () => {
  const data = [
    {
      title: 'Hortimpact’s Support for Meru Greens Cold Chain leads to PPP With Nandi County.',
    },
    {
      title: 'Kwakyai SACCO improves its tomato production operations for The Ketchup Project',
    },
    {
      title: 'HortIMPACT’s Feasibility Study on Ware Potato Storage Shows a Business Case',
    },
    {
      title: 'Kwakyai SACCO improves its tomato production operations for The Ketchup Project',
    },
  ]
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
          <Card
            hoverable
            cover={<img alt="example" src="https://storage.googleapis.com/akvo-rsr-production-media-files/cache/a6/f9/a6f933479ed2b14acaedc5640af96f7d.png" />}
          >
            <small>“Workshop attendees had the opportunity to break off into discussion groups.” (Photo by Renan Alejandro Salvador Lozano Cuervo)</small>
            <br />
            <br />
            <Title level={3}>HortIMPACT’s Feasibility Study on Ware Potato Storage Shows a Business Case</Title>
            <Paragraph ellipsis={{ rows: 4 }}>Along with HortIMPACT, The Kenyan Horticulture Council (KHC) organized an inception workshop for a planned food safety study in the City Park Market in Nairobi County. The survey, supported by HortIMPACT, will help pinpoint focus areas for present a…</Paragraph>
          </Card>
        </Col>
        <Col span={11}>
          <List
            className="project-updates"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<div className="date">17-Jul-2018</div>}
                  description={<div className="title">{item.title}</div>}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  )
}

export default UpdateFeatured
