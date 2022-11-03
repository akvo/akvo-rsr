import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getJobStatusByRootPeriod } from './services'

import * as actions from './store/actions'

const PeriodJob = ({ periodId, jobs: initialJobs, setRootPeriodJobStatus }) => {
  const [preload, setPreload] = useState({
    fetched: true,
    created: true
  })
  const [jobs, setJobs] = useState(initialJobs)

  useEffect(() => {
    if (preload.fetched && jobs === undefined) {
      setPreload({
        ...preload,
        fetched: false,
      })
      getJobStatusByRootPeriod(periodId)
        ?.then((results) => {
          setJobs(results)
        })
        ?.catch(() => {
          setPreload({
            fetched: false,
            created: false
          })
        })
    }
    if (!preload.fetched && preload.created && jobs !== undefined) {
      setPreload({
        fetched: false,
        created: false
      })
      setRootPeriodJobStatus(periodId, jobs)
    }
  }, [preload, jobs])
  return null
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(PeriodJob)
