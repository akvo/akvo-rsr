import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Collapse,
  Typography,
  Skeleton
} from 'antd'

import { resultTypes } from '../../../utils/constants'

import ExpandIcon from '../components/ExpandIcon'
import ResultItem from './ResultItem'

const { Panel } = Collapse
const { Text, Title } = Typography

const ResultHeader = ({
  indicators,
  resultType,
  activeKeys,
  fetched,
  title,
  id
}) => (
  <Row>
    <Col span={24}>
      <Title level={4}>{title}</Title>
    </Col>
    <Col xl={1} lg={2} md={2} sm={12} xs={12}>
      <Text className="resultType">{resultType.label || ''}</Text>
    </Col>
    <Col xl={2} lg={4} md={4} sm={12} xs={12} className="text-right">
      <Text type="secondary" className="resultIndicator">
        {fetched ? `${indicators.length} Indicators` : ''}
      </Text>
    </Col>
    <Col xl={21} lg={18} md={18} sm={24} xs={24}>
      {(
        indicators.filter((i) => i.type === 1).length > 0 &&
        activeKeys.includes(`${id}`)
      ) && (
          <div className="indicator-legends">
            <div>
              <Text strong>Target</Text>
              <span className="target-rectangle" />
            </div>
            <div>
              <Text strong>Aggregated actual value</Text>
              <span className="actual-rectangle" />
            </div>
          </div>
        )}
    </Col>
  </Row>
)

const Results = ({ results, search }) => {
  const initialKeys = [results[0].id || null]
  const [activeKeys, setActiveKeys] = useState(initialKeys)

  return (
    <div id="rsr-results-overview">
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
        activeKey={activeKeys}
        onChange={setActiveKeys}
      >
        {results.map(result => {
          const resultType = resultTypes.find((rt) => rt.value === result.type)
          return (
            <Panel
              header={(
                <ResultHeader
                  {...{
                    ...result,
                    resultType,
                    activeKeys
                  }}
                />
              )}
              key={result.id}
              className="results-panel"
            >
              <Skeleton loading={false} paragraph={{ rows: 10 }} active>
                <ResultItem {...result} search={search} />
              </Skeleton>
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}

export default Results
