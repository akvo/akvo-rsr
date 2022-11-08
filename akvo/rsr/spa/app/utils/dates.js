import moment from 'moment'

export const printIndicatorPeriod = (periodStart, periodEnd) =>
  `${moment(periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - ${moment(periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}`
