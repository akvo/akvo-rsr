import React, { useState } from 'react'
import { Button, message } from 'antd'
import { connect } from 'react-redux'

import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import {
  aggregatedIcons,
  callToAction,
  toolTips
} from './config'
import api from '../../utils/api'
import * as actions from './store/actions'

const ActualValue = ({
  updateJobStatus,
  actualValue,
  job = {},
}) => {
  const [loading, setLoading] = useState(false)
  const _status = job?.status
  const title = toolTips[_status] || null
  const iconType = aggregatedIcons[_status] || null

  const handleOnRestartJob = (jobID) => {
    setLoading(true)
    api
      .post(`/jobs/indicator_period_aggregation/${jobID}/reschedule/?format=json`)
      .then(({ data }) => {
        setLoading(false)
        data.forEach((d) => {
          updateJobStatus(jobID, d)
        })
      })
      .catch((err) => {
        setLoading(false)
        if (err) message.error('Failed to restart the job')
      })
  }

  return (
    <Aggregation>
      {_status && (
        <Aggregation.Col icon>
          {
            (callToAction.includes(job?.status) && job?.id)
              ? (
                <Aggregation.Tooltip title="Restart the job">
                  <Button shape="circle" onClick={() => handleOnRestartJob(job.id)} data-id={job.id}>
                    <Icon type={loading ? 'loading' : 'rsr.repeat'} width="16px" height="16px" className={job.status} />
                  </Button>
                </Aggregation.Tooltip>
              )
              : (
                <Aggregation.Tooltip title={title}>
                  <Icon type={iconType} width="16px" height="16px" className={job.status} />
                </Aggregation.Tooltip>
              )
          }
        </Aggregation.Col>
      )}
      <Aggregation.Col>
        <Aggregation.Value>
          {actualValue}
        </Aggregation.Value>
      </Aggregation.Col>
    </Aggregation>
  )
}

export default connect(
  null, actions
)(ActualValue)
