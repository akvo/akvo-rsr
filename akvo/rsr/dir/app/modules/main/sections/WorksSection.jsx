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
import { scheduleDemoUrl } from '../../../utils/config'

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
          grid={{ gutter: 16, lg: 4, md: 2, sm: 1, xs: 1 }}
          dataSource={works}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="text-center">
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
                {(index < 3) && <Avatar icon="right" size={55} data-index={index} />}
              </Card>
            </List.Item>
          )}
        />
      </Col>
    </Row>
    <Row type="flex" align="top" justify="center" id="rsr-monitor-the-impact">
      <Col lg={13} md={16} sm={24} xs={24}>
        <Row>
          <Col span={24}>
            <Row type="flex" justify="space-between" align="top">
              <Col lg={20} md={20} sm={14} xs={14}>
                <h1 className="text-3xl">
                  Monitor the impact of your projects …
                </h1>
              </Col>
              <Col lg={4} md={4} sm={8} xs={8}>
                <SVGInline svg={images.home.rsr} className="image-sm" />
              </Col>
            </Row>
            <Paragraph className="text-lg">
              RSR reduces the reporting burdens of PMEL teams, making it easier for everyone working on a project to regularly report on the results they’ve achieved, assess progress, and steer projects to success.
            </Paragraph>
          </Col>
          <Col lg={6} md={10} sm={24} xs={24}>
            <RsrButton.External href={scheduleDemoUrl} blank block><b>Schedule Demo</b></RsrButton.External>
          </Col>
        </Row>
      </Col>
      <Col lg={{ span: 9, offset: 2 }} md={{ span: 6, offset: 1 }} sm={24} xs={24}>
        <SVGInline svg={images.home.rsr} width="100%" height="350px" className="image-lg" />
      </Col>
    </Row>
    <Row gutter={[8, 24]} id="rsr-features">
      <Col lg={12}>
        <h1 className="text-3xl">Features</h1>
        <ul className="rsr-list-features">
          <li>Define indicators at programme and project level</li>
          <li>Work with qualitative and quantitative indicators</li>
          <li>Ensure data integrity by working with a single, core results framework</li>
          <li>Aggregate indicator results from projects and programmes</li>
          <li>Monitor and assess your projects using a simple web interface</li>
          <li>Create reports using our templates in Excel, Word or PDF</li>
          <li>Easily report to IATI without any coding Connect RSR with other tools</li>
        </ul>
      </Col>
      <Col lg={11} offset={1}>
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
    </Row>
  </>
)

export default WorksSection
