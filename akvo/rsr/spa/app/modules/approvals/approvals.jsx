import { Icon } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import api from '../../utils/api'
import './styles.scss'

const Approvals = ({ params }) => {
  const [periods, setPeriods] = useState({})
  useEffect(() => {
    const periods = {}
    api.get(`/program/${params.id}/approvals`)
    .then(({ data }) => {
      console.log(data)
      data.periods.forEach((period) => {
        if(!periods[`${period.periodStart}-${period.periodEnd}`]){
          periods[`${period.periodStart}-${period.periodEnd}`] = []
        }
        periods[`${period.periodStart}-${period.periodEnd}`].push({
          id: period.id, locked: period.locked, project: period.project
        })
      })
      setPeriods(periods)
    })
  }, [])
  console.log(periods)
  return (
    <div className="approvals">
      <h4>Period locking</h4>
      <div className="periods">
        <ul>
          {Object.keys(periods).map(periodKey => {
            const $periods = periods[periodKey]
            const dates = periodKey.split('-')
            const locked = $periods.filter(it => it.locked)
            const unlocked = $periods.filter(it => !it.locked)
            return (
              <li>
                <div className="label">period</div>
                <b>{moment(dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</b>
                {locked.length === $periods.length ? (
                  <div className="status locked">
                    <Icon type="lock" />
                    locked for all projects
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
      <div className="pending">
        <h4>Pending approval</h4>
        <div className="filters">
          Author, Project name, project location
        </div>
      </div>
    </div>
  )
}

export default Approvals
