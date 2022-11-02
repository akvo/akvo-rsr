import React from 'react'
import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { statusIcons } from './config'

const AggregatedActual = ({
  value,
  status,
  amount,
  total,
  callback,
}) => {
  const iconType = statusIcons[status] || statusIcons.FINISHED
  return (
    <Aggregation>
      <Aggregation.Col icon>
        <Aggregation.Popover status={status} amount={amount} total={total} callback={callback}>
          <Icon type={iconType} className={status} />
        </Aggregation.Popover>
      </Aggregation.Col>
      <Aggregation.Col>
        <Aggregation.Value>
          {value}
        </Aggregation.Value>
      </Aggregation.Col>
    </Aggregation>
  )
}

export default AggregatedActual
