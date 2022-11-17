import React from 'react'
import { Card, Collapse, Empty, Icon, Row, Col, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import UpdatePeriod from './UpdatePeriod'
import { splitPeriod } from '../../../utils/misc'
import { indicatorType } from '../../../utils/constants'

const { Panel } = Collapse
const { Text } = Typography
const Aux = node => node.children

export const Indicator = ({
  role,
  project,
  result,
  targetsAt,
  indicator,
  editPeriod,
  defaultFirstKey,
  period: selectedPeriod,
  handleOnClickLockPeriod
}) => {
  const { t } = useTranslation()

  const onPeriod = (period) => {
    if (selectedPeriod?.trim().length) {
      const [periodStart, periodEnd] = splitPeriod(selectedPeriod)
      return period.periodStart === periodStart && period.periodEnd === periodEnd
    }
    return period
  }

  const onUpdateApproved = u => u?.status === 'A'

  return indicator.periods.length === 0
    ? (
      <Row>
        <Col style={{ padding: 16 }}>
          <Card>
            <Empty description={t('This indicator has no periods')} />
          </Card>
        </Col>
      </Row>
    )
    : (
      <Aux>
        <Collapse accordion className="periods" bordered={false} defaultActiveKey={defaultFirstKey ? defaultFirstKey.period : null}>
          {indicator?.periods?.filter(onPeriod)?.map((period, px) => {
            const updates = period?.updates?.sort((a, b) => b.id - a.id)
            const baseline = { year: indicator.baselineYear, value: indicator.baselineValue }
            const prevPeriod = px === 0 ? null : indicator?.periods?.filter(onPeriod)[px - 1] || null
            const diffValue = (
              indicator?.cumulative &&
              period?.updates?.length &&
              prevPeriod &&
              period?.actualValue
            )
              ? period.updates.filter(onUpdateApproved).shift().value - prevPeriod.updates.filter(onUpdateApproved).shift().value
              : null
            const lastActualValue = period?.updates?.filter(onUpdateApproved)?.shift()?.value
            return (
              <Panel
                key={period.id}
                header={
                  <Row type="flex" justify="start" align="middle">
                    <Col span={16}>
                      <div style={{ display: 'flex' }}>
                        {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                        <Icon
                          type={period.locked ? 'lock' : 'unlock'}
                          className={`iconbtn ${period.locked ? 'locked' : 'unlocked'}`}
                          onClick={(e) => handleOnClickLockPeriod(e, period, indicator.id, result.id)}
                        />
                      </div>
                    </Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
                      {(indicator?.type === indicatorType.QUANTITATIVE) && (
                        <>
                          <Text strong>
                            {(indicator?.cumulative) ? lastActualValue : period?.actualValue}
                          </Text>
                          <Text type="secondary">
                            {(diffValue && diffValue > 0) ? ` + ${diffValue}` : diffValue ? ` ${diffValue}` : ''}
                          </Text>
                        </>
                      )}
                    </Col>
                  </Row>
                }
              >
                <UpdatePeriod
                  {...{
                    role,
                    project,
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
