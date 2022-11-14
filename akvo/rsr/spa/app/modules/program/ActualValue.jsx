import React, { useState } from 'react'
import { Button, message } from 'antd'
import { connect } from 'react-redux'

import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import {
  actualValueIcons,
  callToAction,
  jobStatus,
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
  const _status = (!job?.id && job?.status === jobStatus.maxxed) ? jobStatus.failed : job?.status
  const title = toolTips[_status] || null
  const iconType = actualValueIcons[_status] || null

  const handleOnRestartJob = (jobID) => {
    setLoading(true)
    api
      .post(`/jobs/indicator_period_aggregation/${jobID}/reschedule/?format=json`)
      .then(({ data }) => {
        setLoading(false)
        updateJobStatus(jobID, data)
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
          <Aggregation.Tooltip title={title}>
            {
              (callToAction.includes(job?.status) && job?.id)
                ? (
                  <Button shape="circle" onClick={() => handleOnRestartJob(job.id)}>
                    <Icon type={loading ? 'loading' : iconType} width="16px" height="16px" className={job.status} />
                  </Button>
                )
                : (
                  <Icon type={iconType} width="16px" height="16px" className={job.status} />
                )
            }
          </Aggregation.Tooltip>
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
