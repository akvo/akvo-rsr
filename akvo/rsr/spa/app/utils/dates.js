import moment from 'moment'

export const printIndicatorPeriod = (periodStart, periodEnd) =>
  `${moment(periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - ${moment(periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}`

export const createdAtFormatted = date => moment(date).format('DD MMM YYYY')
