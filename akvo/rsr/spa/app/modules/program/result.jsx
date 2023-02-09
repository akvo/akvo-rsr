import React, { useEffect, useState } from 'react'
import { Collapse, Icon, Spin, Row, Col } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Indicator from './indicator'
import api from '../../utils/api'
import StickyClass from './sticky-class'
import * as actions from './store/actions'
import Highlighted from '../../components/Highlighted'
import { setNumberFormat } from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Result = ({
  id,
  programId,
  indicators,
  targetsAt,
  fetched,
  search,
  programmeRdr: results,
  ...props
}) => {
  const { t } = useTranslation()
  const [indicatorKeys, setIndicatorKeys] = useState(['0'])
  useEffect(() => {
    if (!fetched) {
      const rx = results.findIndex(it => it.id === id)
      api
        ?.get(`/project/${programId}/result/${id}/`)
        ?.then(({ data }) => {
          if (rx > -1) props.updateProgrammePerResult(rx, { ...data, fetched: true })
        })
        ?.catch(() => {
          props.updateProgrammePerResult(rx, { fetched: true })
        })
    }
  }, [fetched, indicators])
  return (
    <Spin spinning={!fetched} indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />}>
      <Collapse
        activeKey={indicatorKeys}
        onChange={setIndicatorKeys}
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      >
        {indicators.map((indicator, ix) => {
          const hasAChart = (
            (targetsAt && targetsAt === 'indicator') && (indicator?.targetValue) &&
            (indicatorKeys.includes(`${ix}`))
          )
          const colTitle = hasAChart
            ? { xl: 18, lg: 14, md: 18, sm: 24, xs: 24 }
            : { span: 24 }
          const sumActualValue = indicator
            ?.periods
            ?.reduce((total, currentValue) => total + currentValue.actualValue, 0)
          return (
            <Panel
              key={ix}
              data-id={indicator.id}
              header={
                <StickyClass top={40}>
                  <Row gutter={[8, { sm: 32, xs: 32 }]}>
                    <Col {...colTitle}>
                      <h3><Highlighted text={indicator.title} highlight={search} /></h3>
                      <div>
                        <span className="type">{indicator.type}</span>
                        <span>
                          {t('nperiods', { count: indicator.periods.length })}
                        </span>
                      </div>
                    </Col>
                    {(hasAChart) && (
                      <Col xl={6} lg={10} md={6} sm={24} xs={24}>
                        <Row style={{ marginRight: '1rem' }}>
                          <Col lg={10} className="stats-indicator text-right">
                            <div className="stat value">
                              <div className="label">Aggregate Actual</div>
                              <b>{setNumberFormat(sumActualValue)}</b><br />
                              <span>
                                of <b>{indicator.targetValue}</b> target
                              </span>
                            </div>
                          </Col>
                          <Col lg={14}>
                            <TargetCharts targetValue={indicator?.targetValue} actualValue={sumActualValue} />
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                </StickyClass>
              }
            >
              <Indicator
                periods={indicator.periods}
                indicatorType={indicator.type}
                scoreOptions={indicator.scoreOptions}
                {...{
                  targetsAt,
                  indicator,
                  fetched,
                }}
              />
            </Panel>
          )
        })}
      </Collapse>
    </Spin>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(Result)
