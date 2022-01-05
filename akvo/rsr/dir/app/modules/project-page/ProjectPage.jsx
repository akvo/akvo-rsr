import React from 'react'
import {
  Row,
  Col,
  Layout,
  PageHeader,
  Typography,
  Button,
  Skeleton,
  Progress,
  Carousel,
  Collapse,
} from 'antd'

import './ProjectPage.scss'
import akvoLogo from '../../images/akvo.png'
import { queryProject } from './queries'
import HalfDonutChart from './components/HalfDonutChart'

const { Header, Footer, Content } = Layout
const { Title, Text, Paragraph } = Typography

const ProjectPage = ({ match: { params } }) => {
  const { data: project } = queryProject(params.projectId)
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
    <Layout className="project-layout">
      <Header>
        <Row type="flex" justify="space-between">
          <Col span={4}>
            <Button type="link" href="/">
              Akvo
            </Button>
          </Col>
          <Col span={4}>
            <Button type="link">Register</Button>
            <Button type="link">Sign in</Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <Skeleton loading={!project}>
          {project && (
            <PageHeader>
              <Row gutter={[32, 32]}>
                <Col span={12}>
                  <Title level={2} className="bold color-dark">
                    {project.title}
                  </Title>
                  <Title level={4} className="thin">
                    {project.subtitle}
                  </Title>
                  <Row type="flex" justify="start" align="middle" gutter={[8, 8]}>
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
                    gutter={[8, 8]}
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
                  </Row>
                  <Button type="link" size="large" className="btn-external">
                    Download Full Report
                  </Button>
                </Col>
                <Col span={12}>
                  <Title level={4} className="thin">
                    Project Summary
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Text className="upper" strong>
                        SECTORS :
                      </Text>
                      <br />
                      <Text>{project.categories.join(', ')}</Text>
                    </Col>
                    <Col>
                      <Paragraph>{project.projectPlanSummary}</Paragraph>
                    </Col>
                  </Row>
                  <Button type="link" icon="arrow-right">
                    Find Out More
                  </Button>
                </Col>
              </Row>
            </PageHeader>
          )}
          <Row>
            <Col lg={12} sm={24}>
              <Title level={3}>HIGHLIGHTS</Title>
              <Title level={4} className="thin">
                Inception Workshop for Food Safety Study in Nairobi County
              </Title>
              <Paragraph ellipsis={{ rows: 4 }}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint
                laborum itaque, id rem ipsa repellat dolorum obcaecati, ex quaerat
                possimus nesciunt magni minus consequuntur dignissimos. Ullam
                aperiam velit saepe eligendi. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Iure beatae vitae voluptas reprehenderit. Maxime
                doloremque iusto, dolores, illum tempore atque odit, sapiente
                expedita recusandae in fuga? Rem culpa reiciendis eum.
              </Paragraph>
            </Col>
            <Col lg={12} sm={24}>
              <Carousel className="highlight">
                <div className="highlight-item">
                  <img
                    src="https://storage.googleapis.com/akvo-rsr-test-media-files/cache/2a/8d/2a8d942005cb77e4abc267758a9d26aa.png"
                    alt="highlight 1"
                  />
                  <span className="number">
                    <h3>1</h3>
                  </span>
                </div>
                <div className="highlight-item">
                  <img
                    src="https://storage.googleapis.com/akvo-rsr-test-media-files/cache/c6/ac/c6ac77ceb59096e117795a11101d39c6.png"
                    alt="highlight 2"
                  />
                  <span className="number">
                    <h3>2</h3>
                  </span>
                </div>
              </Carousel>
            </Col>
          </Row>
          {project && (
            <PageHeader>
              <Row gutter={[32, 32]}>
                <Col span={12}>
                  <Title level={3}>FINANCES</Title>
                  <Row type="flex" justify="start" align="middle">
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
                  </Row>
                  <Row>
                    <Col>
                      <Text className="upper" strong>
                        funders :
                      </Text>
                    </Col>
                    <Col>
                      <ul className="list-3-cols">
                        {Object.values(legends).map((l, lx) => <li key={lx}>{`${l} - Lorem ipsum dolor sit amet consectetur`}</li>)}
                      </ul>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <HalfDonutChart idChart="finance-chart" data={data} />
                </Col>
              </Row>
            </PageHeader>
          )}
        </Skeleton>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vitae voluptatibus dolores suscipit cumque ducimus consectetur cupiditate quod, quidem pariatur reprehenderit ipsam excepturi distinctio optio iste facere tenetur saepe atque!
              </Collapse.Panel>
              <Collapse.Panel header="Background">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem asperiores officia harum sit voluptatibus vero accusantium id quo ullam laborum ratione corrupti laudantium eligendi, earum eius veritatis fuga soluta fugiat?
              </Collapse.Panel>
              <Collapse.Panel header="Situation at start of project">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit fugit, ex unde dolore modi dolor alias error totam praesentium ad? Minus officia, sapiente temporibus voluptates quod ea quos dolorum neque!
              </Collapse.Panel>
              <Collapse.Panel header="Target group">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit fugit, ex unde dolore modi dolor alias error totam praesentium ad? Minus officia, sapiente temporibus voluptates quod ea quos dolorum neque!
              </Collapse.Panel>
              <Collapse.Panel header="Project plan">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit fugit, ex unde dolore modi dolor alias error totam praesentium ad? Minus officia, sapiente temporibus voluptates quod ea quos dolorum neque!
              </Collapse.Panel>
              <Collapse.Panel header="Sustainability">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit fugit, ex unde dolore modi dolor alias error totam praesentium ad? Minus officia, sapiente temporibus voluptates quod ea quos dolorum neque!
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Content>
      <Footer className="footer">
        <Row gutter={[32, 32]}>
          <Col span={6}>
            <Title level={4}>RELATED DOCUMENTS</Title>
          </Col>
          <Col span={6}>
            <Title level={4}>RELATED LINKS</Title>
          </Col>
          <Col span={6}>
            <Title level={4}>WIDGETS</Title>
          </Col>
          <Col span={6}>
            <Title level={4}>EXPORT DATA</Title>
          </Col>
          <Col span={6}>
            <ul>
              <li>
                <Button type="link">
                  Conservation Agriculture Fact Sheet
                </Button>
              </li>
            </ul>
          </Col>
          <Col span={6}>
            <ul>
              <li>
                <Button type="link">
                  Website - SNV Kenya
                </Button>
              </li>
            </ul>
          </Col>
          <Col span={6}>
            <ul>
              <li>
                <Button type="link">
                  Grab a widget
                </Button>
              </li>
            </ul>
          </Col>
          <Col span={6}>
            <ul>
              <li>
                <Button type="link">
                  RSS
                </Button>
              </li>
              <li>
                <Button type="link">
                  JSON
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
      </Footer>
      <Footer>
        <Row type="flex" justify="start">
          <Col lg={2} sm={4}>
            <Text className="color-dark font-futura">Powered by</Text>
          </Col>
          <Col lg={1} sm={2}>
            <a href="//akvo.org"><img src={akvoLogo} className="img-w-full" alt="Akvo Logo" /></a>
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default ProjectPage
