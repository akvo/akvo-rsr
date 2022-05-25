/* eslint-disable no-useless-escape */
import moment from 'moment'
import chunk from 'lodash/chunk'
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

export const getKeyData = (url, pageIndex, previousPageData) => {
  // reached the end
  if (previousPageData && !previousPageData.next) return null
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return url
  // add the cursor to the API endpoint
  return `${url}&page=${pageIndex + 1}`
}

export const getMultiItems = (data, max = 64, field = 'properties.id') => {
  const chunking = data.length ? chunk(data, max) : []
  return chunking.length ? chunking[0].map((c) => field.split('.').reduce((o, i) => o[i], c)) : []
}

export const getXPoint = (value, props) => {
  const { data, maximumxfromdata, chartwidth, padding } = props
  // eslint-disable-next-line no-restricted-properties
  const dozen = Math.pow(10, (`${value}`.length - 1))
  const dozenValue = Math.ceil(value / dozen) * dozen
  const findIndex = data.findIndex((d) => d.label === dozenValue)
  if (findIndex === -1) {
    const total = (1 / maximumxfromdata) * chartwidth + padding
    const startX = (0 / maximumxfromdata) * chartwidth + padding
    const percentage = Math.round((value / data[1].label) * 100)
    const point = (percentage * total) / 100
    return point > startX ? point : startX + point
  }
  const total = (findIndex / maximumxfromdata) * chartwidth + padding
  return (Math.round((value / dozenValue) * 100) * total) / 100
}
