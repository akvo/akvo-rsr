import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Icon,
  Collapse,
  Typography,
  Skeleton
} from 'antd'
import classNames from 'classnames'

import { resultTypes } from '../../../utils/constants'

import Indicator from '../components/Indicator'

const { Panel } = Collapse
const { Text, Title } = Typography

const ResultHeader = ({
  indicatorCount = null,
  activeResult,
  indicators,
  resultType,
  title,
  id
}) => (
  <Row>
    <Col span={24}>
      <Title level={4}>{title}</Title>
    </Col>
    <Col xl={1} lg={2} md={2} sm={12} xs={12}>
      <Text className="resultType">{resultType}</Text>
    </Col>
    <Col xl={2} lg={4} md={4} sm={12} xs={12} className="text-right">
      <Text type="secondary" className="resultIndicator">
        {
          indicatorCount === null
            ? 'Loading...'
            : `${indicatorCount > 1 ? `${indicatorCount} Indicators` : `${indicatorCount} Indicator`}`
        }
      </Text>
    </Col>
    <Col xl={21} lg={18} md={18} sm={24} xs={24}>
      {(
        indicators &&
        indicators.filter((i) => i.type === 1).length > 0 &&
        activeResult.includes(`${id}`)
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

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Results = ({ results, items, search, setItems, onSearch }) => {
  const [activeKey, setActiveKey] = useState(null)
  const [activePeriods, setActivePeriods] = useState(null)
  const [activeResult, setActiveResult] = useState([])

  const handleOnIndicator = (resultID, values) => {
    setActiveKey({
      ...activeKey,
      [resultID]: values
    })
  }
  const handleOnPeriod = (indicatorID, period) => {
    setActivePeriods({
      ...activePeriods,
      [indicatorID]: period
    })
  }
  useEffect(() => {
    if (items && !activeKey) {
      const keys = {}
      items.forEach((i) => {
        keys[i.id] = i.indicators.map((it) => `${it.id}`)
      })
      setActiveKey(keys)
    }
    if (items && !activePeriods) {
      const options = {}
      items.flatMap((r) => r.indicators).forEach((i) => {
        options[i.id] = '0'
      })
      setActivePeriods(options)
    }
  }, [activeKey, items, activePeriods])
  return (
    <div id="rsr-results-overview">
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
        activeKey={activeResult}
        onChange={setActiveResult}
      >
        {results.map(result => {
          const fullResult = items ? items.find((i) => i.id === result.id) : null
          const indicatorCount = fullResult
            ? fullResult.indicators.filter(onSearch).length
            : null
          const activeValues = (activeKey && fullResult) ? activeKey[`${fullResult.id}`] : []
          const resultType = resultTypes.find((rt) => rt.value === result.type)
          return (
            <Panel
              header={(
                <ResultHeader
                  {...{
                    ...result,
                    activeResult,
                    indicatorCount
                  }}
                  indicators={fullResult ? fullResult.indicators : null}
                  resultType={resultType ? resultType.label : null}
                />
              )}
              key={result.id}
              className="results-panel"
            >
              <Skeleton loading={!(fullResult)} paragraph={{ rows: 10 }} active>
                {fullResult && (
                  <Collapse
                    bordered={false}
                    className="indicators-collapse"
                    activeKey={activeValues}
                    expandIconPosition="right"
                    expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                    onChange={(values) => handleOnIndicator(fullResult.id, values)}
                  >
                    {
                      fullResult
                        .indicators
                        .filter(onSearch)
                        .map((indicator) => {
                          const showProgress = (!(activeValues.length) || (activeValues.length && !activeValues.includes(`${indicator.id}`)))
                          const activePeriod = activePeriods ? activePeriods[`${indicator.id}`] : '0'
                          return (
                            <Panel
                              header={(
                                <Indicator.Header
                                  period={activePeriod}
                                  onPeriod={handleOnPeriod}
                                  {...{
                                    ...indicator,
                                    search,
                                    showProgress
                                  }}
                                />
                              )}
                              className="indicators-panel"
                              key={indicator.id}
                            >
                              <Indicator
                                resultID={fullResult.id}
                                period={activePeriod}
                                {...{
                                  ...indicator,
                                  showProgress,
                                  search,
                                  items,
                                  setItems
                                }}
                              />
                            </Panel>
                          )
                        })
                    }
                  </Collapse>
                )}
              </Skeleton>
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}

export default Results
