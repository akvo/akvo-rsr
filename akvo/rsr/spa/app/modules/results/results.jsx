/* global window */
import React, { useState, useEffect, useRef } from 'react'
// import { createPortal } from 'react-dom'
import { connect } from 'react-redux'
import { Input, Icon, Collapse, Button, Select, Checkbox } from 'antd'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Portal from '../../utils/portal'
import './styles.scss'
import api from '../../utils/api'
import Period from './period'
import * as actions from '../editor/actions'
import actionTypes from '../editor/action-types'
import { resultTypes } from '../../utils/constants'

const { Panel } = Collapse
const Aux = node => node.children

const Results = ({ userRdr, results, setResults, id, dispatch}) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [activeResultKey, setActiveResultKey] = useState()
  const [periodFilter, setPeriodFilter] = useState(null)
  const [allChecked, setAllChecked] = useState(false)
  const [statusFilter, setStatusFilter] = useState(null)
  const [treeFilter, setTreeFilter] = useState({ resultIds: [], indicatorIds: [], periodIds: [], updateIds: [] })
  const mainContentRef = useRef()

  const toggleSelectedPeriod = (period, indicatorId) => {
    if(selectedPeriods.findIndex(it => it.id === period.id) === -1){
      setSelectedPeriods([...selectedPeriods, {id: period.id, indicatorId, resultId: period.result, locked: period.locked}])
    } else {
      setSelectedPeriods(selectedPeriods.filter(it => it.id !== period.id))
    }
  }
  const selectedLocked = selectedPeriods.filter(it => it.locked)
  const selectedUnlocked = selectedPeriods.filter(it => !it.locked)
  const handleChangeResult = (key) => {
    setActiveResultKey(key)
  }
  const updatePeriodsLock = (periods, locked) => {
    let indicatorIds = periods.map(it => it.indicatorId);
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    setSelectedPeriods(selectedPeriods.map(it => ({...it, locked})))
    api.post(`/set-periods-locked/${id}/`, {
      periods: periods.map(it => it.id),
      locked
    })
    // update results
    setResults((results) => {
      const _results = cloneDeep(results)
      periods.forEach(period => {
        _results.find(it => it.id === period.resultId)
          .indicators.find(it => it.id === period.indicatorId)
          .periods.find(it => it.id === period.id)
          .locked = locked
      })
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
    if(srcFilter) return treeFilter.resultIds.length === 0 ? true : treeFilter.resultIds.indexOf(it.id) !== -1
    return false
  }
  const indicatorsFilter = it => {
    const srcFilter = src.length === 0 || it.title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if(srcFilter) return treeFilter.indicatorIds.length === 0 ? true : treeFilter.indicatorIds.indexOf(it.id) !== -1
    return false
  }
  const indicatorTitle = (title) => {
    if(src.length === 0) return title
    const findex = title.toLowerCase().indexOf(src.toLowerCase())
    return [title.substr(0, findex), <b>{title.substr(findex, src.length)}</b>, title.substr(findex + src.length)]
  }
  const filteredResults = results.filter(resultsFilter)
  const pushUpdate = (newUpdate, periodId, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    _results.find(it => it.id === resultId)
      .indicators.find(it => it.id === indicatorId)
      .periods.find(it => it.id === periodId)
      .updates.push(newUpdate)
    setResults(_results)
  }
  const patchPeriod = (period, indicatorId, resultId) => {
    const _results = cloneDeep(results)
    const _period = _results.find(it => it.id === resultId)
      .indicators.find(it => it.id === indicatorId)
      .periods.find(it => it.id === period.id)
    _period.locked = period.locked
    Object.keys(period).forEach((key) => {
      _period[key] = period[key]
    })
    setResults(_results)
  }
  const handleSearchInput = (ev) => {
    setSrc(ev.target.value)
  }
  useEffect(() => {
    if(src.length > 0){
      setActiveResultKey(filteredResults.map(it => it.id))
    }
  }, [src])
  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible" ref={ref => { mainContentRef.current = ref }}>
        <div className="filter-bar">
          <FilterBar {...{ results, setResults, filteredResults, periodFilter, setPeriodFilter, statusFilter, setStatusFilter, setTreeFilter, setSelectedPeriods, setActiveResultKey, indicatorsFilter, setAllChecked, src, handleSearchInput, handleUnlock, handleLock, selectedLocked, selectedUnlocked, dispatch }} />
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
        <Collapse
          bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          activeKey={activeResultKey}
          onChange={handleChangeResult}
        >
          {filteredResults.map(result => (
            <Panel header={[
              <div className="text">
                <span>{result.title}</span>
                <div>
                  <small>{t(resultTypes.find(it => it.value === result.type)?.label)}</small>
                  <i>{t('{{count}} indicators', { count: result.indicators.length })}</i>
                </div>
              </div>
            ]} key={result.id}>
              <Collapse className="indicators-list" destroyInactivePanel bordered={false} defaultActiveKey={treeFilter.indicatorIds}>
                {result.indicators.filter(indicatorsFilter).map(indicator => (
                <Panel header={indicatorTitle(indicator.title)} key={indicator.id}>
                  <Indicator {...{ setResults, indicator, treeFilter, statusFilter, toggleSelectedPeriod, selectedPeriods, userRdr, periodFilter, pushUpdate, patchPeriod }} projectId={id} indicatorId={indicator.id} resultId={result.id} measure={indicator.measure} />
                </Panel>
              ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  )
}

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const FilterBar = ({ results, setResults, filteredResults, periodFilter, setPeriodFilter, statusFilter, setStatusFilter, setTreeFilter, setSelectedPeriods, setActiveResultKey, indicatorsFilter, selectedLocked, selectedUnlocked, handleUnlock, handleLock, src, handleSearchInput, dispatch }) => {
  const { t } = useTranslation()
  let needsReporting = 0
  let pending = 0
  let approved = 0
  const periodOpts = []
  const pendingUpdates = []
  results.forEach(result => {
    result.indicators.forEach(indicator => {
      indicator.periods.forEach(period => {
        const item = { start: period.periodStart, end: period.periodEnd }
        if (periodOpts.findIndex(it => it.start === item.start && it.end === item.end) === -1) {
          periodOpts.push(item)
        }
        const canAddUpdate = period.locked ? false : indicator.measure === '2' /* 2 == percentage */ ? period.updates.length === 0 : true
        if (canAddUpdate) {
          needsReporting += 1
        }
        period.updates.forEach(update => {
          if (update.status === 'P') {
            pending += 1
            pendingUpdates.push({ ...update, indicatorId: indicator.id, periodId: period.id, resultId: result.id })
          }
          else if (update.status === 'A') {
            approved += 1
          }
        })
      })
    })
  })
  useEffect(() => {
    dispatch({ type: actionTypes.SAVE_FIELDS, fields: { pendingUpdateCount: pending }, sectionIndex: 1, noSync: true })
  }, [results])
  const clickStatus = (status) => () => {
    const updatedStatusFilter = status !== statusFilter ? status : null
    setStatusFilter(updatedStatusFilter)
    setPeriodFilter(null)
    const filtered = {
      resultIds: [],
      indicatorIds: [],
      periodIds: [],
      updateIds: []
    }
    if (updatedStatusFilter === 'need-reporting') {
      results.forEach(result => {
        let filterResult = false
        result.indicators.forEach(indicator => {
          let filterIndicator = false
          indicator.periods.forEach(period => {
            const canAddUpdate = period.locked ? false : indicator.measure === '2' /* 2 == percentage */ ? period.updates.length === 0 : true
            if (canAddUpdate) {
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
    else if (updatedStatusFilter === 'pending') {
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
    else if (updatedStatusFilter === 'approved') {
      results.forEach(result => {
        let filterResult = false
        result.indicators.forEach(indicator => {
          let filterIndicator = false
          indicator.periods.forEach(period => {
            const pending = period.updates.filter(it => it.status === 'A')
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
    setTreeFilter(filtered)
    setActiveResultKey(filtered.resultIds)
    setSelectedPeriods([])
  }
  const handlePeriodFilter = (value) => {
    setPeriodFilter(value)
    setStatusFilter(null)
    setTreeFilter({
      resultIds: [],
      indicatorIds: [],
      periodIds: [],
      updateIds: []
    })
    let allPeriods = []
    filteredResults.forEach(res => {
      res.indicators.filter(indicatorsFilter).forEach(ind => {
        allPeriods = [
          ...allPeriods,
          ...ind.periods.filter(it => {
            if (!value) return true
            const dates = value.split('-')
            return it.periodStart === dates[0] && it.periodEnd === dates[1]
          }).map(it => ({ id: it.id, locked: it.locked, indicatorId: ind.id, resId: res.id }))
        ]
      })
    })
    if (value) {
      setSelectedPeriods(allPeriods)
      setActiveResultKey(allPeriods.filter((it, ind) => allPeriods.findIndex(_it => _it.resId === it.resId) === ind).map(it => it.resId))
    } else {
      setSelectedPeriods([])
      setActiveResultKey([])
    }
  }
  return [
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'need-reporting'})} onClick={clickStatus('need-reporting')}>
        <span className="label">{t('To be reported')}</span>
        <div><Checkbox checked={statusFilter === 'need-reporting'} /><b>{needsReporting}</b></div>
      </div>,
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'pending' })} onClick={clickStatus('pending')}>
        <span className="label">{t('Pending approval')}</span>
        <div><Checkbox checked={statusFilter === 'pending'} /><b>{pending}</b></div>
      </div>,
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'approved' })} onClick={clickStatus('approved')}>
        <span className="label">{t('Approved')}</span>
        <div><Checkbox checked={statusFilter === 'approved'} /><b>{approved}</b></div>
      </div>,
      <div className="periods-section">
        <span className="label">{t('Filter period')}</span>
        <div>
          <Select dropdownMatchSelectWidth={false} placeholder="Period range" value={periodFilter} onChange={handlePeriodFilter}>
            <Option value={null}>{t('All periods')}</Option>
            {periodOpts.map(opt => <Option value={`${opt.start}-${opt.end}`}>{opt.start} - {opt.end}</Option>)}
          </Select>
          <Button type="ghost" disabled={selectedLocked.length === 0} className="unlock" icon="unlock" onClick={handleUnlock}>{selectedLocked.length === 0 ? t('Unlock') : t('Unlock {{N}} periods', { N: selectedLocked.length })}</Button>
          <Button type="ghost" disabled={selectedUnlocked.length === 0} className="lock" icon="lock" onClick={handleLock}>{selectedUnlocked.length === 0 ? t('Lock') : t('Lock {{N}} periods', { N: selectedUnlocked.length })}</Button>
        </div>
      </div>,
      <div className="src">
        <div className="label">{t('Filter by indicator title')}</div>
        <Input value={src} onChange={handleSearchInput} placeholder="Search" prefix={<Icon type="search" />} allowClear />
      </div>
  ]
}


const {Option, OptGroup} = Select

const Indicator = ({ setResults, indicator, treeFilter, statusFilter, pushUpdate, patchPeriod, toggleSelectedPeriod, selectedPeriods, indicatorId, resultId, projectId, measure, userRdr, periodFilter }) => {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState(-1)
  const editPeriod = (period) => {
    patchPeriod(period, indicatorId, resultId)
  }
  if(indicator.periods.length === 0) {
    return [
     <div className="no-periods">{t('This indicator has no periods')}</div>
    ]
  }
  return (
    <Aux>
      <Collapse accordion className="periods" bordered={false} activeKey={activeKey} onChange={key => { setActiveKey(key) }}>
        {indicator.periods && indicator.periods.filter(it => {
          if(!periodFilter) return true
          const dates = periodFilter.split('-')
          return it.periodStart === dates[0] && it.periodEnd === dates[1]
        }).filter(it => treeFilter.periodIds.length === 0 ? true : treeFilter.periodIds.indexOf(it.id) !== -1)
          .map((period, index) => <Period {...{ setResults, period, measure, index, activeKey, key: period.id, indicatorId, resultId, projectId, indicator, treeFilter, statusFilter, pushUpdate, baseline: { year: indicator.baselineYear, value: indicator.baselineValue }, userRdr, editPeriod, toggleSelectedPeriod, selectedPeriods}} />
        )}
      </Collapse>
    </Aux>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Results)
