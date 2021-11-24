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

export const isIndicatorHasStatus = (indicator, uid, mneView = false, status = 'R') => {
  if (indicator) {
    const disableInputs = indicator
      ?.periods
      ?.filter(period => {
        const draftUpdate = period?.updates.find(it => it.status === 'D')
        const pendingUpdate = (period?.updates[0]?.status === 'P' || (indicator?.measure === '2' && period?.updates[0]?.status !== 'R')/* trick % measure update to show as "pending update" */) ? period.updates[0] : null
        const recentUpdate = /* in the last 12 hours AND NOT returned for revision */ period?.updates.filter(it => it?.status !== 'R').find(it => { const minDiff = (new Date().getTime() - new Date(it?.lastModifiedAt).getTime()) / 60000; return minDiff < 720 })
        // the above is used for the M&E view bc their value updates skip the "pending" status
        const submittedUpdate = pendingUpdate || recentUpdate
        return submittedUpdate && !draftUpdate
      })
      ?.length > 0
    let updates = []
    if (indicator?.periods?.length) {
      updates = indicator.periods.filter((p) => p?.updates?.filter((u) => mneView ? u.status === status : u.userDetails.id === uid && u.status === status).length)
    }
    return (
      (mneView && updates.length) ||
      (!mneView && ['A', 'P'].includes(status) && disableInputs && updates.length) ||
      (!mneView && !['A', 'P'].includes(status) && !disableInputs && updates.length)
    )
  }
  return false
}
