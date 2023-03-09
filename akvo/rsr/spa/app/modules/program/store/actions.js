import actionTypes from './action-types'
/**
 *
 * @param {Array.<Object>} payload
 * Set programmeResults state from response API in order to show all results in program view.
 * @returns {Array.<Object>} - results items
 */
export const setProgrammeResults = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPEND_RESULTS, payload })
}
/**
 *
 * @param {number} resultIndex
 * @param {Array.<Object>} data
 * Update result more details by index key
 * @returns
 */
export const updateProgrammePerResult = (resultIndex, data) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_RESULT, payload: { resultIndex, data } })
}
/**
 *
 * @param {number} rootPeriod - Parent period id
 * @param {Array.<object>} results - Jobs items
 * Set jobs items in root reporting period
 * @returns
 */
export const setRootPeriodJobStatus = (rootPeriod, results) => (dispatch) => {
  dispatch({ type: actionTypes.SET_JOB_STATUS, payload: { rootPeriod, results } })
}
/**
 *
 * @param {number} jobID - Job id from database
 * @param {Array.<object>} data - Latest job status from response API
 * Update job status for selected job by id
 * @returns
 */
export const updateJobStatus = (jobID, data) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_JOB_STATUS, payload: { jobID, data } })
}

/**
 *
 * @param {Object} period
 * @param {Array.<object>} contributors
 * Set actual value on period and each related contributors
 * @returns
 */
export const updateReportingPeriod = (period, contributors) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_CONTRIB_PERIOD, payload: { period, contributors } })
}
/**
 *
 * @param {Array.<object>} updates - Data updates from response API
 * @param {Array} ids - Selected contributor IDs
 * Set updates on each contributor IDs
 * @returns
 */
export const setContributorUpdates = (updates, ids) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_CONTRIB_UPDATES, payload: { updates, ids } })
}
