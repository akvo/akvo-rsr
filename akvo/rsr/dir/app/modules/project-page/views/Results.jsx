import React from 'react'
import {
  Row,
  Col,
  Collapse,
  Typography,
  Skeleton
} from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import { resultTypes } from '../../../utils/constants'

import ExpandIcon from '../components/ExpandIcon'
import ResultItem from './ResultItem'
import { filterIndicatorTitle, filterResultIndicators } from '../../../utils/misc'
import { setActiveKeys } from '../../../features/collapse/collapseSlice'

const { Panel } = Collapse
const { Text, Title } = Typography

const ResultHeader = ({
  indicators = [],
  search,
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
      <Text className="resultType">{resultType ? resultType.label : ''}</Text>
    </Col>
    <Col xl={2} lg={4} md={4} sm={12} xs={12} className="text-right">
      <Text type="secondary" className="resultIndicator">
        {fetched ? `${indicators.filter((i) => filterIndicatorTitle(i, search)).length} Indicators` : ''}
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
              <Text strong>Aggregate actual</Text>
              <span className="actual-rectangle" />
            </div>
          </div>
        )}
    </Col>
  </Row>
)

const Results = ({ search, allFetched, results = [] }) => {
  const { results: activeKeys } = useSelector((state) => state.collapse)
  const { selected: selectedPeriods, applyFilter } = useSelector((state) => state.periods)
  const dispatch = useDispatch()

  return (
    <div id="rsr-results-overview">
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
        activeKey={activeKeys}
        onChange={(values) => {
          dispatch(setActiveKeys({ key: 'results', values }))
        }}
      >
        {results
          .filter((r) => {
            if (applyFilter && allFetched) {
              return filterResultIndicators(r.indicators, selectedPeriods, search).length
            }
            return r
          })
          .map(result => {
            const resultType = resultTypes.find((rt) => rt.value === result.type)
            return (
              <Panel
                header={(
                  <ResultHeader
                    {...{
                      ...result,
                      resultType,
                      activeKeys,
                      search
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
