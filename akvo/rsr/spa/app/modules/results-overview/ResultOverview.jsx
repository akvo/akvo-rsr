/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Collapse, notification, Typography, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { cloneDeep, isEmpty } from 'lodash'
import classNames from 'classnames'
import SimpleMarkdown from 'simple-markdown'
import moment from 'moment'

import { FilterBar, Indicator } from './components'
import { resultTypes } from '../../utils/constants'
import { setNumberFormat, splitPeriod } from '../../utils/misc'
import api from '../../utils/api'
import '../results/styles.scss'
import './ResultOverview.scss'
import Highlighted from '../../components/Highlighted'
import TargetCharts from '../../utils/target-charts'
import * as actions from '../results/actions'

const { Panel } = Collapse
const { Text } = Typography

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const ResultOverview = ({
  params,
  targetsAt,
  periods,
  role,
  project,
  resultRdr,
  setResultState,
  toggleLockPeriod
}) => {
  const [search, setSearch] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [period, setPeriod] = useState('')
  const { t } = useTranslation()
  const defaultActiveKey = resultRdr?.map(result => String(result.id))
  const defaultFirstKey = (params.get('o') && params.get('o') === 'announcement')
    ? resultRdr
      ?.filter((r) => r?.indicators?.filter((i) => (i?.periods?.filter((p) => !(p.locked)).length)).length)
      .map((r) => {
        const indicator = r?.indicators?.find((i) => i?.periods?.filter((p) => !(p.locked)).length)
        const period = indicator?.periods?.find((p) => !(p.locked))
        return {
          indicator: indicator?.id,
          period: period?.id
        }
      })[0]
    : null
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const indicatorsFilter = item => {
    return search.length === 0 || item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
  }

  const editPeriod = (period, indicatorId, resultId) => {
    const _results = cloneDeep(resultRdr)
    const _period = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === period.id)
    if (!_period) return
    _period.locked = period.locked
    Object.keys(period).forEach((key) => {
      _period[key] = period[key]
    })
    setResultState(_results)
    const $index = selectedPeriods.findIndex(it => it.id === period.id)
    if ($index > -1) {
      setSelectedPeriods((value) => [...value.slice(0, $index), { ...value[$index], locked: period.locked }, ...value.slice($index + 1)])
    }
  }

  const handleOnSearch = (value) => setSearch(value)

  const handleLockPeriods = (periods, locked) => {
    let indicatorIds = periods.map(it => it.indicatorId)
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    setSelectedPeriods(selectedPeriods.map(it => ({ ...it, locked })))
    api
      .post(`/set-periods-locked/${project.id}/`, {
        periods: periods.map(it => it.id),
        locked
      })
      .then(() => {
        setPeriod('')
        toggleLockPeriod(selectedPeriods, locked)
        setSelectedPeriods([])
      })
      .catch(() => {
        notification.open({
          message: t('Error'),
          description: `Failed to ${locked ? 'locked' : 'unlocked'} period`,
          duration: 0,
          icon: <Icon type="exclamation" style={{ color: '#f5222d' }} />
        })
      })
  }

  const handleSwitchLock = (type) => {
    handleLockPeriods(selectedPeriods, (type === 'lock'))
  }

  const handleOnClickLockPeriod = (e, period, indicatorId, resultId) => {
    e.stopPropagation()
    editPeriod({ ...period, locked: !period.locked }, indicatorId, resultId)
    api.post(`/set-periods-locked/${project.id}/`, {
      periods: [period.id],
      locked: !period.locked
    })
  }

  const handleOnSelectPeriod = (value) => {
    setPeriod(value)
    const [periodStart, periodEnd] = splitPeriod(value)
    if (periodStart && periodEnd) {
      const periods = resultRdr
        ?.flatMap((r) => r?.indicators)
        ?.flatMap((i) => i?.periods)
        ?.filter((p) => (p.periodStart === periodStart && p.periodEnd === periodEnd))
      setSelectedPeriods(periods)
    } else {
      setSelectedPeriods([])
    }
  }

  const sumActualValue = (indicator) => {
    if (indicator.measure === '2') {
      const { numerator, denominator } = indicator.periods.reduce((result, period) => {
        return {
          numerator: result.numerator + period.numerator,
          denominator: result.denominator + period.denominator
        }
      }, { numerator: 0, denominator: 0 })
      return ((numerator / denominator) * 100).toFixed(2)
    }
    if (!indicator.isCumulative) {
      return indicator.periods.reduce((total, currentValue) => total + currentValue.actualValue, 0)
    }
    const filteredPeriods = indicator.periods.filter(period => period.updates.length)
    if (!filteredPeriods.length) {
      return 0
    }
    const latest = filteredPeriods.reduce((a, b) =>
      (moment(b.periodEnd, 'DD/MM/YYYY') - moment(a.periodEnd, 'DD/MM/YYYY') > 0) ? b : a
    )
    return latest.actualValue
  }

  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible">
        <div className="filter-bar">
          <FilterBar
            {...{
              period,
              periods,
              selectedPeriods,
              handleOnSearch,
              handleSwitchLock,
              handleOnSelectPeriod
            }}
          />
        </div>
        <Collapse
          bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          {...{ defaultActiveKey }}
        >
          {resultRdr?.map(result => (
            <Panel header={(
              <div className="text">
                <span>{result.title}</span>
                <div>
                  <small>{t(resultTypes.find(it => it.value === result.type)?.label)}</small>
                  <i>{t('{{count}} indicators', { count: result.indicators.length })}</i>
                </div>
              </div>
            )}
              key={result.id}
              style={{ marginBottom: '2em' }}
            >
              <Collapse
                className="indicators-list"
                destroyInactivePanel
                bordered={false}
                defaultActiveKey={defaultFirstKey ? defaultFirstKey.indicator : null}
              >
                {result.indicators.filter(indicatorsFilter).map(indicator => {
                  const actualValue = sumActualValue(indicator)
                  return (
                    <Panel
                      header={(
                        <Row>
                          <Col>
                            <Text strong>Title : </Text>
                            <Highlighted text={indicator?.title} highlight={search} />
                          </Col>
                        </Row>
                      )}
                      key={indicator.id}
                    >
                      {
                        (targetsAt && targetsAt === 'indicator' && indicator?.targetValue)
                          ? (
                            <Row className="border-top border-bottom">
                              <Col span={17}>
                                {((!isEmpty(indicator.description.trim())) && indicator.description.trim().length > 5) && (
                                  <details style={{ padding: '16px 22px' }}>
                                    <summary>Description</summary>
                                    <p>{mdOutput(mdParse(indicator.description))}</p>
                                  </details>
                                )}
                              </Col>
                              <Col span={4} className="target-indicator border-left">
                                <TargetCharts actualValue={actualValue} targetValue={indicator.targetValue} />
                              </Col>
                              <Col span={3} className="target-indicator" style={{ paddingRight: 10 }}>
                                <ul>
                                  <li>
                                    <div className="label">aggregated actual value</div>
                                  </li>
                                  <li>
                                    <h4 className="value"><b>{setNumberFormat(actualValue)}</b></h4>
                                  </li>
                                  <li>
                                    <div className="label">of</div>
                                  </li>
                                  <li>
                                    <h4><b>{setNumberFormat(indicator.targetValue)}</b></h4>
                                  </li>
                                  <li>
                                    <div className="label">target</div>
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          ) : (
                            <Row>
                              <Col>
                                {((!isEmpty(indicator.description.trim())) && indicator.description.trim().length > 5) && (
                                  <details style={{ padding: '16px 22px' }}>
                                    <summary>Description</summary>
                                    <p>{mdOutput(mdParse(indicator.description))}</p>
                                  </details>
                                )}
                              </Col>
                            </Row>
                          )
                      }
                      <Indicator
                        {...{
                          role,
                          result,
                          period,
                          targetsAt,
                          indicator,
                          editPeriod,
                          defaultFirstKey,
                          handleOnClickLockPeriod,
                          project
                        }}
                      />
                    </Panel>
                  )
                })}
              </Collapse>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr, resultRdr }) => ({ userRdr, resultRdr, needsReportingTimeoutDays }), actions
)(ResultOverview)
