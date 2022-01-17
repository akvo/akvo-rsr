import React, { useState } from 'react'
import {
  Typography,
  Skeleton,
  Collapse,
  Carousel,
  Progress,
  Button,
  Layout,
  Menu,
  Row,
  Col,
  Empty
} from 'antd'
import SimpleMarkdown from 'simple-markdown'

import defaultImage from '../../../images/default-image.png'
import Slide from '../components/Slide'
import HalfDonutChart from '../components/HalfDonutChart'
import { shortenText } from '../../../utils/string'
import { setNumberFormat } from '../../../utils/misc'
import { queryStories } from '../queries'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const Home = ({ project, projectId }) => {
  const [slide, setSlide] = useState(0)

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const { data: dataHighlight } = queryStories(projectId, 1)
  const { results: highlights } = dataHighlight || {}

  const data = [
    { label: 'T1P', value: '13.13' },
    { label: 'T2P', value: '59.70' },
    { label: 'T3P', value: '23.88' },
    { label: 'BP', value: '17.91' }
  ]

  const legends = []
  // eslint-disable-next-line no-plusplus
  for (let ix = 0; ix < 8; ix++) {
    legends.push(ix)
  }

  return (
    <>
      <Row className="project-row">
        <Col>
          <Content>
            <Row type="flex" justify="space-around" align="bottom" gutter={[32, 24]}>
              <Col span={12}>
                <Skeleton paragraph={{ rows: 7 }} loading={!project} active>
                  {project && (
                    <>
                      <Title className="bold text-dark">
                        {project.title}
                      </Title>
                      <Title level={3} className="thin">
                        {project.subtitle}
                      </Title>
                      <Row type="flex" justify="start" align="middle" gutter={[8, 16]}>
                        <Col span={4}>
                          <Text className="upper text-bold" strong>
                            status
                          </Text>
                        </Col>
                        <Col span={20}>
                          <Text>{project.statusLabel}</Text>
                        </Col>
                        <Col span={4}>
                          <Text className="upper text-bold" strong>
                            iati id
                          </Text>
                        </Col>
                        <Col span={20}>
                          <Text>{project.iatiActivityId || '-'}</Text>
                        </Col>
                        <Col span={24}>
                          <Progress percent={90} showInfo={false} />
                        </Col>
                      </Row>
                      <Row
                        type="flex"
                        justify="space-between"
                        align="middle"
                        gutter={[8, 32]}
                      >
                        <Col span={12}>
                          <Text className="upper text-bold" strong>
                            start date :
                          </Text>
                          <br />
                          <Text className="text-dark">
                            {project.dateStartActual ||
                              project.dateStartPlanned}
                          </Text>
                        </Col>
                        <Col span={12} className="text-right">
                          <Text className="upper text-bold" strong>
                            end date :
                          </Text>
                          <br />
                          <Text className="text-dark">
                            {project.dateEndActual || project.dateEndPlanned}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Button type="link" size="large" className="btn-external">
                            Download Full Report
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Skeleton>
              </Col>
              <Col span={12}>
                <Skeleton paragraph={{ rows: 5 }} loading={!project} active>
                  {project && (
                    <Row gutter={[16, 8]}>
                      <Col>
                        <Title level={3} className="thin">
                          Project Summary
                        </Title>
                      </Col>
                      <Col>
                        <Text className="upper text-bold" strong>
                          SECTORS :
                        </Text>
                        <br />
                        <Text>{project.categories.join(', ')}</Text>
                      </Col>
                      <Col className="text-justify">
                        <Paragraph ellipsis={{ rows: 12 }}>{project.projectPlanSummary}</Paragraph>
                      </Col>
                      <Col>
                        <Button type="link" icon="arrow-right">
                          Find Out More
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Skeleton>
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row type="flex" justify="space-between" align="top" gutter={[32, 24]}>
              <Col lg={14} sm={24}>
                <Skeleton paragraph={{ rows: 5 }} loading={!highlights} active>
                  {(highlights && highlights[slide]) &&
                    (
                      <>
                        <Row className="mb-1">
                          <Col>
                            <Title level={2}>HIGHLIGHTS</Title>
                            <span className="bottom-line" />
                          </Col>
                        </Row>
                        <Title level={4} className="thin panel-header">
                          {highlights[slide] ? highlights[slide].title : '-'}
                        </Title>
                        <div className="mb-3">
                          <Paragraph>
                            {mdOutput(parse(shortenText(highlights[slide] ? highlights[slide].text : '', 650)))}
                          </Paragraph>
                        </div>
                        {highlights[slide] && (
                          <a href={highlights[slide].absoluteUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <Text className="text-bold text-primary">
                              Read More
                            </Text>
                          </a>
                        )}
                      </>
                    )}
                </Skeleton>
              </Col>
              <Col lg={10} sm={24} className="text-right">
                <Skeleton paragraph={{ rows: 5 }} loading={!highlights} active>
                  {(highlights && highlights.length > 0) && (
                    <Carousel beforeChange={(key) => setSlide(key)}>
                      {highlights.map((item, index) => (
                        <div key={index}>
                          <Slide image={item.photo ? item.photo.original : defaultImage} index={index + 1} />
                        </div>
                      ))}
                    </Carousel>
                  )}
                </Skeleton>
              </Col>
            </Row>
            {highlights && highlights[slide] === undefined && (
              <>
                <Row className="mb-1">
                  <Col>
                    <Title level={2}>HIGHLIGHTS</Title>
                    <span className="bottom-line" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Empty />
                  </Col>
                </Row>
              </>
            )}
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row>
              <Col span={12}>
                <Skeleton paragraph={{ rows: 5 }} loading={!project} active>
                  {project && (
                    <>
                      <Row className="mb-2">
                        <Col>
                          <Title level={2}>FINANCES</Title>
                          <span className="bottom-line" />
                        </Col>
                      </Row>
                      <Row type="flex" justify="space-between" align="middle" gutter={[8, 24]}>
                        <Col span={12}>
                          <Text className="upper text-bold" strong>project budget :</Text>&nbsp;
                          <Text className="text-dark">{setNumberFormat(project.budget)}</Text>
                        </Col>
                        <Col span={12}>
                          <Text className="upper text-bold" strong>period :</Text>&nbsp;
                          <Text className="text-dark">
                            {project.dateStartPlanned} - {project.dateEndActual || project.dateEndPlanned}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Text className="upper text-bold" strong>total funded :</Text>&nbsp;
                          <Text className="text-dark">{setNumberFormat(project.funds)}</Text>
                        </Col>
                        <Col span={24}>
                          <Text className="upper text-bold" strong>funders :</Text>&nbsp;
                        </Col>
                        <Col span={24}>
                          <ul className="list-3-cols">
                            {Object.values(legends).map((l, lx) => <li key={lx}>{`${l} - Lorem ipsum dolor sit amet consectetur`}</li>)}
                          </ul>
                        </Col>
                      </Row>
                    </>
                  )}
                </Skeleton>
              </Col>
              <Col span={12}>
                <HalfDonutChart idChart="finance-chart" data={data} />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row>
              <Col className="text-center">
                <Title level={2}>PARTNERS</Title>
                <span className="bottom-line center" />
              </Col>
            </Row>
            <Row gutter={[8, 32]}>
              <Col>
                <Row type="flex" justify="center" align="middle">
                  <Col>
                    <Menu onClick={({ key }) => console.log('key', key)} mode="horizontal">
                      <Menu.Item key="implementing">
                        Implementing Partners
                      </Menu.Item>
                      <Menu.Item key="finance">
                        Financing Partner
                      </Menu.Item>
                      <Menu.Item key="report">
                        Reporting Organization
                      </Menu.Item>
                      <Menu.Item key="accountable">
                        Accountable Partner
                      </Menu.Item>
                    </Menu>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row type="flex" justify="center" align="middle" className="partners">
                  <Col span={4} className="text-center">
                    <img src="https://storage.googleapis.com/akvo-rsr-test-media-files/db/org/2554/Organisation_2554_logo_2014-12-16_07.55.08.png" alt="partner logo" className="img-gray" />
                  </Col>
                  <Col span={4} className="text-center">
                    <img src="https://storage.googleapis.com/akvo-rsr-test-media-files/db/org/268/Organisation_268_logo_2010-11-14_14.13.54.png" alt="partner logo" className="img-gray" />
                  </Col>
                  <Col span={4} className="text-center">
                    <img src="https://storage.googleapis.com/akvo-rsr-test-media-files/db/org/2554/Organisation_2554_logo_2014-12-16_07.55.08.png" alt="partner logo" className="img-gray" />
                  </Col>
                  <Col span={4} className="text-center">
                    <img src="https://storage.googleapis.com/akvo-rsr-test-media-files/db/org/268/Organisation_268_logo_2010-11-14_14.13.54.png" alt="partner logo" className="img-gray" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row>
              <Col className="text-center">
                <Title level={2}>PROJECT SUMMARY</Title>
                <span className="bottom-line center" />
              </Col>
              <Col>
                <Collapse
                  bordered={false}
                  className="project-summary"
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => <Button type="primary" icon={isActive ? 'minus' : 'plus'} />}
                  accordion
                >
                  <Collapse.Panel header={<Title level={3} className="panel-header">Goals Overview</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.goalsOverview))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header={<Title level={3} className="panel-header">Background</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.background))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header={<Title level={3} className="panel-header">Situation at start of project</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.currentStatus))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header={<Title level={3} className="panel-header">Target group</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.targetGroup))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header={<Title level={3} className="panel-header">Project plan</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.projectPlan))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header={<Title level={3} className="panel-header">Sustainability</Title>}>
                    <Paragraph>
                      {project && mdOutput(parse(project.sustainability))}
                    </Paragraph>
                  </Collapse.Panel>
                </Collapse>
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </>
  )
}

export default Home
