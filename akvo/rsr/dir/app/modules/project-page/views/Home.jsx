import React, { useState } from 'react'
import {
  Typography,
  Skeleton,
  Collapse,
  Carousel,
  Progress,
  Button,
  Layout,
  Row,
  Col
} from 'antd'
import SimpleMarkdown from 'simple-markdown'

import Slide from '../components/Slide'
import HalfDonutChart from '../components/HalfDonutChart'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const Home = ({ project, highlights }) => {
  const [slide, setSlide] = useState(0)

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

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
                      <Title level={2} className="bold color-dark">
                        {project.title}
                      </Title>
                      <Title level={4} className="thin">
                        {project.subtitle}
                      </Title>
                      <Row type="flex" justify="start" align="middle" gutter={[8, 16]}>
                        <Col span={4}>
                          <Text className="upper" strong>
                            status
                          </Text>
                        </Col>
                        <Col span={20}>
                          <Text>{project.statusLabel}</Text>
                        </Col>
                        <Col span={4}>
                          <Text className="upper" strong>
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
                          <Text className="upper" strong>
                            start date :
                          </Text>
                          <br />
                          <Text className="color-dark">
                            {project.dateStartActual ||
                              project.dateStartPlanned}
                          </Text>
                        </Col>
                        <Col span={12} className="text-right">
                          <Text className="upper" strong>
                            end date :
                          </Text>
                          <br />
                          <Text className="color-dark">
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
                        <Title level={4} className="thin">
                          Project Summary
                        </Title>
                      </Col>
                      <Col>
                        <Text className="upper" strong>
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
                  {highlights && (
                    <>
                      <Title level={3}>HIGHLIGHTS</Title>
                      <Title level={4} className="thin">
                        {highlights[slide].title}
                      </Title>
                      <Paragraph ellipsis={{ rows: 4 }}>
                        {mdOutput(parse(highlights[slide].text || ''))}
                      </Paragraph>
                    </>
                  )}
                </Skeleton>
              </Col>
              <Col lg={10} sm={24} className="text-right">
                <Skeleton paragraph={{ rows: 5 }} loading={!highlights} active>
                  {highlights && (
                    <Carousel beforeChange={(key) => setSlide(key)}>
                      {highlights.map((item, index) => (
                        <div>
                          <Slide image={item.photo.original} index={index + 1} />
                        </div>
                      ))}
                    </Carousel>
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
            <Row>
              <Col span={12}>
                <Skeleton paragraph={{ rows: 5 }} loading={!project} active>
                  {project && (
                    <>
                      <Title level={3}>FINANCES</Title>
                      <br />
                      <Row type="flex" justify="space-between" align="middle" gutter={[8, 8]}>
                        <Col span={12}>
                          <Text className="upper" strong>
                            project budget :
                          </Text>
                          <Text className="color-dark">
                            {project.budget}
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text className="upper" strong>
                            period :
                          </Text>
                          <Text className="color-dark">
                            {project.dateStartPlanned} - {project.dateEndActual || project.dateEndPlanned}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Text className="upper" strong>
                            total funded :
                          </Text>
                          <Text className="color-dark">
                            {project.funds}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Text className="upper" strong>
                            funders :
                          </Text>
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
                <Title level={3}>PARTNERS</Title>
              </Col>
              <Col>
                <Row type="flex" justify="center" align="middle">
                  <Col span={4}>
                    <Button type="link">
                      Implementing Partners
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button type="link">
                      Financing Partner
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button type="link">
                      Reporting Organization
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button type="link">
                      Accountable Partner
                    </Button>
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
                <Title level={3}>PROJECT SUMMARY</Title>
              </Col>
              <Col>
                <Collapse
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => <Button type="primary" icon={isActive ? 'minus' : 'plus'} />}
                  accordion
                >
                  <Collapse.Panel header="Goals Overview">
                    <Paragraph>
                      {project && mdOutput(parse(project.goalsOverview))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header="Background">
                    <Paragraph>
                      {project && mdOutput(parse(project.background))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header="Situation at start of project">
                    <Paragraph>
                      {project && mdOutput(parse(project.currentStatus))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header="Target group">
                    <Paragraph>
                      {project && mdOutput(parse(project.targetGroup))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header="Project plan">
                    <Paragraph>
                      {project && mdOutput(parse(project.projectPlan))}
                    </Paragraph>
                  </Collapse.Panel>
                  <Collapse.Panel header="Sustainability">
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
