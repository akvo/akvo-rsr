import React, { useState } from 'react'
import {
  Typography,
  Layout,
  Row,
  Col,
  Select,
  Collapse,
  Skeleton,
  Progress,
  Empty,
  Form
} from 'antd'
import { sumBy } from 'lodash'
import moment from 'moment'

import {
  queryIndicators,
  queryResultOverview,
  queryIndicatorPeriod,
  queryIndicatorPeriodData
} from '../queries'

const { Content } = Layout
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { Panel } = Collapse

const IndicatorHeader = ({ title, periods, type, baselineYear, baselineValue }) => {
  periods = periods.map((p) => ({
    ...p,
    targetValue: parseInt(p.targetValue, 10),
    actualValue: parseInt(p.actualValue, 10)
  }))
  const actual = sumBy(periods, 'actualValue')
  const target = sumBy(periods, 'targetValue')
  const progress = (target > 0 && actual) ? parseFloat((actual / target) * 100, 10).toFixed(0) : null
  return (
    <Row>
      <Col span={22}>
        {title}
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
        {progress && <Progress type="circle" percent={progress} width={50} />}
      </Col>
      <Col span={4}>
        {type === 1 ? 'Quantitative' : 'Qualitative'}
      </Col>
      <Col span={4}>
        {periods ? `${periods.length} Period(s)` : ''}
      </Col>
      <Col span={4}>
        <small>Baseline Year</small>&nbsp;
        <Text>{baselineYear}</Text>
      </Col>
      <Col span={4}>
        <small>Baseline Value</small>&nbsp;
        <Text>{baselineValue}</Text>
      </Col>
    </Row>
  )
}

