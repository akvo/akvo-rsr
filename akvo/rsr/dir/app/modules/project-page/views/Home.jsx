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
import { groupBy, sumBy } from 'lodash'
import classNames from 'classnames'

import defaultImage from '../../../images/default-image.png'
import Slide from '../components/Slide'
import HalfDonutChart from '../components/HalfDonutChart'
import { convertToSlug, shortenText } from '../../../utils/string'
import { createPaginate, setNumberFormat } from '../../../utils/misc'
import { queryPartnershipFunds, queryPartnershipLinks, queryStories } from '../queries'


const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const FundPartner = ({ funds, index }) => {
  const elements = createPaginate(funds, index, 3)
  return (
    <ul className="partners-funds" key={index}>
      {elements.map((el) => (
        <li key={el.id}>
          <div className="square" />
          <Text>{el.organisationName}</Text>
        </li>
      ))}
    </ul>
  )
}

const Home = ({ project, projectId }) => {
  const [slide, setSlide] = useState(0)
  const [pKey, setPKey] = useState(0)

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const { data: dataHighlight } = queryStories(projectId, 1)
  const { results: highlights } = dataHighlight || {}
  const { data: dataPartners } = queryPartnershipLinks(projectId)
  const { results: partners } = dataPartners || {}
  const { data: dataFunds } = queryPartnershipFunds(projectId)
  const { results: funds } = dataFunds || {}

  const gpartners = partners ? groupBy(partners, 'iatiOrganisationRoleLabel') : []
  const totalFunds = funds ? sumBy(funds, 'fundingAmount') : 0
  const data = funds
    ? funds
      .filter((fd) => (fd.fundingAmount))
      .map((fd) => ({
        ...fd,
        label: fd.organisationName,
        value: totalFunds > 0 ? ((fd.fundingAmount / totalFunds) * 100).toFixed(2) : 0
      }))
    : []
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
            <Skeleton paragraph={{ rows: 5 }} loading={!highlights} active>
              {highlights && (
                <Carousel effect="fade">
                  {highlights.map((h, hx) => (
                    <Row type="flex" justify="space-between" align="top" gutter={[32, 24]} key={hx}>
                      <Col lg={14} sm={24}>
                        <Row className="mb-1">
                          <Col>
                            <Title level={2}>HIGHLIGHTS</Title>
                            <span className="bottom-line" />
                          </Col>
                        </Row>
                        <Title level={4} className="thin panel-header">{h.title}</Title>
                        <div className="mb-3">
                          <Paragraph>{mdOutput(parse(shortenText(h.text, 650)))}</Paragraph>
                        </div>
                        <a href={h.absoluteUrl} target="_blank" rel="noopener noreferrer">
                          <Text className="text-bold text-primary">
                            Read More
                          </Text>
                        </a>
                      </Col>
                      <Col lg={10} sm={24} className="text-right">
                        <Slide image={h.photo ? h.photo.original : defaultImage} index={hx + 1} />
                      </Col>
                    </Row>
                  ))}
                </Carousel>
              )}
            </Skeleton>
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
                        {funds && (
                          <Col span={24}>
                            <Row>
                              {funds.map((fd, fx) => (
                                <Col span={12} key={fx}>
                                  <FundPartner {...{ funds, index: fx + 1 }} />
                                </Col>
                              ))}
                            </Row>
                          </Col>
                        )}
                      </Row>
                    </>
                  )}
                </Skeleton>
              </Col>
              <Col span={12}>
                <Skeleton paragraph={{ rows: 5 }} loading={!funds} active>
                  {data.length > 0 && <HalfDonutChart idChart="finance-chart" data={data} />}
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
              <Col className="text-center">
                <Title level={2}>PARTNERS</Title>
                <span className="bottom-line center" />
              </Col>
            </Row>
            <Skeleton loading={(!partners)} active>
              {partners && (
                <Row gutter={[8, 32]}>
                  <Col>
                    <Row type="flex" justify="center" align="middle">
                      <Col>
                        <Menu onClick={({ key }) => setPKey(key)} mode="horizontal" selectedKeys={[pKey]}>
                          {Object.keys(gpartners).map((name) => <Menu.Item key={convertToSlug(name)}>{name || ''}</Menu.Item>)}
                        </Menu>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row type="flex" justify="center" align="middle" className="partners" gutter={[32, 8]}>
                      {partners.map((partner) => (
                        <Col span={4} className="text-center" key={partner.id}>
                          <img
                            src={partner.organisation.logo}
                            alt={partner.organisation.longName}
                            className={classNames({
                              'img-gray': (convertToSlug(partner.iatiOrganisationRoleLabel) !== pKey)
                            })}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              )}
            </Skeleton>
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
