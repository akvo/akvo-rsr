import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import useSWR from 'swr'
import { connect } from 'react-redux'

import api from '../../utils/api'
import InitialView from './InitialView'
import ProgramView from './ProgramView'
import { handleOnCountFiltering } from '../program/utils/query'
import * as actions from '../program/store/actions'
import FilterBar from '../program/FilterBar'

const Program = ({
  params,
  programmeRdr: results,
  filterRdr: filtering,
  setProgrammeResults
}) => {
  const [preload, setPreload] = useState(true)
  const [search, setSearch] = useState(null)

  const totalMatches = handleOnCountFiltering(results, filtering, search)
  const { data: apiData, error: apiError } = useSWR(`/program/${params.projectId}/results/?format=json`, url => api.get(url).then(res => res.data))
  const { results: res, targetsAt } = apiData || {}

  useEffect(() => {
    if (preload && (!results?.length && res)) {
      setProgrammeResults(res)
      setPreload(false)
    }
    if (preload && results?.length) {
      setPreload(false)
    }
  }, [preload, results, res])
  return (
    <>
      <div id="program-filter-bar">
        <div className="ui container">
          <FilterBar
            programID={params.projectId}
            {...{ search, setSearch, totalMatches }}
          />
        </div>
      </div>
      <div className="ui container">
        <div className="program-view">
          {((res && res.length === 0) || apiError) && <Redirect to={`/programs/${params.projectId}/editor`} />}
          {(!apiData) && <InitialView {...{ search, targetsAt }} loading={!(res)} />}
          {(apiData) && <ProgramView {...{ search, targetsAt }} />}
        </div>
      </div>
    </>
  )
}

export default connect(
  ({ programmeRdr, filterRdr }) => ({ programmeRdr, filterRdr }), actions
)(Program)
