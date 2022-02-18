/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Button, Collapse, notification, Typography, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { cloneDeep, isEmpty } from 'lodash'
import classNames from 'classnames'
import SimpleMarkdown from 'simple-markdown'

import { FilterBar, Indicator } from './components'
import { resultTypes } from '../../utils/constants'
import { setNumberFormat } from '../../utils/misc'
import Portal from '../../utils/portal'
import api from '../../utils/api'
import '../results/styles.scss'
import './ResultOverview.scss'
import Highlighted from '../../components/Highlighted'
import TargetCharts from '../../utils/target-charts'

const { Panel } = Collapse
const { Text } = Typography

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const ResultOverview = ({
  id: projectId,
  userRdr,
  results,
  setResults,
  targetsAt,
  periods,
  role
}) => {
  const [items, setItems] = useState(results)
  const [search, setSearch] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [period, setPeriod] = useState('')
  const { t } = useTranslation()
  const defaultActiveKey = items?.map(result => String(result.id))
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const indicatorsFilter = item => {
    return search.length === 0 || item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
  }

  const editPeriod = (period, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    const _period = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === period.id)
    if (!_period) return
    _period.locked = period.locked
    Object.keys(period).forEach((key) => {
      _period[key] = period[key]
    })
    setResults(_results)
    setItems(_results)
    const $index = selectedPeriods.findIndex(it => it.id === period.id)
    if ($index > -1) {
      setSelectedPeriods((value) => [...value.slice(0, $index), { ...value[$index], locked: period.locked }, ...value.slice($index + 1)])
    }
  }

  const handleOnSearch = (value) => {
    setSearch(value)
    const searchResult = (value && value.trim().length > 0)
      ? results.filter(item => {
        return item.indicators.filter(indicator => indicator.title.toLowerCase().includes(value.toLowerCase())).length > 0
      })
      : results
    setItems(searchResult)
  }

  const handleLockPeriods = (periods, locked) => {
    let indicatorIds = periods.map(it => it.indicatorId)
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    setSelectedPeriods(selectedPeriods.map(it => ({ ...it, locked })))
    api
      .post(`/set-periods-locked/${projectId}/`, {
        periods: periods.map(it => it.id),
        locked
      })
      .then(() => {
        setPeriod('')
        const filteredItems = results.map(r => ({
          ...r,
          indicators: r.indicators.map((i) => ({
            ...i,
            periods: i.periods.map((p) => ({
              ...p,
              locked: (selectedPeriods.find((sp) => sp.id === p.id)) ? locked : p.locked
            }))
          }))
        }))
        setItems(filteredItems)
        setResults(filteredItems)
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
    api.post(`/set-periods-locked/${projectId}/`, {
      periods: [period.id],
      locked: !period.locked
    })
  }

  const handleOnSelectPeriod = (value) => {
    setPeriod(value)
    if (!isEmpty(value)) {
      const [periodStart, periodEnd] = value.split('-')
      const resultsFiltered = [
        ...results.map(result => {
          return {
            ...result,
            indicators: result.indicators.map(indicator => {
              return {
                ...indicator,
                periods: indicator.periods.filter(period => (
                  period.periodStart === periodStart.trim() &&
                  period.periodEnd === periodEnd.trim()
                ))
              }
            })
          }
        })
      ]
      const periods = resultsFiltered?.flatMap((r) => r.indicators)?.flatMap((i) => i.periods)
      setSelectedPeriods(periods)
      setItems(resultsFiltered)
    } else {
      setSelectedPeriods([])
      setItems(results)
    }
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
          <Portal>
            <div className="beta">
              <div className="label">
                <Icon type="experiment" />
                {t('New view (beta)')}
              </div>
              <Button type="danger" href={`/${userRdr.lang}/myrsr/my_project/${projectId}/`}>{t('Older version')}</Button>
            </div>
          </Portal>
        </div>
        <Collapse
          bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          {...{ defaultActiveKey }}
        >
          {items?.map(result => (
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
              >
                {result.indicators.filter(indicatorsFilter).map(indicator => {
                  const sumActualValue = indicator?.periods.reduce((total, currentValue) => total + currentValue.actualValue, 0)
                  const percent = parseInt(indicator?.targetValue > 0 ? (sumActualValue / indicator.targetValue) * 100 : 0, 10)
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
                                <TargetCharts actualValue={sumActualValue} targetValue={indicator.targetValue} />
                              </Col>
                              <Col span={3} className="target-indicator" style={{ paddingRight: 10 }}>
                                <ul>
                                  <li>
                                    <div className="label">aggregated actual value</div>
                                  </li>
                                  <li>
                                    <h4 className="value"><b>{setNumberFormat(sumActualValue)}</b></h4>
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
                          targetsAt,
                          indicator,
                          editPeriod,
                          handleOnClickLockPeriod
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
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr }) => ({ userRdr, needsReportingTimeoutDays })
)(ResultOverview)
