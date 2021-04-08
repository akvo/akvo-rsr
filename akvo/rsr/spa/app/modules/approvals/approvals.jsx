import { Button, Icon, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import api from '../../utils/api'
import './styles.scss'

const Approvals = ({ params }) => {
  const [periods, setPeriods] = useState({})
  const [openPeriod, setOpenPeriod] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState([true, true])
  useEffect(() => {
    const periods = {}
    api.get(`/program/${params.id}/approvals`)
    .then(({ data }) => {
      data.periods.forEach((period) => {
        if(!periods[`${period.periodStart}-${period.periodEnd}`]){
          periods[`${period.periodStart}-${period.periodEnd}`] = []
        }
        periods[`${period.periodStart}-${period.periodEnd}`].push({
          id: period.id, locked: period.locked, project: period.project
        })
      })
      setPeriods(periods)
      setLoading([false, false])
    })
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
            const $periods = periods[periodKey]
            const dates = periodKey.split('-')
            const locked = $periods.filter(it => it.locked)
            const unlocked = $periods.filter(it => !it.locked)
            return (
              <li onClick={() => openModal({ dates, $periods })}>
                <div className="label">period</div>
                <b>{moment(dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</b>
                {locked.length === $periods.length ? (
                  <div className="status locked">
                    <Icon type="lock" />
                    locked
                  </div>
                ) : unlocked.length === $periods.length ? (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for all projects
                  </div>
                ) : (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for <span>some projects</span>
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
  const [projects, setProjects] = useState({})
  // if(period){
  //   projects = period.$periods.filter((it, index) => period.$periods.findIndex($it => $it.project.id) === index).map(it => it.project)
  // }
  useEffect(() => {
    if(period){
      const projects = {}
      period.$periods.forEach(($period) => {
        if(!projects[$period.project.id]){
          projects[$period.project.id] = { title: $period.project.title, periods: []}
        }
        projects[$period.project.id].periods.push({ id: $period.id, locked: $period.locked })
      })
      setProjects(projects)
    }
  }, [period])
  console.log(projects)
  return (
    <Modal {...{ visible, onCancel }} width={720} className="period-lock-modal" footer={null}>
      <header>
        <h4>period locking</h4>
        {period && <h3>{moment(period.dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</h3>}
        <div className="btns">
          <Button className="lock"><Icon type="lock" /> Lock for all</Button>
          <Button className="unlock"><Icon type="unlock" /> Unlock for all</Button>
        </div>
      </header>
      <div className="meta row">
        <h4>projects</h4>
      </div>
      <ul>
        {Object.keys(projects).map(projectId => {
          const locked = projects[projectId].periods.filter(it => it.locked).length === projects[projectId].periods.length
          return (
            <li>
              <h5>{projects[projectId].title}</h5>
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
