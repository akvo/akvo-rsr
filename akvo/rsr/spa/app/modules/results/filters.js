import moment from 'moment'

const UPDATE_STATUS_DRAFT = 'D'
const UPDATE_STATUS_REVISION = 'R'
const UPDATE_STATUS_APPROVED = 'A'

export const isPeriodNeedsReporting = (period, timeoutDays = null) => {
  if (period.locked) return false
  if (period.updates.length === 0) return true
  if (timeoutDays && timeoutDays > 0) {
    const uptodate = period.updates.filter((update) => moment().diff(moment(update.createdAt), 'days') < timeoutDays)
    if (uptodate.length === 0) return true
  }
  return period.updates.reduce((result, update) => {
    return result ||
      update.status === UPDATE_STATUS_DRAFT ||
      update.status === UPDATE_STATUS_REVISION
  }, false)
}

export const isPeriodApproved = (period) => {
  if (period.locked) return false
  return period.updates.reduce((result, update) => {
    return result || update.status === UPDATE_STATUS_APPROVED
  }, false)
}
