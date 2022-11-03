import React from 'react'
import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { aggregatedIcons } from './config'

const AggregatedActual = ({
  value,
  status,
  amount,
  total,
  callback,
}) => {
  const iconType = aggregatedIcons[status] || null
  return (
    <Aggregation>
      {iconType && (
        <Aggregation.Col icon>
          <Aggregation.Popover status={status} amount={amount} total={total} callback={callback}>
            <Icon type={iconType} className={status} width="20px" height="20px" />
          </Aggregation.Popover>
        </Aggregation.Col>
      )}
      <Aggregation.Col>
        <Aggregation.Value>
          {value}
        </Aggregation.Value>
      </Aggregation.Col>
    </Aggregation>
  )
}

export default AggregatedActual
