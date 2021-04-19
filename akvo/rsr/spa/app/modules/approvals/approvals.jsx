import { Icon, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import api, { config } from '../../utils/api'
import PeriodModal from './period-modal'
import './styles.scss'


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
                {projectsUnlocked.length === 0 ? (
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
                    unlocked for {projectsUnlocked.length} <span>of {projects.length} projects</span>
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


export default Approvals
