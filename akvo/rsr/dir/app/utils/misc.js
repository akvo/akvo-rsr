/* eslint-disable no-useless-escape */
import moment from 'moment'
import countries from './countries.json'

/**
 * Set string as number format by comma as default.
 * */
export const setNumberFormat = (amount, separator = ',') => {
  return amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, separator) : amount
}

/**
 * Calculate days to go until a particular dat
 */
export const daysRemaining = (eventDate) => {
  const finishDate = moment(eventDate)
  const todaysDate = moment()
  return finishDate.diff(todaysDate)
}

/**
 * Generate random number
 */

export function getRandomNumber(min, max) {
  const amount = Math.random() * (max - min) + min
  return amount.toFixed(0)
}

/**
 * Create Group
 */
export function setGrouped(data) {
  return data.reduce((r, a) => {
    r[a.type] = r[a.type] || []
    r[a.type].push(a)
    return r
  }, Object.create(null))
}

export function subString(text) {
  return text ? text.replace(/^(.{35}[^\s]*).*/, `$1${text.length > 50 ? '...' : ''}`) : text
}

export function getProgress(actual, target) {
  const value = target > 0 ? (actual / target) : 0
  return parseFloat(value * 100, 10).toFixed(2).replace(/\.0+$/, '')
}

export function setPaginate(arr, size) {
  return arr.reduce((acc, val, i) => {
    const idx = Math.floor(i / size)
    const page = acc[idx] || (acc[idx] = [])
    page.push(val)

    return acc
  }, [])
}

export function splitStartEndPeriod(text) {
  if (!text) return [null, null]
  const [start, end] = text.split(' - ')
  return [
    moment(start, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    moment(end, 'DD/MM/YYYY').format('YYYY-MM-DD')
  ]
}

export function shorten(str, maxLen, separator = ' ') {
  str = str.replace(/(\r\n|\n|\r)/gm, '')
  if (str.length <= maxLen) return str
  return `${str.substr(0, str.lastIndexOf(separator, maxLen))} ...`
}

export function handleOnCountry(value) {
  return countries
    .map((c) => ({ ...c, code: c.code.toLowerCase() }))
    .find((c) => c.code === value)
}

export const calculateUnitPeriods = periods => {
  const { target, value } = periods.reduce(
    (acc, period) => ({ target: acc.target + period.periodTarget, value: (acc.value + period.value) }),
    { target: 0, value: 0 }
  )
  return target ? (value / target) * 100 : 0
}

export const calculatePercentagePeriods = periods => {
  const { numerator, denominator } = periods.reduce(
    (acc, period) => ({ numerator: acc.numerator + period.numerator, denominator: acc.denominator + period.denominator }),
    { numerator: 0, denominator: 0 }
  )
  return denominator ? (numerator / denominator) * 100 : 0
}
