/* eslint-disable no-useless-escape */
import moment from 'moment'
import chunk from 'lodash/chunk'
import orderBy from 'lodash/orderBy'
import { images } from './config'
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

export const getMultiItems = (data, max = 64) => {
  const sorting = orderBy(data, [(d) => d.properties ? d.properties.activeness : d], ['desc'])
  const chunking = chunk(sorting, max)
  return chunking[0] ? chunking[0].map((c) => c.properties ? c.properties.id : c) : []
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

export const filterIndicatorTitle = (i, search) => {
  if (search) {
    return i.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
  }
  return i
}

export const splitPeriod = value => value.split('-')
  .map((v) => v.trim())
  .map((v) => moment(v, 'DD MMM YYYY').format('YYYY-MM-DD'))

export const filterBySelectedPeriods = (p, selectedPeriods) => selectedPeriods
  .filter((sp) => {
    const [start, end] = splitPeriod(sp)
    return p.periodStart === start && p.periodEnd === end
  }).length

export const filterResultIndicators = (indicators, selectedPeriods, search) => indicators
  .filter((i) => filterIndicatorTitle(i, search))
  .filter((i) => {
    if (selectedPeriods.length) {
      return i.periods
        .filter((p) => filterBySelectedPeriods(p, selectedPeriods))
        .filter((p) => p.updates.length)
        .length
    }
    return i
  })

export const filterAllFetched = r => r.fetched && r.indicators.filter((i) => i.fetched).length

export const dateText = date => moment(date, 'YYYY-MM-DD').format('DD MMM YYYY')

export const getLogo = logo => logo
  ? logo.replace('://localhost', 's://rsr.akvo.org').replace('s://rsr3.akvotest.org', 's://rsr.akvo.org')
  : images.default
