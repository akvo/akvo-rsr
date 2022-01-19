import React, { useState, useEffect } from 'react'
import {
  Typography,
  Layout,
  Row,
  Col,
  Select,
  Collapse,
  Skeleton,
  Button
} from 'antd'

import { queryIndicatorPeriod, queryIndicators, queryResultOverview } from '../queries'

const { Content } = Layout
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { Panel } = Collapse

const ResultOverview = ({ projectId }) => {
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState({
    results: true,
    indicators: true
  })

  const [items, setItems] = useState(null)
  const [periods, setPeriods] = useState([])
  const { data: dataResults } = queryResultOverview(projectId)
  const { data: dataIndicators } = queryIndicators(projectId)
  const { data: dataPeriods, size, setSize } = queryIndicatorPeriod(projectId)
  const { results } = dataResults || {}
  const { results: indicators } = dataIndicators || {}

  useEffect(() => {
    if (loading && preload.results && results) {
      setPreload({ ...preload, results: false })
    }
    if (loading && preload.indicators && indicators) {
      setPreload({ ...preload, indicators: false })
    }
    if (loading && !preload.indicators && !preload.results) {
      setLoading(false)
    }
    if (!items && indicators && results) {
      const data = results.map((r) => ({
        ...r,
        indicators: indicators.filter((i) => i.result === r.id)
      }))
      setItems(data)
    }
    if (dataPeriods) {
      dataPeriods.forEach((p) => {
        if (p.next) {
          console.log('s', size)
          setSize(size + 1)
          setPeriods(dataPeriods.map((p) => p.results))
        }
      })
    }
  }, [loading, preload, indicators, results, items, dataPeriods])
  console.log('p', periods)
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
                <Select onChange={(val) => console.log('v', val)} className="w-full" placeholder="Select Period" size="large">
                  <Option value="1">1 Jan 2015 - 31 Dec 2016 (33)</Option>
                </Select>
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
                        {item.indicators.length && (
                          <Collapse expandIconPosition="right">
                            {item.indicators.map((i) => (
                              <Panel header={i.title} key={i.id}>
                                <Title level={3}>{i.title}</Title>
                              </Panel>
                            ))}
                          </Collapse>
                        )}
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
