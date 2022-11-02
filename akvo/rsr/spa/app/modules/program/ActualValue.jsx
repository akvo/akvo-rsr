import { Spin } from 'antd'
import React, { useState } from 'react'
import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { popOver, statusIcons } from './config'
import { getJobStatusByPeriod } from './services'

const ActualValue = ({
  actualValue,
  periodId,
}) => {
  const [job, setJob] = useState(null)
  getJobStatusByPeriod(periodId)
    ?.then((res) => {
      setJob(res?.shift())
    })
    ?.catch(() => setJob({ status: 'FAILED' }))
  const title = popOver[job?.status] ? popOver[job.status]?.title : null
  const iconType = statusIcons[job?.status] || null
  return (
    <Aggregation>
      <Aggregation.Col icon>
        {
          (job === null)
            ? <Spin spinning indicator={<Icon type="loading" />} />
            : (
              <Aggregation.Tooltip title={title}>
                <Icon type={iconType} width="16px" height="16px" className={job?.status} />
              </Aggregation.Tooltip>
            )
        }
      </Aggregation.Col>
      <Aggregation.Col>
        <Aggregation.Value>
          {actualValue || '...'}
        </Aggregation.Value>
      </Aggregation.Col>
    </Aggregation>
  )
}

export default ActualValue
