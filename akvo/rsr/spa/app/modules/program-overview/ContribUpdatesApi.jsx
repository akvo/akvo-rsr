import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useSWR from 'swr'

import api from '../../utils/api'
import * as actions from '../program/store/actions'

const ContribUpdatesApi = ({
  id,
  contributors,
  match: { params },
  setContributorUpdates,
}) => {
  const [preload, setPreload] = useState(true)
  const ids = [id, ...contributors.map((cb) => cb?.id)]
  const { data: apiData, error: apiError } = useSWR(
    `/program/${params?.projectId}/indicator_updates_by_period_id/?format=json&ids=${ids.join(',')}`,
    url => api.get(url).then(res => res.data)
  )
  useEffect(() => {
    if (preload && (apiData !== undefined) && !apiError) {
      setContributorUpdates(apiData, ids)
      setPreload(false)
    }
    if (preload && apiError) {
      setPreload(false)
    }
  }, [preload, apiData, apiError])
  return (
    <>
    </>
  )
}

export default connect(
  null, actions
)(withRouter(ContribUpdatesApi))
