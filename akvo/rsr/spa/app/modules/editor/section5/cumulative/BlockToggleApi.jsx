import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Field } from 'react-final-form'

import api from '../../../../utils/api'
import * as actions from '../../actions'

const BlockToggleApi = ({
  addContributionCount,
  match: { params },
  id: indicatorID,
  name,
  indicator,
}) => {
  const [preload, setPreload] = useState(true)

  useEffect(() => {
    if (preload && indicator?.contributionCount === undefined) {
      setPreload(false)
      api
        .get(`/project/${params.id}/indicator/${indicatorID}/contribution_count?format=json`)
        .then(({ data }) => {
          addContributionCount(indicatorID, data?.count)
        })
        .catch(() => {
          addContributionCount(indicatorID, null)
        })
    }
    if (
      preload &&
      (indicator?.contributionCount || indicator?.contributionCount === 0)
    ) {
      setPreload(false)
    }
  }, [preload, indicator])

  return (
    <Field
      name={`${name}.contributionCount`}
      render={({ input }) => <span data-contribution-count={input.value} />}
    />
  )
}

export default connect(null, actions)(withRouter(BlockToggleApi))
