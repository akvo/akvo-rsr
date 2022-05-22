import React, { useState } from 'react'
import {
  Typography,
  Skeleton,
  Collapse,
  Carousel,
  Progress,
  Button,
  Menu,
  Row,
  Col,
  Empty,
  Tooltip,
  Divider,
  Tabs
} from 'antd'
import SimpleMarkdown from 'simple-markdown'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import moment from 'moment'

import { prefixUrl } from '../../../utils/config'
import defaultImage from '../../../images/default-image.png'
import Slide from '../components/Slide'
import { convertToSlug, shortenText } from '../../../utils/string'
import { colorShade, setNumberFormat } from '../../../utils/misc'
import {
  queryBudget,
  queryPartnershipFunds,
  queryPartnershipLinks,
  queryProjectSectors,
  queryStories
} from '../queries'
import SemiDonut from '../components/SemiDonut'
import Section from '../../components/Section'
import RsrButton from '../../components/RsrButton'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs

const Home = ({ project, projectId, handleOnMenu }) => {
  const [pKey, setPKey] = useState(0)

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput

  const { data: dataHighlight } = queryStories(projectId, 1)
  const { results: highlights } = dataHighlight || {}
  const { data: dataPartners } = queryPartnershipLinks(projectId)
  const { results: partners } = dataPartners || {}
  const { data: dataFunds } = queryPartnershipFunds(projectId)
  const { results: funds } = dataFunds || {}
  const { data: dataSectors } = queryProjectSectors(projectId)
  const { results: sectors } = dataSectors || {}
  const { data: dataBudget } = queryBudget(projectId)
  const { results: budget } = dataBudget || {}


  const gpartners = partners ? groupBy(partners, 'iatiOrganisationRoleLabel') : []
  const currency = budget ? budget[0] ? budget[0].currencyLabel.split(/\s+/)[0] : '' : ''
  const colorStep = funds ? Math.round(100 / funds.length) : 0
  let data = funds
    ? funds
      .filter((fd) => (fd.fundingAmount))
      .map((fd, fx) => {
        const percent = (project && project.funds) ? fd.fundingAmount / project.funds * 100 : 0
        let degree = fx === 0 ? 180 : parseInt(180 * percent / 100, 10).toFixed(0)
        degree = degree === '0' ? 1 : degree
        return {
          ...fd,
          degree,
          label: fd.organisationName,
          value: percent
        }
      })
    : []
  data = orderBy(data, ['value'], ['desc']).map((fd, fx) => ({
    ...fd,
    color: colorShade('#FCAB26', fx * colorStep)
  }))
  const fundPartners = chunk(data || [], 3)
  const startDate = (project && project.dateStartActual) ? moment(project.dateStartActual, 'YYYY-MM-DD') : null
  const finishDate = (project && project.dateEndPlanned) ? moment(project.dateEndPlanned, 'YYYY-MM-DD') : null
  const progress = (startDate && finishDate) ? moment().diff(startDate) / finishDate.diff(startDate) * 100 : 0
  return (
    <>
      <Section id="rsr-project-overview">
        <Row type="flex" justify="space-around" align="bottom" gutter={[32, 24]}>
          <Col lg={12} md={24} xs={24} className="left-overview">
            <Skeleton paragraph={{ rows: 7 }} loading={!project} active>
              {project && (
                <>
                  <Title className="bold text-dark">{project.title}</Title>
                  <Title level={3} className="thin">
                    {project.subtitle}
                  </Title>
                  <Row type="flex" justify="start" align="middle" gutter={[8, 16]}>
                    <Col span={4}>
                      <Text className="upper text-bold" strong>status</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{project.statusLabel}</Text>
                    </Col>
                    <Col span={4}>
                      <Text className="upper text-bold" strong>iati id</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{project.iatiActivityId || '-'}</Text>
                    </Col>
                    <Col span={24}>
                      <Tooltip title={`${progress > 100 ? 100 : progress.toFixed(2)} %`}>
                        <Progress percent={progress} showInfo={false} />
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    gutter={[8, 32]}
                  >
                    <Col span={12}>
                      <Text className="upper text-bold" strong>start date :</Text>
                      <br />
                      <Text className="text-dark">
                        {moment(project.dateStartActual || project.dateStartPlanned, 'YYYY-MM-DD').format('DD MMM YYYY')}
                      </Text>
                    </Col>
                    <Col span={12} className="text-right">
                      <Text className="upper text-bold" strong>end date :</Text>
                      <br />
                      <Text className="text-dark">
                        {moment(project.dateEndActual || project.dateEndPlanned, 'YYYY-MM-DD').format('DD MMM YYYY')}
                      </Text>
                    </Col>
                    <Col lg={8} md={10} sm={24} xs={24}>
                      <RsrButton.External href={`/py-reports/project/${project.id}/overview-report/`} block>
                        Download Full Report
                      </RsrButton.External>
                    </Col>
                  </Row>
                </>
              )}
            </Skeleton>
          </Col>
          <Col lg={12} md={24} xs={24} className="right-overview">
            <Skeleton paragraph={{ rows: 5 }} loading={!project} active>
              {project && (
                <Row gutter={[16, 8]}>
                  <Col>
                    <Title level={3} className="thin">Project Summary</Title>
                  </Col>
                  <Col>
                    <Text className="upper text-bold" strong>SECTORS :</Text>
                    <br />
                    <Text className="text-dark">{sectors ? sectors.map((sc) => sc.codeLabel.split('-')[1]).join(',') : null}</Text>
                  </Col>
                  <Col className="text-justify">
                    <Paragraph ellipsis={{ rows: 12 }}>{mdOutput(parse(shortenText(project.projectPlanSummary, 800)))}</Paragraph>
                  </Col>
                  <Col>
                    <Button type="link" icon="arrow-right" onClick={() => handleOnMenu('updates')}>
                      Find Out More
                    </Button>
                  </Col>
                </Row>
              )}
            </Skeleton>
          </Col>
        </Row>
      </Section>
      <Section id="rsr-project-highlight">
        <Skeleton paragraph={{ rows: 5 }} loading={!highlights} active>
          {highlights && (
            <>
              {
                highlights.length
                  ? (
                    <Carousel effect="fade">
                      {highlights.map((h, hx) => (
                        <Row type="flex" justify="space-between" align="top" gutter={[{ lg: 32, md: 32, sm: 8, xs: 8 }, 24]} key={hx}>
                          <Col lg={14} sm={24}>
                            <Row>
                              <Col className="mb-3">
                                <Title level={2}>HIGHLIGHTS</Title>
                                <span className="bottom-line" />
                              </Col>
                            </Row>
                            <Title level={4} className="thin panel-header">{h.title}</Title>
                            <div className="mb-3 text-justify">
                              <Paragraph>{mdOutput(parse(shortenText(h.text, 650)))}</Paragraph>
                            </div>
                            <a href={`/dir/project/${projectId}/update?id=${h.id}`}>
                              <Text className="text-bold text-primary">
                                Read More
                              </Text>
                            </a>
                          </Col>
                          <Col lg={10} sm={24} className="text-right">
                            <Slide image={h.photo ? `${prefixUrl}${h.photo.original}` : defaultImage} index={hx + 1} />
                          </Col>
                        </Row>
                      ))}
                    </Carousel>
                  )
                  : (
                    <Row gutter={[32, 24]}>
                      <Col>
                        <Row>
                          <Col className="mb-1">
                            <Title level={2}>HIGHLIGHTS</Title>
                            <span className="bottom-line" />
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Empty />
                      </Col>
                    </Row>
                  )
              }
            </>
          )}
        </Skeleton>
      </Section>
      <Section>
        <Row>
          <Col lg={12} md={24} xs={24}>
            <Skeleton paragraph={{ rows: 5 }} loading={!project} active>
              {project && (
                <>
                  <Row>
                    <Col className="mb-3">
                      <Title level={2}>FINANCES</Title>
                      <span className="bottom-line" />
                    </Col>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle" gutter={[8, 16]}>
                    <Col span={12}>
                      <Text className="upper text-bold" strong>project budget :</Text>&nbsp;
                      <Text className="text-dark" strong>{`${setNumberFormat(project.budget)} ${currency}`}</Text>
                    </Col>
                    <Col span={12}>
                      <Text className="upper text-bold" strong>period :</Text>&nbsp;
                      <Text className="text-dark">
                        {moment(project.dateStartPlanned, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(project.dateEndActual || project.dateEndPlanned, 'YYYY-MM-DD').format('DD MMM YYYY')}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <Text className="upper text-bold" strong>total funded :</Text>&nbsp;
                      <Text className="text-dark" strong>{`${setNumberFormat(project.funds)} ${currency}`}</Text>
                    </Col>
                    <Col span={24} className="project-funds-lg">
                      {(funds && project.funds > 0) && (
                        <>
                          <Text className="upper text-bold" strong>funders :</Text>
                          {Object.keys(fundPartners).map(value => (
                            <ul className="partners-funds" key={value}>
                              {fundPartners[value].map((el) => (
                                <li key={el.id}>
                                  <div
                                    className="square"
                                    style={{
                                      background: `${el.color} 0% 0% no-repeat padding-box`
                                    }}
                                  />
                                  <Text>{el.organisationName} ({el.value.toFixed(2)} %)</Text>
                                </li>
                              ))}
                            </ul>
                          ))}
                        </>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </Skeleton>
          </Col>
          <Col lg={12} md={24} xs={24} className="project-funds-chart">
            <Row>
              <Col md={12} className="project-funds-md">
                {(funds && project && project.funds > 0) && (
                  <>
                    <Text className="upper text-bold" strong>funders :</Text>
                    {Object.keys(fundPartners).map(value => (
                      <ul className="partners-funds" key={value}>
                        {fundPartners[value].map((el) => (
                          <li key={el.id}>
                            <div
                              className="square"
                              style={{
                                background: `${el.color} 0% 0% no-repeat padding-box`
                              }}
                            />
                            <Text>{el.organisationName} ({el.value.toFixed(2)} %)</Text>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </>
                )}
              </Col>
              <Col lg={22} md={12} className="text-right">
                <Skeleton
                  paragraph={{ rows: 5 }}
                  loading={!funds}
                  active
                >
                  {
                    data.length > 0 && (
                      <SemiDonut
                        data={data}
                        innerRadius={80}
                        outerRadius={175}
                        height={200}
                        width={350}
                        currency={currency}
                      />)
                  }
                </Skeleton>
              </Col>
            </Row>
          </Col>
        </Row>
        {(project && project.iatiProfileUrl) && <Divider />}
        {(project && project.iatiProfileUrl) && (
          <Row>
            <Col lg={4} md={10} sm={24} xs={24}>
              <RsrButton.External href={project.iatiProfileUrl} blank block>
                View IATI Profile
              </RsrButton.External>
            </Col>
          </Row>
        )}
      </Section>
      <Section id="rsr-project-partners">
        <Row className="mb-3">
          <Col className="text-center">
            <Title level={2}>PARTNERS</Title>
            <span className="bottom-line center" />
          </Col>
        </Row>
        <Skeleton loading={(!partners)} active>
          {partners && (
            <Row gutter={[8, 32]}>
              <Col className="partners-tabs">
                <Row type="flex" justify="center" align="middle">
                  <Col lg={14} md={24} sm={24} xs={24} className="text-center">
                    <Tabs onChange={setPKey} mode="horizontal" activeKey={pKey}>
                      {Object.keys(gpartners).map((name) => <TabPane key={convertToSlug(name)} tab={name} />)}
                    </Tabs>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row type="flex" justify="center" align="middle" className="partners" gutter={[32, 8]}>
                  {partners.filter(p => (p.organisation)).map((partner) => (
                    <Col lg={3} md={4} sm={6} xs={6} className="text-center" key={partner.id}>
                      <a href={`/en/organisation/${partner.organisation.id}/`}>
                        <img
                          src={partner.organisation.logo ? partner.organisation.logo.replace('://localhost', 's://rsr3.akvotest.org') : defaultImage}
                          alt={partner.organisation ? partner.organisation.longName : ''}
                          className={classNames(
                            'rsr-img',
                            {
                              'as-gray': (convertToSlug(partner.iatiOrganisationRoleLabel) !== pKey)
                            }
                          )}
                        />
                      </a>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}
        </Skeleton>
      </Section>
      {(project && (
        !(isEmpty(project.goalsOverview)) ||
        !(isEmpty(project.background)) ||
        !(isEmpty(project.currentStatus)) ||
        !(isEmpty(project.targetGroup)) ||
        !(isEmpty(project.projectPlan)) ||
        !(isEmpty(project.sustainability))
      )) && (
          <Section>
            <Row>
              <Col className="text-center mb-3">
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
                  {(project && !(isEmpty(project.goalsOverview))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Goals Overview</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.goalsOverview))}
                      </div>
                    </Collapse.Panel>
                  )}
                  {(project && !(isEmpty(project.background))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Background</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.background))}
                      </div>
                    </Collapse.Panel>
                  )}
                  {(project && !(isEmpty(project.currentStatus))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Situation at start of project</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.currentStatus))}
                      </div>
                    </Collapse.Panel>
                  )}
                  {(project && !(isEmpty(project.targetGroup))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Target group</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.targetGroup))}
                      </div>
                    </Collapse.Panel>
                  )}
                  {(project && !(isEmpty(project.projectPlan))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Project plan</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.projectPlan))}
                      </div>
                    </Collapse.Panel>
                  )}
                  {(project && !(isEmpty(project.sustainability))) && (
                    <Collapse.Panel header={<Title level={3} className="panel-header">Sustainability</Title>}>
                      <div className="paragraph">
                        {mdOutput(parse(project.sustainability))}
                      </div>
                    </Collapse.Panel>
                  )}
                </Collapse>
              </Col>
            </Row>
          </Section>
        )}
    </>
  )
}

export default Home
