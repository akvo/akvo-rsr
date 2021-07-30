/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Button, Collapse } from 'antd'
import { useTranslation } from 'react-i18next'
import { cloneDeep, result } from 'lodash'
import classNames from 'classnames'
import { FilterBar, Indicator } from './components'
import { resultTypes } from '../../utils/constants'
import Portal from '../../utils/portal'
import api from '../../utils/api'
import '../results/styles.scss'


const { Panel } = Collapse

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
  periods
}) => {
  const [items, setItems] = useState(results)
  const [search, setSearch] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const { t } = useTranslation()
  const defaultActiveKey = items?.map(result => String(result.id))

  const indicatorsFilter = item => {
    return search.length === 0 || item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
  }

  const indicatorTitle = (title) => {
    if (search.length === 0) return title
    const findex = title.toLowerCase().indexOf(search.toLowerCase())
    return (
      <>
        {title.substr(0, findex)}
        <b>{title.substr(findex, search.length)}</b>
        {title.substr(findex + search.length)}
      </>
    )
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
    api.post(`/set-periods-locked/${projectId}/`, {
      periods: periods.map(it => it.id),
      locked
    })
    const filteredItems = [
      ...items.map(result => {
        return periods.find(item => item.resultId === result.id)
          ? {
            ...result,
            indicators: result.indicators.map(indicator => {
              return periods.find(item => item.indicatorId)
                ? {
                  ...indicator,
                  periods: indicator.periods.map(period => {
                    return periods.find(item => item.id === period.id)
                      ? {
                        ...period,
                        locked
                      }
                      : period
                  })
                }
                : indicator
            })
          }
          : result
      })
    ]
    setItems(filteredItems)
    setResults(filteredItems)
    setSelectedPeriods([])
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

  const toggleSelectedPeriod = (period, indicatorId) => {
    if (selectedPeriods.findIndex(it => it.id === period.id) === -1) {
      setSelectedPeriods([...selectedPeriods, { id: period.id, indicatorId, resultId: period.result, locked: period.locked }])
    } else {
      setSelectedPeriods(selectedPeriods.filter(it => it.id !== period.id))
    }
  }

  const handleOnSelectPeriod = (value) => {
    const allPeriods = value.trim().split('-')
    const periodStart = allPeriods[0].trim()
    const periodEnd = allPeriods[1]
    const selectedPeriod = periodEnd === undefined ? null : { periodStart, periodEnd: periodEnd.trim() }
    if(selectedPeriod){
      const resultsFiltered = [
        ...results.map(result => {
          return {
            ...result,
            indicators: result.indicators.map(indicator => {
              return {
                ...indicator,
                periods: indicator.periods.filter(period => period.periodStart === selectedPeriod.periodStart && period.periodEnd === selectedPeriod.periodEnd)
              }
            })
          }
        })
      ]
      setItems(resultsFiltered)
    }else{
      setItems(results)
    }
  }

  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible">
        <div className="filter-bar">
          <FilterBar
            {...{
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
                  return (
                    <Panel header={indicatorTitle(indicator.title)} key={indicator.id}>
                      <Indicator
                        {...{
                          result,
                          targetsAt,
                          indicator,
                          editPeriod,
                          selectedPeriods,
                          toggleSelectedPeriod,
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
