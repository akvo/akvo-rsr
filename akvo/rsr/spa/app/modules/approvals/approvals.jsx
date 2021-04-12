import { Button, Icon, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import api from '../../utils/api'
import './styles.scss'
import staticData from './static-temp.json'

const Approvals = ({ params, periods, setPeriods }) => {
  const [openPeriod, setOpenPeriod] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState([true, true])
  useEffect(() => {
    if(Object.keys(periods).length === 0){
      // api.get(`/program/${params.id}/approvals/periods/`)
      // .then(({ data }) => {
      //   console.log(data)
      //   setPeriods(data)
      // })
      setPeriods(staticData)
      setLoading([false, true])
    }
  }, [])
  const openModal = (period) => {
    setOpenPeriod(period)
    setModalVisible(true)
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
                ) : projectsUnlocked.length === projects.length ? (
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
      <PeriodModal visible={modalVisible} onCancel={() => setModalVisible(false)} period={openPeriod} />
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

const PeriodModal = ({ visible, onCancel, period }) => {
  return (
    <Modal {...{ visible, onCancel }} width={720} className="period-lock-modal" footer={null}>
      <header>
        <h4>period locking</h4>
        {period && <h3>{moment(period.dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</h3>}
        <div className="btns">
          <Button className="lock" disabled={period?.projectsUnlocked.length === 0}><Icon type="lock" /> Lock for all</Button>
          <Button className="unlock" disabled={period?.projectsLocked.length === 0}><Icon type="unlock" /> Unlock for all</Button>
        </div>
      </header>
      <div className="meta row">
        <h4>projects</h4>
      </div>
      <ul>
        {period && Object.keys(period.projects).map(projectId => {
          const periodIds = period.projects[projectId].periods
          const periods = Object.keys(periodIds).map(id => period.projects[projectId].periods[id])
          const locked = periods.filter(it => it.locked).length === periods.length
          return (
            <li>
              <h5>{period.projects[projectId].title}</h5>
              <div className="right">
                {locked ? [<div className="status locked"><Icon type="lock" /> Locked</div>, <Button size="small">Unlock</Button>] :
                  [<div className="status unlocked"><Icon type="unlock" /> Unlocked</div>, <Button size="small">Lock</Button>]}
              </div>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

export default Approvals
