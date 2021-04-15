import { Button, Icon, Modal, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import api, { config } from '../../utils/api'
import COUNTRIES from '../../utils/countries.json'
import './styles.scss'
import Search from '../../utils/search'

const countryDict = {}
COUNTRIES.forEach((it) => {
  countryDict[it.code] = it.name
})

const Approvals = ({ params, periods, setPeriods }) => {
  const [openPeriod, setOpenPeriod] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState([true, true])
  useEffect(() => {
    if(Object.keys(periods).length === 0){
      const _config = cloneDeep(config)
      delete _config.transformResponse
      axios({ url: `/program/${params.id}/approvals/periods/`, ..._config })
        .then(({ data }) => {
          setPeriods(data)
          setLoading([false, true])
          api.get(`/program/${params.id}/approvals/pending-updates/`)
          .then(({ data }) => {
            setLoading([false, false])
          })
      })
    }
  }, [])
  const openModal = (period) => {
    setOpenPeriod(period)
    setModalVisible(true)
  }
  const updatePeriods = (locked, $periods, periodKey) => {
    const updated = cloneDeep(periods)
    $periods.forEach(period => {
      updated[periodKey][period.projectId].periods[period.id].locked = locked
    })
    setPeriods(updated)
    // update selected period
    const projects = Object.keys(updated[periodKey]).map(projectId => updated[periodKey][projectId])
    const projectsLocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked === false).length === 0)
    const projectsUnlocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked).length === 0)
    setOpenPeriod({ dates: periodKey.split('-'), projects: updated[periodKey], projectsLocked, projectsUnlocked })

    api.post('/set-periods-locked/', {
      periods: $periods.map(it => it.id),
      locked
    })
  }
  return (
    <div className="approvals">
      <h4>Period locking</h4>
      <div className="periods">
        {loading[0] &&
        <div className="spin-container">
          <Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} />
        </div>
        }
        <ul>
          {Object.keys(periods).map(periodKey => {
            const dates = periodKey.split('-')
            if(dates[0] === '' || dates[1] === '') return null
            const projects = Object.keys(periods[periodKey]).map(projectId => periods[periodKey][projectId])
            const projectsLocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked === false).length === 0)
            const projectsUnlocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked).length === 0)
            return (
              <li onClick={() => openModal({ dates, projects: periods[periodKey], projectsLocked, projectsUnlocked })}>
                <div className="label">period</div>
                <b>{moment(dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</b>
                {projectsLocked.length === projects.length ? (
                  <div className="status locked">
                    <Icon type="lock" />
                    locked for {projectsLocked.length} projects
                  </div>
                ) : projectsLocked.length === 0 ? (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for all {Object.keys(periods[periodKey]).length} projects
                  </div>
                ) : (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for {projects.length - projectsLocked.length} <span>of {projects.length} projects</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <PeriodModal visible={modalVisible} onCancel={() => setModalVisible(false)} period={openPeriod} periods={periods} updatePeriods={updatePeriods} />
      <div className="pending">
        <h4>Pending approval</h4>
        <div className="filters">
          Author, Project name, project location
        </div>
        {loading[1] &&
          <div className="spin-container">
            <Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} />
          </div>
        }
      </div>
    </div>
  )
}

const PeriodModal = ({ visible, onCancel, period, updatePeriods }) => {
  const [src, setSrc] = useState('')
  const [countryFilter, setCountryFilter] = useState(null)
  const [countryOpts, setCountryOpts] = useState([])
  useEffect(() => {
    if(period){
      setTimeout(() => {
        const opts = Object.keys(period.projects).reduce((acc, projectId) => [...acc, ...period.projects[projectId].countries], [])
        setCountryOpts(opts.filter((it, index) => opts.indexOf(it) === index))
      }, 500)
    }
    else {
      setTimeout(() => {
        setSrc('')
      }, 500)
    }
  }, [period])
  const projectFilter = projectId => {
    let ret = true
    if (src !== '') ret = period?.projects[projectId].title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if(ret && countryFilter != null) ret = period.projects[projectId].countries.indexOf(countryFilter) !== -1
    return ret
  }
  return (
    <Modal {...{ visible, onCancel }} width={720} className="period-lock-modal" footer={null}>
      <header>
        <h4>period locking</h4>
        {period && <h3>{moment(period.dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</h3>}
        <div className="btns">
          <Button className="lock" onClick={() => updatePeriods(true, period.projectsUnlocked.reduce((acc, val) => [...acc, ...Object.keys(val.periods).map(it => ({...val.periods[it], projectId: val.id}))], []), period.dates.join('-'))} disabled={period?.projectsUnlocked.length === 0}><Icon type="lock" /> Lock for all</Button>
          <Button className="unlock" onClick={() => updatePeriods(false, period.projectsLocked.reduce((acc, val) => [...acc, ...Object.keys(val.periods).map(it => ({...val.periods[it], projectId: val.id}))], []), period.dates.join('-'))} disabled={period?.projectsLocked.length === 0}><Icon type="unlock" /> Unlock for all</Button>
        </div>
      </header>
      <div className="meta row">
        <h4>projects</h4>
        <div className="filters">
          <Search placeholder="Find a project..." onChange={setSrc} onClear={() => setSrc('')} />
          <Select value={countryFilter} onChange={setCountryFilter} showSearch allowClear optionFilterProp="children" placeholder="Filter by country">
            {countryOpts.map(code => <Select.Option key={code} value={code}>{countryDict[code.toUpperCase()]}</Select.Option>)}
          </Select>
        </div>
      </div>
      <ul>
        {period && Object.keys(period.projects).filter(projectFilter).map(projectId => {
          const periodIds = period.projects[projectId].periods
          const periods = Object.keys(periodIds).map(id => ({...period.projects[projectId].periods[id], projectId}))
          const locked = periods.filter(it => it.locked).length === periods.length
          return (
            <li>
              <h5>{period.projects[projectId].title}</h5>
              <div className="right">
                {locked ? [<div className="status locked"><Icon type="lock" /> Locked</div>, <Button size="small" onClick={() => updatePeriods(false, periods, period.dates.join('-'), projectId)}>Unlock</Button>] :
                  [<div className="status unlocked"><Icon type="unlock" /> Unlocked</div>, <Button size="small" onClick={() => updatePeriods(true, periods, period.dates.join('-'), projectId)}>Lock</Button>]}
              </div>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

export default Approvals
