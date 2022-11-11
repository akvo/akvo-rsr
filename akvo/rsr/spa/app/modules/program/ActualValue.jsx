import React from 'react'
import { Button } from 'antd'
import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import {
  actualValueIcons,
  callToAction,
  jobStatus,
  toolTips
} from './config'

const ActualValue = ({
  actualValue,
  job = {},
}) => {
  const _status = (!job?.id && job?.status === jobStatus.maxxed) ? jobStatus.failed : job?.status
  const title = toolTips[_status] || null
  const iconType = actualValueIcons[_status] || null

  const handleOnRestartJob = () => {
    console.log('call to API')
  }

  return (
    <Aggregation>
      {_status && (
        <Aggregation.Col icon>
          <Aggregation.Tooltip title={title}>
            {
              (callToAction.includes(job?.status) && job?.id)
                ? (
                  <Button shape="circle" onClick={handleOnRestartJob}>
                    <Icon type={iconType} width="16px" height="16px" className={job.status} />
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

export default ActualValue
