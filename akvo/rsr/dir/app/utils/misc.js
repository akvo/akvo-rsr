/* eslint-disable no-useless-escape */
import moment from 'moment'

/**
 * Set string as number format by comma as default.
 * */
export const setNumberFormat = (amount, separator = ',') => {
  amount = amount === undefined || amount === null ? 0 : amount
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * Calculate days to go until a particular dat
 */
export const daysRemaining = (eventDate) => {
  const finishDate = moment(eventDate)
  const todaysDate = moment()
  return finishDate.diff(todaysDate)
}
