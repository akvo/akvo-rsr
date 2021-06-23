/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Icon, Collapse, Button, Tabs, Badge, Typography } from 'antd'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Portal from '../../utils/portal'
import './styles.scss'
import api from '../../utils/api'
import Period from './period'
import { resultTypes } from '../../utils/constants'
import Enumerator from './enumerator'
import PendingApproval from './pending-approval'
import FilterBar from './filter-bar'
import FilterCheckbox from './filter-checkbox.jsx'
import { getUniqueValues, getSubdomainName } from '../../utils/misc'
import { isPeriodApproved, isPeriodNeedsReporting } from './filters'
import { shouldShowFlag, flagOrgs } from '../../utils/feat-flags'

const { TabPane } = Tabs
const { Panel } = Collapse
const Aux = node => node.children
const BadgeTabs = ({ ...props }) => <Badge {...props} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset', marginLeft: '1em', fontWeight: 'bold' }} />
const { Text } = Typography

const Results = ({ userRdr, needsReportingTimeoutDays, results, setResults, id, type: resultsType, dispatch }) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [activeResultKey, setActiveResultKey] = useState()
  const [periodFilter, setPeriodFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [treeFilter, setTreeFilter] = useState({ resultIds: [], indicatorIds: [], periodIds: [], updateIds: [] })
  const [optionPeriods, setOptionPeriods] = useState()
  const [amountFilter, setAmountFilter] = useState({
    tobeReported: 0,
    pendingApproval: 0,
    approved: 0
  })

  const mainContentRef = useRef()
  const selectedLocked = selectedPeriods.filter(it => it.locked)
  const selectedUnlocked = selectedPeriods.filter(it => !it.locked)
  const defaultActiveKey = results?.map(result => String(result.id))
  const showResultAdmin = shouldShowFlag(userRdr.organisations, flagOrgs.AKVO_USERS) || (getSubdomainName() === 'rsr4')

  const toggleSelectedPeriod = (period, indicatorId) => {
    if (selectedPeriods.findIndex(it => it.id === period.id) === -1) {
      setSelectedPeriods([...selectedPeriods, { id: period.id, indicatorId, resultId: period.result, locked: period.locked }])
    } else {
      setSelectedPeriods(selectedPeriods.filter(it => it.id !== period.id))
    }
  }

  const updatePeriodsLock = (periods, locked) => {
    let indicatorIds = periods.map(it => it.indicatorId)
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    setSelectedPeriods(selectedPeriods.map(it => ({ ...it, locked })))
    api.post(`/set-periods-locked/${id}/`, {
      periods: periods.map(it => it.id),
      locked
    })
    // update results
    setResults((results) => {
      const _results = cloneDeep(results)
      periods.forEach(period => {
        const _period = _results.find(it => it.id === period.resId)
          ?.indicators.find(it => it.id === period.indicatorId)
          ?.periods.find(it => it.id === period.id)
        if (_period) _period.locked = locked
      })
      return _results
    })
  }
  const handleUnlock = () => {
    updatePeriodsLock(selectedLocked, false)
  }
  const handleLock = () => {
    updatePeriodsLock(selectedUnlocked, true)
  }
  const resultsFilter = it => {
    const srcFilter = it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
    if (srcFilter) return treeFilter.resultIds.length === 0 ? true : treeFilter.resultIds.indexOf(it.id) !== -1
    return false
  }
  const indicatorsFilter = it => {
    const srcFilter = src.length === 0 || it.title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if (srcFilter) return treeFilter.indicatorIds.length === 0 ? true : treeFilter.indicatorIds.indexOf(it.id) !== -1
    return false
  }
  const indicatorTitle = (title) => {
    if (src.length === 0) return title
    const findex = title.toLowerCase().indexOf(src.toLowerCase())
    return [title.substr(0, findex), <b>{title.substr(findex, src.length)}</b>, title.substr(findex + src.length)]
  }
  const filteredResults = results?.filter(resultsFilter)
  const pushUpdate = (newUpdate, periodId, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    const _period = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === periodId)
    if (!_period) return
    _period.updates.push(newUpdate)
    setResults(_results)
  }
  const updateUpdate = (update, periodId, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    const _update = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === periodId)
      ?.updates.find(it => it.id === update.id)
    if (!_update) return
    Object.keys(update).forEach(key => {
      _update[key] = update[key]
    })
    setResults(_results)
  }
  const deleteUpdate = (update, periodId, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    const _period = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === periodId)
    if (!_period) return
    _period.updates.splice(_period.updates.findIndex(it => it.id === update.id), 1)
    setResults(_results)
  }
  const patchPeriod = (period, indicatorId, resultId) => {
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
    const $index = selectedPeriods.findIndex(it => it.id === period.id)
    if ($index > -1) {
      setSelectedPeriods((value) => [...value.slice(0, $index), { ...value[$index], locked: period.locked }, ...value.slice($index + 1)])
    }
  }
  const handleSearchInput = (ev) => {
    setSrc(ev.target.value)
  }

  const handleOnChangeTabStatus = status => {
    setStatusFilter(status)
    setPeriodFilter(null)
    const filtered = {
      resultIds: [],
      indicatorIds: [],
      periodIds: [],
      updateIds: []
    }
    if (status === 'need-reporting') {
      results.forEach(result => {
        let filterResult = false
        result.indicators.forEach(indicator => {
          let filterIndicator = false
          indicator.periods.forEach(period => {
            if (isPeriodNeedsReporting(period, needsReportingTimeoutDays)) {
              filterResult = true
              filterIndicator = true
              filtered.periodIds.push(period.id)
            }
          })
          if (filterIndicator) {
            filtered.indicatorIds.push(indicator.id)
          }
        })
        if (filterResult) {
          filtered.resultIds.push(result.id)
        }
      })
    }
    else if (status === 'pending') {
      results.forEach(result => {
        let filterResult = false
        result.indicators.forEach(indicator => {
          let filterIndicator = false
          indicator.periods.forEach(period => {
            const pending = period.updates.filter(it => it.status === 'P')
            if (pending.length > 0) {
              filterIndicator = true
              filterResult = true
              filtered.periodIds.push(period.id)
              filtered.updateIds = pending.map(it => it.id)
            }
          })
          if (filterIndicator) {
            filtered.indicatorIds.push(indicator.id)
          }
        })
        if (filterResult) {
          filtered.resultIds.push(result.id)
        }
      })
    }
    else if (status === 'approved') {
      results.forEach(result => {
        let filterResult = false
        result.indicators.forEach(indicator => {
          let filterIndicator = false
          indicator.periods.forEach(period => {
            if (isPeriodApproved(period)) {
              filterIndicator = true
              filterResult = true
              filtered.periodIds.push(period.id)
              filtered.updateIds = period.updates.filter(it => it.status === 'A').map(it => it.id)
            }
          })
          if (filterIndicator) {
            filtered.indicatorIds.push(indicator.id)
          }
        })
        if (filterResult) {
          filtered.resultIds.push(result.id)
        }
      })
    }
    setTreeFilter(filtered)
    setActiveResultKey(filtered.resultIds)
    setSelectedPeriods([])
  }

  useEffect(() => {
    if (src.length > 0) {
      setActiveResultKey(filteredResults?.map(it => it.id))
    }
  }, [src])

  useEffect(() => {
    let dataPeriods = results?.flatMap(result => {
      return result?.indicators?.flatMap(item => {
        return item?.periods?.flatMap(period => ({ start: period?.periodStart, end: period?.periodEnd }))
      })
    })
    dataPeriods = getUniqueValues(dataPeriods, ['start', 'end'])
    setOptionPeriods(dataPeriods)

    const dataFiltered = results?.flatMap(result => {
      return result?.indicators?.flatMap(item => {
        return item?.periods?.flatMap(period => ({
          tobeReported: (isPeriodNeedsReporting(period, needsReportingTimeoutDays)) ? 1 : 0,
          pendingApproval: period.updates.filter(update => update.status === 'P')?.length,
          approved: (isPeriodApproved(period)) ? 1 : 0
        }))
      })
    })
    setAmountFilter({
      tobeReported: dataFiltered?.filter(item => item?.tobeReported === 1)?.length,
      pendingApproval: dataFiltered?.filter(item => item?.pendingApproval === 1)?.length,
      approved: dataFiltered?.filter(item => item?.approved === 1)?.length,
    })
  }, [])

  useEffect(() => {
    if (showResultAdmin && resultsType === 'results' && statusFilter) {
      setStatusFilter(null)
    }

    if (showResultAdmin && resultsType === 'results-admin' && !statusFilter) {
      setStatusFilter('need-reporting')
    }
  })
  const textTobeReported = statusFilter === 'need-reporting' ? { strong: true, style: { color: '#1890ff' } } : { strong: false, type: 'secondary' }
  const textPending = statusFilter === 'pending' ? { strong: true, style: { color: '#1890ff' } } : { strong: false, type: 'secondary' }
  const filterProps = {
    results,
    filteredResults,
    periodFilter,
    setPeriodFilter,
    statusFilter,
    setStatusFilter,
    setTreeFilter,
    setSelectedPeriods,
    setActiveResultKey,
    indicatorsFilter,
    needsReportingTimeoutDays,
    dispatch,
    selectedLocked,
    selectedUnlocked,
    handleUnlock,
    handleLock,
    src,
    handleSearchInput,
    periods: optionPeriods,
    resultsType
  }
  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible" ref={ref => { mainContentRef.current = ref }}>
        <div className="filter-bar">
          {showResultAdmin ? <FilterBar {...filterProps} /> : <FilterCheckbox {...filterProps} />}
          <Portal>
            <div className="beta">
              <div className="label">
                <Icon type="experiment" />
                New view (beta)
              </div>
              <a href={`/${userRdr.lang}/myrsr/my_project/${id}/`}><Button type="danger">Older version</Button></a>
            </div>
          </Portal>
        </div>
        {resultsType === 'results-admin' && (
          <Tabs type="card" style={{ marginTop: '1em' }} onChange={key => handleOnChangeTabStatus(key)}>
            <TabPane
              tab={
                <>
                  <Text {...textTobeReported}>To be Reported</Text>
                  <BadgeTabs count={amountFilter?.tobeReported} />
                </>
              }
              key="need-reporting"
            />
            <TabPane
              tab={
                <>
                  <Text {...textPending}>Pending Approval</Text>
                  <BadgeTabs count={amountFilter?.pendingApproval} />
                </>
              }
              key="pending"
            />
          </Tabs>
        )}
        {(statusFilter !== 'need-reporting' && statusFilter !== 'pending') &&
          <Collapse
            bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
            defaultActiveKey={activeResultKey || defaultActiveKey}
            onChange={key => setActiveResultKey(key)}
          >
            {filteredResults?.map(result => (
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
                <Collapse className="indicators-list" destroyInactivePanel bordered={false} defaultActiveKey={treeFilter.indicatorIds}>
                  {result.indicators.filter(indicatorsFilter).map(indicator => (
                    <Panel header={indicatorTitle(indicator.title)} key={indicator.id}>
                      <Indicator {...{ setResults, indicator, treeFilter, statusFilter, toggleSelectedPeriod, selectedPeriods, userRdr, periodFilter, pushUpdate, updateUpdate, deleteUpdate, patchPeriod }} projectId={id} indicatorId={indicator.id} resultId={result.id} measure={indicator.measure} />
                    </Panel>
                  ))}
                </Collapse>
              </Panel>
            ))}
          </Collapse>
        }
        {statusFilter === 'pending' && <PendingApproval results={results} setResults={setResults} projectId={id} />}
        {statusFilter === 'need-reporting' && <Enumerator mneView {...{ needsReportingTimeoutDays, results, setResults }} />}
      </div>
    </div>
  )
}

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)


