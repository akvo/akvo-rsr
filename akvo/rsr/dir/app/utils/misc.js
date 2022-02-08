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

export const createPaginate = (items, page, perPage) => {
  page = page || 1
  perPage = perPage || 10
  const offset = (page - 1) * perPage
  return items.slice(offset).slice(0, perPage)
}
