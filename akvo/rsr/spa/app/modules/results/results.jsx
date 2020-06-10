/* global window */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse, Button, Select, Checkbox } from 'antd'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import api from '../../utils/api'
import Period from './period'

const { Panel } = Collapse
const Aux = node => node.children

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Results = ({ userRdr, match: { params: { id } }, ...props}) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [filterBarVisible, setFilterBarVisible] = useState(true)
  const [activeResultKey, setActiveResultKey] = useState()
  const [periodFilter, setPeriodFilter] = useState(null)
  const [allChecked, setAllChecked] = useState(false)
  const [statusFilter, setStatusFilter] = useState(null)
  const [treeFilter, setTreeFilter] = useState({ resultIds: [], indicatorIds: [], periodIds: [] })
  const sidebarUlRef = useRef()
  const mainContentRef = useRef()
  const periodSetters = useRef({})
  const filteredResults = results.filter(it => {
    return it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
  })

  useEffect(() => {
    api.get(`/rest/v1/project/${id}/results_framework/`)
    .then(({ data }) => {
      setResults(data.results)
      setLoading(false)
    })
  }, [])
  const toggleSelectedPeriod = (period, indicatorId) => {
    if(selectedPeriods.findIndex(it => it.id === period.id) === -1){
      setSelectedPeriods([...selectedPeriods, {id: period.id, indicatorId, locked: period.locked}])
    } else {
      setSelectedPeriods(selectedPeriods.filter(it => it.id !== period.id))
    }
  }
  const toggleSelectAll = () => {
    let allPeriods = []
    results.forEach(res => {
      res.indicators.forEach(ind => {
        allPeriods = [
          ...allPeriods,
          ...ind.periods.filter(it => {
            if (!periodFilter) return true
            const dates = periodFilter.split('-')
            return it.periodStart === dates[0] && it.periodEnd === dates[1]
          }).map(it => ({ id: it.id, locked: it.locked, indicatorId: ind.id }))
        ]
      })
    })
    if(selectedPeriods.length < allPeriods.length){
      setSelectedPeriods(allPeriods)
      setAllChecked(true)
    } else {
      setSelectedPeriods([])
      setAllChecked(false)
    }
  }
  const selectedLocked = selectedPeriods.filter(it => it.locked)
  const selectedUnlocked = selectedPeriods.filter(it => !it.locked)
  const handleChangeResult = (key) => {
    setActiveResultKey(key)
    if(!key) return
    const sidebarIndex = filteredResults.findIndex(it => it.id === key)
    if(sidebarIndex > -1){
      if (Math.abs(sidebarUlRef.current.scrollTop - sidebarUlRef.current.children[sidebarIndex].offsetTop) > 500){
        sidebarUlRef.current.scroll({ top: sidebarUlRef.current.children[sidebarIndex].offsetTop - 62, behavior: 'smooth' })
      }
    }
  }
  const handleJumpToIndicator = (result, indicator) => () => {
    const resIndex = results.findIndex(it => it.id === result.id)
    if(resIndex > -1){
      // console.log(mainContentRef.current.getElementsByClassName('results-list')[0].children[resIndex])
      const $resultsList = mainContentRef.current.getElementsByClassName('results-list')[0]
      const resultIsActive = $resultsList.children[resIndex].classList.contains('ant-collapse-item-active')
      if (resultIsActive === false){
        mainContentRef.current.getElementsByClassName('results-list')[0].children[resIndex].children[0].click()
      }
      const indIndex = results[resIndex].indicators.findIndex(it => it.id === indicator.id)
      if(indIndex > -1){
        setTimeout(() => {
          const $indicator = $resultsList.children[resIndex].getElementsByClassName('indicators-list')[0].children[indIndex]
          if ($indicator.classList.contains('ant-collapse-item-active') === false){
            $indicator.children[0].click()
          }
          window.scroll({ top: $indicator.offsetTop - 119, behavior: 'smooth' })
        }, resultIsActive ? 0 : 500)
      }
    }
  }
  const periodOpts = []
  results.forEach(res => {
    res.indicators.forEach(ind => {
      ind.periods.forEach(per => {
        const item = {start: per.periodStart, end: per.periodEnd}
        if(periodOpts.findIndex(it => it.start === item.start && it.end === item.end) === -1){
          periodOpts.push(item)
        }
      })
    })
  })
  const handlePeriodFilter = (value) => {
    setPeriodFilter(value)
  }
  const updatePeriodsLock = (periods, locked) => {
    let indicatorIds = periods.map(it => it.indicatorId);
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    indicatorIds.forEach(indicatorId => {
      const subset = periods.filter(it => it.indicatorId === indicatorId)
      if(periodSetters.current[indicatorId]) periodSetters.current[indicatorId](subset, locked)
    })
    setSelectedPeriods(selectedPeriods.map(it => ({...it, locked})))
    api.post('/set-periods-locked/', {
      periods: periods.map(it => it.id),
      locked
    })
  }
  const handleUnlock = () => {
    updatePeriodsLock(selectedLocked, false)
  }
  const handleLock = () => {
    updatePeriodsLock(selectedUnlocked, true)
  }
  const handleSetPeriodsRef = (indicatorId) => (setPeriods) => {
    periodSetters.current[indicatorId] = setPeriods
  }
  const handleStatusFilterChange = (val) => {
    setStatusFilter(val)
    const filtered = {
      resultIds: [],
      indicatorIds: [],
      periodIds: []
    }
    if(val === 'need-reporting'){
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
          if(filterIndicator){
            console.log('filter', indicator)
            filtered.indicatorIds.push(indicator.id)
          }
        })
        if(filterResult){
          filtered.resultIds.push(result.id)
        }
      })
    }
    setTreeFilter(filtered)
    setActiveResultKey(filtered.resultIds)
  }
  return (
    <div className="results-view">
      <div className="sidebar">
        <header>
          <Input value={src} onChange={(ev) => setSrc(ev.target.value)} placeholder="Find an indicator..." prefix={<Icon type="search" />} allowClear />
          <Button icon="control" type={filterBarVisible ? 'secondary' : 'primary'} onClick={() => setFilterBarVisible(!filterBarVisible)} />
          {/* <FiltersDropdown /> */}
        </header>
        {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 26 }} spin />} /></div>}
        <ul ref={ref => { sidebarUlRef.current = ref }}>
          {filteredResults.map((result, index) => {
            const resultIsActive = activeResultKey && activeResultKey === result.id
            return (
              <li className={resultIsActive && 'active'}>
                <h5><b>{index + 1}.</b> {result.title}</h5>
                <div className="label">{resultTypes.find(it => it.value === result.type).label}</div>
                <div className="count-label">{result.indicators.length + 1} indicators</div>
                {result.indicators.length > 0 && (
                  <ul>
                    {result.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1)
                      .map((indicator, iindex) => {
                        const findex = src === '' ? -1 : indicator.title.toLowerCase().indexOf(src.toLowerCase())
                        return (
                          <li
                            className={resultIsActive && false && 'active'}
                            onClick={handleJumpToIndicator(result, indicator)}
                          >
                            <div>
                              <h5>Indicator <b>{iindex + 1}</b>: {findex === -1 ? indicator.title : [indicator.title.substr(0, findex), <b>{indicator.title.substr(findex, src.length)}</b>, indicator.title.substr(findex + src.length)]}</h5>
                              <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                              <div className="count-label">{t('nperiods', { count: indicator.periods.length })}</div>
                            </div>
                            <Icon type="right" />
                          </li>
                        )
                      })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={classNames('main-content', { filterBarVisible })} ref={ref => { mainContentRef.current = ref }}>
        {filterBarVisible &&
        <div className="filter-bar">
          <Checkbox checked={allChecked} onClick={toggleSelectAll} />
          <StatusFilter {...{results, handleStatusFilterChange, statusFilter}} />
          <Select value={periodFilter} onChange={handlePeriodFilter} dropdownMatchSelectWidth={false}>
            <Option value={null}>All periods</Option>
            {periodOpts.map(opt => <Option value={`${opt.start}-${opt.end}`}>{opt.start} - {opt.end}</Option>)}
          </Select>
          {selectedLocked.length > 0 && <Button type="ghost" className="unlock" icon="unlock" onClick={handleUnlock}>Unlock {selectedLocked.length} periods</Button>}
          {selectedUnlocked.length > 0 && <Button type="ghost" className="lock" icon="lock" onClick={handleLock}>Lock {selectedUnlocked.length} periods</Button>}
          {selectedPeriods.length > 0 && <Button type="ghost" onClick={() => setSelectedPeriods([])}>Unselect</Button>}
          {/* <Button>Select</Button> */}
        </div>
        }
        <Collapse
          accordion={statusFilter == null}
          bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          activeKey={activeResultKey}
          onChange={handleChangeResult}
        >
          {results.filter(it => treeFilter.resultIds.length === 0 ? true : treeFilter.resultIds.indexOf(it.id) !== -1).map(result => (
            <Panel header={result.title} key={result.id}>
              <Collapse className="indicators-list" destroyInactivePanel bordered={false} defaultActiveKey={treeFilter.indicatorIds}>
                {result.indicators.filter(it => treeFilter.indicatorIds.length === 0 ? true : treeFilter.indicatorIds.indexOf(it.id) !== -1).map(indicator => (
                <Panel header={indicator.title} key={indicator.id}>
                  <Indicator {...{ indicator, treeFilter, toggleSelectedPeriod, selectedPeriods, userRdr, periodFilter, getSetPeriodsRef: handleSetPeriodsRef(indicator.id) }} projectId={id} indicatorId={indicator.id} measure={indicator.measure} />
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

const StatusFilter = ({ statusFilter, handleStatusFilterChange, results }) => {
  let needsReporting = 0
  let pending = 0
  let approved = 0
  results.forEach(result => {
    result.indicators.forEach(indicator => {
      indicator.periods.forEach(period => {
        const canAddUpdate = period.locked ? false : indicator.measure === '2' /* 2 == percentage */ ? period.updates.length === 0 : true
        if (canAddUpdate) {
          needsReporting += 1
        }
        period.updates.forEach(update => {
          if(update.status === 'P'){
            pending += 1
          }
          else if(update.status === 'A'){
            approved += 1
          }
        })
      })
    })
  })
  return (
    <Select value={statusFilter} dropdownMatchSelectWidth={false} onChange={handleStatusFilterChange}>
      <Option value={null}>Any reporting status</Option>
      <Option value="need-reporting">Needs reporting ({needsReporting})</Option>
      <Option value="pending">Pending approval ({pending})</Option>
      <Option value="approved">Approved ({approved})</Option>
    </Select>
  )
}

const {Option} = Select

const Indicator = ({ indicator, treeFilter, toggleSelectedPeriod, selectedPeriods, indicatorId, measure, userRdr, periodFilter, getSetPeriodsRef }) => {
  const [periods, setPeriods] = useState(null)
  const periodsRef = useRef()
  const _setPeriods = (_periods) => {
    setPeriods(_periods)
    periodsRef.current = _periods
  }
  const setPeriodsLocked = (subset, locked) => {
    const _periods = cloneDeep(periodsRef.current)
    subset.forEach(period => {
      const item = _periods.find(it => it.id === period.id)
      if(item){
        item.locked = locked
      }
    })
    _setPeriods(_periods)
  }
  useEffect(() => {
    if (getSetPeriodsRef) getSetPeriodsRef(setPeriodsLocked) // to allow parent to setPeriods
    setPeriods(indicator.periods)
  }, [])
  const editPeriod = (period, index) => {
    _setPeriods([...periods.slice(0, index), period, ...periods.slice(index + 1)])
  }
  return (
    <Aux>
      <Collapse accordion className="periods" bordered={false}>
        {periods && periods.filter(it => {
          if(!periodFilter) return true
          const dates = periodFilter.split('-')
          return it.periodStart === dates[0] && it.periodEnd === dates[1]
        }).filter(it => treeFilter.periodIds.length === 0 ? true : treeFilter.periodIds.indexOf(it.id) !== -1).map((period, index) => <Period {...{ period, measure, index, indicatorId, baseline: { year: indicator.baselineYear, value: indicator.baselineValue }, userRdr, editPeriod, toggleSelectedPeriod, selectedPeriods}} />
        )}
      </Collapse>
    </Aux>
  )
}


export default connect(
  ({ userRdr }) => ({ userRdr })
)(Results)