const Indicator = ({ setResults, indicator, treeFilter, statusFilter, pushUpdate, updateUpdate, deleteUpdate, patchPeriod, toggleSelectedPeriod, selectedPeriods, indicatorId, resultId, projectId, measure, userRdr, periodFilter }) => {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState(-1)
  const editPeriod = (period) => {
    patchPeriod(period, indicatorId, resultId)
  }
  if (indicator.periods.length === 0) {
    return [
      <div className="no-periods">{t('This indicator has no periods')}</div>
    ]
  }
  return (
    <Aux>
      <Collapse accordion className="periods" bordered={false} activeKey={activeKey} onChange={key => { setActiveKey(key) }}>
        {indicator.periods && indicator.periods.filter(it => {
          if (!periodFilter) return true
          const dates = periodFilter.split('-')
          return it.periodStart === dates[0] && it.periodEnd === dates[1]
        }).filter(it => treeFilter.periodIds.length === 0 ? true : treeFilter.periodIds.indexOf(it.id) !== -1)
          .map((period, index) => <Period {...{ setResults, period, measure, index, activeKey, key: period.id, indicatorId, resultId, projectId, indicator, treeFilter, statusFilter, pushUpdate, updateUpdate, deleteUpdate, baseline: { year: indicator.baselineYear, value: indicator.baselineValue }, userRdr, editPeriod, toggleSelectedPeriod, selectedPeriods }} />
          )}
      </Collapse>
    </Aux>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr }) => ({ userRdr, needsReportingTimeoutDays })
)(Results)
