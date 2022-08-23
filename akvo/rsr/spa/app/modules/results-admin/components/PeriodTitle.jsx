import React from 'react'
import moment from 'moment'

const PeriodTitle = ({ periodStart, periodEnd }) => {
  return (
    <div className="period-caption">
      {moment(periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
    </div>
  )
}

export default PeriodTitle
