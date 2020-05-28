/* global window */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse, Button, Select, Form, Checkbox, Tooltip } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'
import pendingSvg from '../../images/status-pending.svg'
import Timeline from './timeline'
import Update from './update'
import EditUpdate from './edit-update'
import DsgOverview from './dsg-overview'

const { Panel } = Collapse
const Aux = node => node.children

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Results = ({ results = [], isFetched, userRdr, match: { params: { id } }, ...props}) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [filterBarVisible, setFilterBarVisible] = useState(true)
  const [activeResultKey, setActiveResultKey] = useState()
  const [periodFilter, setPeriodFilter] = useState(null)
  const [allChecked, setAllChecked] = useState(false)
  const sidebarUlRef = useRef()
  const mainContentRef = useRef()
  const periodSetters = useRef({})
  const filteredResults = results.filter(it => {
    return it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
  })
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
    const sidebarIndex = filteredResults.findIndex(it => it.id === results[key].id)
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
    // TODO rethink request architecture
    let indicatorIds = periods.map(it => it.indicatorId);
    indicatorIds = indicatorIds.filter((it, ind) => indicatorIds.indexOf(it) === ind)
    indicatorIds.forEach(indicatorId => {
      const subset = periods.filter(it => it.indicatorId === indicatorId)
      if(periodSetters.current[indicatorId]) periodSetters.current[indicatorId](subset, locked)
    })
    setSelectedPeriods(selectedPeriods.map(it => ({...it, locked})))
    periods.forEach(period => {
      api.patch(`/indicator_period/${period.id}/`, { locked })
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
  return (
    <div className="results-view">
      <div className="sidebar">
        <header>
          <Input value={src} onChange={(ev) => setSrc(ev.target.value)} placeholder="Find an indicator..." prefix={<Icon type="search" />} allowClear />
          <Button icon="control" type={filterBarVisible ? 'secondary' : 'primary'} onClick={() => setFilterBarVisible(!filterBarVisible)} />
          {/* <FiltersDropdown /> */}
        </header>
        {/* TODO: make this fetch only section5, then fetch the rest upon tab switch */}
        <ProjectInitHandler id={id} match={{ params: { id, section: 'section1' }}} />
        {!isFetched && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 26 }} spin />} /></div>}
        <ul ref={ref => { sidebarUlRef.current = ref }}>
          {filteredResults.map((result, index) => {
            const resultIsActive = activeResultKey && results[activeResultKey].id === result.id
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
          <Select value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>Any reporting status</Option>
            <Option value="1">Needs reporting (21)</Option>
            <Option value="2">Pending approval</Option>
            <Option value="3">Approved</Option>
          </Select>
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
          accordion bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          activeKey={activeResultKey}
          onChange={handleChangeResult}
        >
          {results.map(result => (
            <Panel header={result.title}>
              <Collapse className="indicators-list" destroyInactivePanel bordered={false}>
              {result.indicators.map(indicator => (
                <Panel header={indicator.title}>
                  <Indicator {...{ toggleSelectedPeriod, selectedPeriods, userRdr, periodFilter, getSetPeriodsRef: handleSetPeriodsRef(indicator.id) }} projectId={id} indicatorId={indicator.id} />
                </Panel>
              ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse>
      {/* <Route path="/projects/:projectId/results/:resId/indicators/:id" exact render={(props) => <Indicator {...{...props, projectId: id, userRdr}} />} /> */}
      </div>
    </div>
  )
}

const {Option} = Select

const Indicator = ({ projectId, toggleSelectedPeriod, selectedPeriods, indicatorId, userRdr, periodFilter, getSetPeriodsRef }) => {
  const [periods, setPeriods] = useState(null)
  const periodsRef = useRef()
  const [loading, setLoading] = useState(true)
  const [baseline, setBaseline] = useState({})
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
  }, [])
  useEffect(() => {
    if(indicatorId){
      api.get(`/project/${projectId}/indicator/${indicatorId}/`)
      .then(({data}) => {
        _setPeriods(data.periods.map(it => ({...it, id: it.periodId})))
        setBaseline({ year: data.baselineYear, value: data.baselineValue })
        setLoading(false)
      })
    }
  }, [indicatorId])
  const editPeriod = (period, index) => {
    _setPeriods([...periods.slice(0, index), period, ...periods.slice(index + 1)])
  }
  return (
    <Aux>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>}
      <Collapse accordion className="periods" bordered={false}>
        {periods && periods.filter(it => {
          if(!periodFilter) return true
          const dates = periodFilter.split('-')
          return it.periodStart === dates[0] && it.periodEnd === dates[1]
        }).map((period, index) => <Period {...{ period, index, indicatorId, baseline, userRdr, editPeriod, toggleSelectedPeriod, selectedPeriods}} />
        )}
      </Collapse>
    </Aux>
  )
}

const Period = ({ period, baseline, userRdr, editPeriod, index: periodIndex, indicatorId, toggleSelectedPeriod, selectedPeriods, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [sending, setSending] = useState(false)
  const updatesListRef = useRef()
  useEffect(() => {
    setUpdates(period.updates.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }).sort((a, b) => {
      if(a.status.code === 'A' && b.status.code !== 'A') return -1
      return 0
    }).map(it => ({...it, id: it.updateId})))
  }, [period])
  const handleAccordionChange = (key) => {
    setPinned(key)
  }
  const addUpdate = () => {
    setUpdates([...updates, {
      isNew: true,
      status: {code: 'D'},
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
      disaggregations: period.disaggregationTargets.map(({ category, type, typeId }) => ({ category, type, typeId }))
    }])
    setPinned(String(updates.length))
    setEditing(updates.length)
  }
  const cancelNewUpdate = () => {
    setUpdates(updates.slice(0, updates.length - 1))
    setPinned(-1)
  }
  const handleUpdateEdit = updated => {
    setUpdates([...updates.slice(0, editing), updated, ...updates.slice(editing + 1)])
  }
  const handleValueSubmit = () => {
    setSending(true)
    const { text, value } = updates[editing]
    api.post('/indicator_period_data_framework/', {
      period: period.id,
      user: userRdr.id,
      value,
      disaggregations: updates[editing].disaggregations.filter(it => it.value).map(it => ({...it, dimensionValue: it.typeId})),
      text,
      status: 'A'
    })
    .then(() => {
      setUpdates([...updates.slice(0, editing), { ...updates[editing], isNew: false, status: {code: 'A'} }, ...updates.slice(editing + 1)])
      setEditing(-1)
      setSending(false)
    })
  }
  const handleLockClick = (e) => {
    e.stopPropagation()
    editPeriod({...period, locked: !period.locked}, periodIndex)
  }
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    toggleSelectedPeriod(period, indicatorId)
  }
  const handleUpdateStatus = (update, status) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    const index = updates.findIndex(it => it.id === update.id)
    setUpdates([...updates.slice(0, index), { ...update, status: {code: status} }, ...updates.slice(index + 1)])
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status
    })
  }
  const disaggregations = [...period.disaggregationContributions, ...updates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({...it, status: val.status.code}))], [])]
  return (
    <Panel
      {...props}
      header={
        <div>
          <Checkbox onClick={handleCheckboxClick} checked={selectedPeriods.findIndex(it => it.id === period.id) !== -1} />
          {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
          <Button shape="round" className={period.locked ? 'locked' : 'unlocked'} icon={period.locked ? 'lock' : 'unlock'} onClick={handleLockClick} />
        </div>
      }
    >
      <div className="graph">
        <div className="sticky">
          {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover}} />}
          {disaggregations.length === 0 && <Timeline {...{ updates, period, pinned, updatesListRef, setHover }} />}
          {baseline.value &&
          <div className="baseline-values">
            <div className="baseline-value value">
              <div className="label">baseline value</div>
              <div className="value">{baseline.value}</div>
            </div>
            <div className="baseline-value year">
              <div className="label">baseline year</div>
              <div className="value">{baseline.year}</div>
            </div>
          </div>
          }
        </div>
      </div>
      <div className="updates" ref={(ref) => { updatesListRef.current = ref }}>
        <Collapse accordion activeKey={pinned} onChange={handleAccordionChange} className="updates-list">
          {updates.map((update, index) =>
            <Panel
              key={index}
              className={update.isNew && 'new-update'}
              header={
                <Aux>
                  {editing !== index && <div className={classNames('value', { hovered: hover === index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  {pinned === String(index) && [
                  <div className="label">{update.user.name}</div>
                  ]}
                  {update.status.code === 'A' && (
                    <div className="status approved">
                      <SVGInline svg={approvedSvg} />
                      <div className="text">
                        Approved
                        {pinned === String(index) && [
                          <Aux><br />{update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}</Aux>
                        ]}
                      </div>
                    </div>
                  )}
                  {update.status.code === 'P' && [
                    <div className="status pending">
                      <SVGInline svg={pendingSvg} />
                      {pinned !== String(index) && <div className="text">Pending</div>}
                    </div>,
                    pinned === String(index) &&
                    <div className="btns">
                      <Button type="primary" size="small" onClick={handleUpdateStatus(update, 'A')}>Approve</Button>
                      <Tooltip title="Return for revision">
                        <Button type="link" size="small" onClick={handleUpdateStatus(update, 'R')}>Decline</Button>
                      </Tooltip>
                    </div>
                  ]}
                  {(update.isNew && editing === index) && (
                    <div className="btns">
                      <Button type="primary" size="small" loading={sending} onClick={handleValueSubmit}>Submit</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>Cancel</Button>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index &&
                <Update {...{update, period}} />
              }
              {editing === index && (
                <EditUpdate update={updates[editing]} {...{ handleUpdateEdit, period }} />
              )}
            </Panel>
          )}
        </Collapse>
        {!(updates.length > 0 && updates[updates.length - 1].isNew) && <Button type="dashed" icon="plus" block size="large" onClick={addUpdate}>Add an update</Button>}
      </div>
    </Panel>
  )
}


export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} }, userRdr }) => ({ results, isFetched, userRdr })
)(Results)
