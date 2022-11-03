import React from 'react'
import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { popOver, actualValueIcons } from './config'

const ActualValue = ({
  actualValue,
  job = {},
}) => {
  const title = popOver[job?.status] ? popOver[job.status]?.title : null
  const iconType = actualValueIcons[job?.status] || null
  return (
    <Aggregation>
      {job?.status && (
        <Aggregation.Col icon>
          <Aggregation.Tooltip title={title}>
            <Icon type={iconType} width="16px" height="16px" className={job.status} />
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

export default ActualValue
