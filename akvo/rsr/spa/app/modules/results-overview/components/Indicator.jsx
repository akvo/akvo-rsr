import React, { useState } from 'react'
import { Row, Col, Collapse, Icon, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { setNumberFormat } from '../../../utils/misc'
import { UpdatePeriod } from './UpdatePeriod'
import TargetCharts from '../../../utils/target-charts'

const { Panel } = Collapse
const Aux = node => node.children

export const Indicator = ({
  result,
  targetsAt,
  indicator,
  editPeriod,
  handleOnClickLockPeriod
}) => {
  const [activeKey, setActiveKey] = useState(-1)

  const { t } = useTranslation()
  const sumActualValue = indicator?.periods.reduce((total, currentValue) => total + currentValue.actualValue, 0)

  return indicator.periods.length === 0
    ? <div className="no-periods">{t('This indicator has no periods')}</div>
    : (
      <Aux>
        {targetsAt && targetsAt === 'indicator' && indicator?.targetValue && (
          <Row>
            <Col span={16} />
            <Col span={4} className="stats-indicator">
              <div className="stat value">
                <div className="label">aggregated actual value</div>
                <b>{setNumberFormat(sumActualValue)}</b><br />
                <span>
                  of <b>{indicator?.targetValue}</b> target
                </span>
              </div>
            </Col>
            <Col span={4}>
              {<TargetCharts targetValue={indicator?.targetValue} actualValue={sumActualValue} />}
            </Col>
          </Row>
        )}
        <Collapse accordion className="periods" bordered={false} activeKey={activeKey} onChange={key => { setActiveKey(key) }}>
          {indicator.periods.map(period => {
            const updates = period?.updates?.sort((a, b) => b.id - a.id)
            const baseline = { year: indicator.baselineYear, value: indicator.baselineValue }
            return (
              <Panel
                key={period.id}
                header={
                  <div style={{ display: 'flex' }}>
                    {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                    <Icon
                      type={period.locked ? 'lock' : 'unlock'}
                      className={`iconbtn ${period.locked ? 'locked' : 'unlocked'}`}
                      onClick={(e) => handleOnClickLockPeriod(e, period, indicator.id, result.id)}
                    />
                  </div>
                }
              >
                <UpdatePeriod
                  {...{
                    period,
                    indicator,
                    updates,
                    baseline,
                    targetsAt,
                    editPeriod
                  }}
                />
              </Panel>
            )
          })}
        </Collapse>
      </Aux>
    )
}
