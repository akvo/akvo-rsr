import { Icon } from 'antd'
import React, { useEffect } from 'react'
import api from '../../utils/api'
import './styles.scss'

const Approvals = ({ params }) => {
  useEffect(() => {
    api.get(`/program/${params.id}/approvals`)
    .then(({ data }) => {
      //
    })
  }, [])
  return (
    <div className="approvals">
      <h4>Period locking</h4>
      <div className="periods">
        <ul>
          <li>
            <div className="label">period</div>
            <b>1 Mar 2021 - 1 Aug 2021</b>
            <div className="status unlocked">
              <Icon type="unlock" />
              unlocked for all projects
            </div>
          </li>
          <li>
            <div className="label">period</div>
            <b>1 Mar 2021 - 1 Aug 2021</b>
            <div className="status locked">
              <Icon type="lock" />
              locked for all projects
            </div>
          </li>
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
