import React, { useEffect } from 'react'
import classNames from 'classnames'
import { Input, Icon, Button, Select, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import { isPeriodNeedsReporting, isPeriodApproved } from './filters'
import actionTypes from '../editor/action-types'

const { Option, OptGroup } = Select

const FilterCheckbox = ({ results, setResults, filteredResults, periodFilter, setPeriodFilter, statusFilter, setStatusFilter, setTreeFilter, setSelectedPeriods, setActiveResultKey, indicatorsFilter, selectedLocked, selectedUnlocked, handleUnlock, handleLock, src, handleSearchInput, needsReportingTimeoutDays, dispatch }) => {
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
        if (isPeriodNeedsReporting(period, needsReportingTimeoutDays)) {
          needsReporting += 1
        }
        if (isPeriodApproved(period)) {
          approved += 1
        }
        period.updates.forEach(update => {
          if (update.status === 'P') {
            pending += 1
            pendingUpdates.push({ ...update, indicatorId: indicator.id, periodId: period.id, resultId: result.id })
          }
        })
      })
    })
  })
  useEffect(() => {
    dispatch({ type: actionTypes.SAVE_FIELDS, fields: { pendingUpdateCount: pending }, sectionIndex: 1, noSync: true })
  }, [results])
  useEffect(() => {
    if ((statusFilter === 'need-reporting' && needsReporting === 0) ||
      (statusFilter === 'pending' && pending === 0) ||
      (statusFilter === 'approved' && approved === 0)) {
      // RESET FILTER
      const filtered = {
        resultIds: [],
        indicatorIds: [],
        periodIds: [],
        updateIds: []
      }
      setStatusFilter(null)
      setPeriodFilter(null)
      setTreeFilter(filtered)
    }
  }, [needsReporting, pending, approved])
  const clickStatus = (status) => () => {
    if (status === 'need-reporting' && needsReporting === 0) return
    if (status === 'pending' && pending === 0) return
    if (status === 'approved' && approved === 0) return
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
  return (
    <div style={{ display: 'flex' }}>
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'need-reporting', disabled: needsReporting === 0 })} onClick={clickStatus('need-reporting')}>
        <span className="label">{t('To be reported')}</span>
        <div><Checkbox checked={statusFilter === 'need-reporting'} disabled={needsReporting === 0} /><b>{needsReporting}</b></div>
      </div>
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'pending', disabled: pending === 0 })} onClick={clickStatus('pending')}>
        <span className="label">{t('Pending approval')}</span>
        <div><Checkbox checked={statusFilter === 'pending'} disabled={pending === 0} /><b>{pending}</b></div>
      </div>
      <div className={classNames('btn switch', { fade: statusFilter != null && statusFilter !== 'approved', disabled: approved === 0 })} onClick={clickStatus('approved')}>
        <span className="label">{t('Approved')}</span>
        <div><Checkbox checked={statusFilter === 'approved'} disabled={approved === 0} /><b>{approved}</b></div>
      </div>
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
      </div>
      <div className="src" style={{ width: '270px' }}>
        <div className="label">{t('Filter by indicator title')}</div>
        <Input value={src} onChange={handleSearchInput} placeholder="Search" prefix={<Icon type="search" />} allowClear />
      </div>
    </div>
  )
}

export default FilterCheckbox
