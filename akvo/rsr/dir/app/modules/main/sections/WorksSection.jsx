import React from 'react'
import SVGInline from 'react-svg-inline'
import {
  Row,
  Col,
  Icon,
  List,
  Card,
  Avatar,
  Collapse,
  Typography
} from 'antd'
import RsrButton from '../../components/RsrButton'

const { Title, Paragraph } = Typography

const WorksSection = ({
  works,
  features,
  images
}) => (
  <>
    <Row className="mb-5" id="how-it-works">
      <Col className="text-center mb-3">
        <Title>How it works</Title>
      </Col>
      <Col>
        <List
          grid={{ gutter: 16, lg: 4, xs: 2 }}
          dataSource={works}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="text-center">
                {(index < 3) && <Avatar icon="right" size={55} data-index={index} />}
                <Row gutter={[8, 24]}>
                  <Col>
                    <img src={images.hwork[item.image]} alt={item.title} style={{ width: 80 }} />
                  </Col>
                  <Col>
                    <Card.Meta
                      title={item.title}
                      description={item.description}
                    />
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Col>
    </Row>
    <Row type="flex" align="top" justify="center" className="mb-3">
      <Col span={13}>
        <Row>
          <Col>
            <h1
              className="text-3xl"
              style={{
                fontFamily: 'Roboto Condensed',
                fontWeight: 700
              }}
            >
              Monitor the impact<br />of your projects …
            </h1>
            <Paragraph className="text-lg">
              RSR reduces the reporting burdens of PMEL teams, making it easier for everyone working on a project to regularly report on the results they’ve achieved, assess progress, and steer projects to success.
            </Paragraph>
          </Col>
          <Col>
            <Row>
              <Col lg={6} md={8} sm={10}>
                <RsrButton.External block><b>Schedule Demo</b></RsrButton.External>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={9} offset={2}>
        <SVGInline
          svg={images.home.monitoring}
          width="300px"
          height="380px"
        />
      </Col>
    </Row>
    <Row gutter={[8, 24]} id="rsr-features">
      <Col lg={12}>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
          expandIconPosition="right"
        >
          {features.map((item) => (
            <Collapse.Panel header={item.title} key={item.id}>
              <Paragraph style={{ marginTop: 16 }}>
                {item.description}
              </Paragraph>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Col>
      <Col lg={11} offset={1}>
        <h1 className="text-3xl">Features</h1>
        <ul className="rsr-list-features">
          <li>Define indicators at programme and project level</li>
          <li>Work with qualitative and quantitative indicators</li>
          <li>Ensure data integrity by working with a single, core results framework</li>
          <li>Aggregate indicator results from projects and programmes</li>
          <li>Monitor and assess your projects using a simple web interface</li>
          <li>Filter by contributing projects, location, and report periods</li>
          <li>Create reports using our templates in Excel, Word or PDF</li>
          <li>Easily report to IATI without any coding Connect RSR with other tools</li>
        </ul>
      </Col>
    </Row>
  </>
)

export default WorksSection
