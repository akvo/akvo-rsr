import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useSWR from 'swr'

import api from '../../utils/api'
import { getAllContributors } from '../../utils/misc'
import * as actions from '../program/store/actions'

const ActualValueApi = ({
  periodID,
  contributors,
  updateReportingPeriod,
  match: { params },
  recursively = false
}) => {
  const [preload, setPreload] = useState(true)

  const cbs = recursively ? getAllContributors(contributors) : contributors
  const ids = [periodID, ...cbs?.map((cb) => cb?.id)]
  const { data: apiData, error: apiError } = useSWR(
    `/program/${params?.projectId}/indicator_period_by_ids/?format=json&ids=${ids}`,
    url => api.get(url).then(res => res.data)
  )
  useEffect(() => {
    if (preload && apiData && !apiError) {
      const [period, ..._contributors] = apiData
      updateReportingPeriod(period, _contributors)
      setPreload(false)
    }
    if (preload && apiError) {
      setPreload(false)
    }
  }, [preload, apiData])
  return (
    <>
    </>
  )
}

export default connect(
  null, actions
)(withRouter(ActualValueApi))
