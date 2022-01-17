import React from 'react'
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

import { queryResultOverview } from '../queries'

const { Content } = Layout
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { Panel } = Collapse

const ResultOverview = ({ projectId }) => {
  const { data } = queryResultOverview(projectId)
  const { results } = data || {}
  console.log('d', results)
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
                <Collapse
                  bordered={false}
                  expandIconPosition="right"
                >
                  {results && results.map((r) => (
                    <Collapse.Panel header={r.title} key={r.id}>
                      <Title level={3}>{r.title}</Title>
                    </Collapse.Panel>
                  ))}
                </Collapse>
                {!results && (
                  <Row>
                    {[1, 2, 3, 4, 5, 6].map((l) => (
                      <Col key={l}>
                        <Skeleton paragraph={{ rows: 3 }} loading active>{l}</Skeleton>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </>
  )
}

export default ResultOverview
