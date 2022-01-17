import React from 'react'
import {
  Typography,
  Divider,
  Layout,
  Card,
  List,
  Input,
  Icon,
  Row,
  Col,
} from 'antd'
import SVGInline from 'react-svg-inline'

import Image from '../components/Image'
import filterSvg from '../../../images/icFilter.svg'

const { Content } = Layout
const { Text, Title, Paragraph } = Typography

const Updates = () => {
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
      <Row className="project-row">
        <Col>
          <Content>
            <Title className="text-dark bold">Project Updates</Title>
            <Paragraph className="hero">
              Stay Updated on the latest developments relevant to HortImpact from funding, impact on the ground, actionable ideas, news trends and so much more.
            </Paragraph>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
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
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row>
              <Col className="mb-3">
                <Title level={2} className="text-dark bold">FIND UPDATES</Title>
                <span className="bottom-line" />
              </Col>
              <Col className="filter-search">
                <Input
                  prefix={<Icon type="search" />}
                  size="large"
                  addonAfter={<SVGInline svg={filterSvg} />}
                />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row gutter={[32, 16]}>
              <Col span={8}>
                <Image
                  width="100%"
                  height={256}
                  src="https://storage.googleapis.com/akvo-rsr-production-media-files/cache/f7/ad/f7ad50169c3b1ea78ab6d0f949751910.png"
                  className="mb-3"
                />
                <ul>
                  <li className="mb-1">
                    <Title level={4}>Farmer group Kibwezi obtains certification for export of dried tomatoes</Title>
                  </li>
                  <li className="mb-4">
                    <Paragraph ellipsis={{ rows: 4 }}>
                      Makueni County Fruit Processors SACCO has experience in mango production and marketing, both in the domestic and export markets since 2010. HortIMPACT through its Innovation Fund, trained members of the Cooperative on fruit tree management, IPM solu…Makueni County Fruit Processors SACCO has experience in mango production and marketing, both in the domestic and export markets since 2010. HortIMPACT through its Innovation Fund, trained members of the Cooperative on fruit tree management, IPM solu…
                    </Paragraph>
                  </li>
                  <li>
                    <Text strong>Elizabeth Kyengo</Text>
                  </li>
                  <li>
                    <Text>Netherlands Development Organisation</Text>
                  </li>
                  <li>
                    <Text>24-Dec-2017</Text>
                  </li>
                </ul>
              </Col>
              <Col span={8}>
                <Image
                  width="100%"
                  height={256}
                  src="https://storage.googleapis.com/akvo-rsr-production-media-files/cache/f7/ad/f7ad50169c3b1ea78ab6d0f949751910.png"
                />
              </Col>
              <Col span={8}>
                <Image
                  width="100%"
                  height={256}
                  src="https://storage.googleapis.com/akvo-rsr-production-media-files/cache/f7/ad/f7ad50169c3b1ea78ab6d0f949751910.png"
                />
              </Col>
              <Col span={24}>
                <Divider />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </>
  )
}

export default Updates
