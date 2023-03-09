import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import useSWR from 'swr'
import { connect } from 'react-redux'

import { Empty, Icon, Spin } from 'antd'
import api from '../../utils/api'
import InitialView from './InitialView'
import ProgramView from './ProgramView'
import {
  handleOnCountFiltering,
  handleOnFilterResult,
  handleOnMapFiltering,
  handleOnMapSearching,
} from './utils/query'
import * as actions from '../program/store/actions'
import FilterBar from './FilterBar'
import { getStatusFiltering } from './utils/filters'

const Program = ({
  params,
  programmeRdr: results,
  filterRdr: filtering,
  setProgrammeResults
}) => {
  const [preload, setPreload] = useState(true)
  const [search, setSearch] = useState(null)
  const [timer, setTimer] = useState(null)
  const [loader, setLoader] = useState(false)
  const [programID, setProgramID] = useState(null)
  /**
   * Get results without actual value in each periods and contributors
   * to show all basic information before user expand the collapsible component.
   */
  const { data: apiData, error: apiError } = useSWR(
    `/program/${params.projectId}/results/?format=json`,
    url => api.get(url).then(res => res.data)
  )

  const { results: apiResults, targetsAt } = apiData || {}

  const handleOnSearch = (keyword) => {
    setLoader(true)
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        setLoader(false)
        setSearch(keyword)
      }, 1500)
    )
  }

  useEffect(() => {
    if (preload && (apiResults !== undefined) && !programID) {
      /**
       * Set programmeResults state and programID to store current program overview
       */
      setProgramID(params.projectId)
      setProgrammeResults(apiResults)
      setPreload(false)
    }
    if (preload && apiError) {
      setPreload(false)
    }
    /**
     * Set empty results when switching / move to another program.
     */
    if ((programID !== params.projectId) && !preload) {
      setProgrammeResults([])
      setPreload(true)
    }
  }, [programID, preload, results, apiResults, apiError, params])


  const _results = results
    ?.map((r) => handleOnMapSearching(r, search))
    ?.map((r) => handleOnMapFiltering(r, filtering, search))
    ?.filter((r) => handleOnFilterResult(r, filtering, search))
  const totalMatches = handleOnCountFiltering(_results, filtering, search)
  const { hasAnyFilters } = getStatusFiltering(filtering)
  return (
    <>
      <div id="program-filter-bar">
        <div className="ui container">
          <FilterBar
            programID={params.projectId}
            {...{ search, setSearch, handleOnSearch, totalMatches }}
          />
        </div>
      </div>
      <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning={loader}>
        <div className="ui container">
          <div className="program-view">
            {((apiResults && apiResults.length === 0) || apiError) && <Redirect to={`/programs/${params.projectId}/editor`} />}
            {
              /**
               * Render initial results instead of loading indicator in entire page
               */
              (!apiData) && <InitialView {...{ search, targetsAt }} loading={!(apiResults)} />
            }
            {(apiData) && <ProgramView results={_results} {...{ search, targetsAt }} />}
            {
              /**
               * Show empty indicator / no data when search or filter results return no results
               */
              ((hasAnyFilters || search) && !_results?.length) && <Empty />
            }
          </div>
        </div>
      </Spin>
    </>
  )
}

export default connect(
  ({ programmeRdr, filterRdr }) => ({ programmeRdr, filterRdr }), actions
)(Program)