const PeriodHeader = ({ type, periodStart, periodEnd, targetValue, actualValue }) => {
  periodStart = moment(periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')
  periodEnd = moment(periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')
  return (
    <Row>
      <Col span={12}>
        {`${periodStart} - ${periodEnd}`}
      </Col>
      {type === 1 && (
        <Col span={6} className="text-left">
          <Text strong>ACTUAL</Text>&nbsp;
          <Text>{actualValue}</Text>
        </Col>
      )}
      {type === 1 && (
        <Col span={6} className="text-left">
          <Text strong>TARGET</Text>&nbsp;
          <Text>{targetValue}</Text>
        </Col>
      )}
    </Row>
  )
}

const ResultOverview = ({
  projectId,
  allIndicators,
  allPeriods,
  allUpdates,
  items,
  setItems,
  setAllindicators,
  setAllPeriods,
  setAllUpdates
}) => {
  const isEmpty = (!items)
  const [loading, setLoading] = useState(isEmpty)
  const [preload, setPreload] = useState({
    indicators: isEmpty,
    periods: isEmpty,
    updates: isEmpty
  })
  const { data: dataIndicators, size: sizeIds, setSize: setSizeIds } = queryIndicators(projectId)
  const { data: dataPeriods, size: sizePds, setSize: setSizePds } = queryIndicatorPeriod(projectId)
  const { data: dataPeriodUpdates, size: sizePu, setSize: setSizePu } = queryIndicatorPeriodData(projectId)

  const { data: dataResults } = queryResultOverview(projectId)
  const { results } = dataResults || {}

  /**
     * Fetching indicators
     */
  const lastIds = (dataIndicators) ? dataIndicators.pop() : null
  if (preload.indicators && lastIds && lastIds.next) {
    setAllindicators([...allIndicators, ...lastIds.results])
    setSizeIds(sizeIds + 1)
  }
  if (preload.indicators && lastIds && !lastIds.next) {
    setAllindicators([...allIndicators, ...lastIds.results])
    setPreload({ ...preload, indicators: false })
  }
  /**
   * Fetching periods
   */
  const lastPds = (dataPeriods) ? dataPeriods.pop() : null
  if (preload.periods && lastPds && lastPds.next) {
    setAllPeriods([...allPeriods, ...lastPds.results])
    setSizePds(sizePds + 1)
  }
  if (preload.periods && lastPds && !lastPds.next) {
    setAllPeriods([...allPeriods, ...lastPds.results])
    setPreload({ ...preload, periods: false })
  }
  /**
   * Fetching updates
   */
  const lastPu = (dataPeriodUpdates) ? dataPeriodUpdates.pop() : null
  if (preload.updates && lastPu && lastPu.next) {
    setAllUpdates([...allUpdates, ...lastPu.results])
    setSizePu(sizePu + 1)
  }
  if (preload.updates && lastPu && !lastPu.next) {
    setAllUpdates([...allUpdates, ...lastPu.results])
    setPreload({ ...preload, updates: false })
  }

  if (
    (loading && results && !preload.indicators && !preload.periods) &&
    (allIndicators.length && allPeriods.length)
  ) {
    setLoading(false)
    const allItems = results.map((r) => ({
      ...r,
      indicators: allIndicators
        .filter((i) => i.result === r.id)
        .map((i) => ({
          ...i,
          periods: allPeriods
            .filter((p) => p.indicator === i.id)
            .map((p) => ({
              ...p,
              updates: allUpdates.filter((u) => u.period === p.id)
            }))
        }))
    }))
    setItems(allItems)
  }
  return (
    <>
      <Row className="project-row">
        <Col>
          <Content>
            <Title className="text-dark bold">Results Overview</Title>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row type="flex" justify="end" align="middle" className="mb-3">
              <Col lg={6} sm={12} xs={24}>
                <Form>
                  <Form.Item label="Filter periods">
                    <Select onChange={(val) => console.log('v', val)} className="w-full" placeholder="Select Period" size="large" allowClear>
                      <Option value="1">1 Jan 2015 - 31 Dec 2016 (33)</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                <Skeleton paragraph={{ rows: 10 }} loading={loading} active>
                  <Collapse
                    bordered={false}
                    expandIconPosition="right"
                  >
                    {items && items.map((item) => (
                      <Panel header={item.title} key={item.id}>
                        {
                          item.indicators.length
                            ? (
                              <Collapse expandIconPosition="right">
                                {item.indicators.map((i) => (
                                  <Panel header={(<IndicatorHeader {...i} />)} key={i.id}>
                                    {
                                      i.periods.length
                                        ? (
                                          <Collapse expandIconPosition="right">
                                            {i.periods.map((p) => {
                                              const updates = allUpdates.filter((au) => au.period === p.id)
                                              return (
                                                <Panel header={(<PeriodHeader {...p} type={i.type} />)} key={p.id} disabled={i.type === 1}>
                                                  {updates.map((pu, pux) => (
                                                    <Row gutter={[8, 8]} key={pux}>
                                                      <Col span={3}>
                                                        <Text strong>{pu.userDetails.firstName} {pu.userDetails.lastName}</Text><br />
                                                        <Text strong>Target</Text>
                                                      </Col>
                                                      <Col span={21}>
                                                        <Text strong>at {pu.userDetails.approvedOrganisations[0].name || ''}</Text><br />
                                                        <Text>:&nbsp;{p.targetValue}</Text>
                                                      </Col>
                                                      <Col span={24}>
                                                        <Text strong>Actual</Text>
                                                        <Paragraph>{pu.narrative}</Paragraph>
                                                      </Col>
                                                      <Col span={3}>
                                                        <Text strong>Created on</Text>
                                                      </Col>
                                                      <Col span={21}>
                                                        <Text>&nbsp;:&nbsp;{moment(pu.createdAt, 'YYYY-MM-DD').format('D MMM YYYY')}</Text>
                                                      </Col>
                                                      <Col span={3}>
                                                        <Text strong>Approved on</Text>
                                                      </Col>
                                                      <Col span={21}>
                                                        <Text>&nbsp;:&nbsp;{moment(pu.lastModifiedAt, 'YYYY-MM-DD').format('D MMM YYYY')}</Text>
                                                      </Col>
                                                    </Row>
                                                  ))}
                                                </Panel>
                                              )
                                            })
                                            }
                                          </Collapse>
                                        )
                                        : <Empty />
                                    }
                                  </Panel>
                                ))}
                              </Collapse>
                            )
                            : <Empty />
                        }
                      </Panel>
                    ))}
                  </Collapse>
                </Skeleton>
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </>
  )
}

export default ResultOverview
